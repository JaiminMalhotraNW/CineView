import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getImageUrl } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import { collectionStore } from '../data/CollectionStore'

export const ListDetailPage = observer(function ListDetailPage() {
  const { t } = useTranslation()
  const { listId } = useParams()
  const navigate = useNavigate()

  const list = listId ? collectionStore.getListById(listId) : undefined

  const [isEditingName, setIsEditingName] = useState(false)
  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    if (list) {
      setDraftName(list.name)
      setIsEditingName(false)
    }
  }, [list?.id, list?.name])

  if (!listId || !list) {
    return (
      <div className={`mx-auto max-w-lg p-8 text-center ${theme.card}`}>
        <h1 className={`text-2xl font-bold ${theme.heading}`}>
          {t('collection.lists.notFoundTitle')}
        </h1>
        <p className={`mt-3 text-sm ${theme.subheading}`}>
          {t('collection.lists.notFoundDescription')}
        </p>
        <Link to="/lists" className={`mt-6 inline-block ${theme.btnPrimary}`}>
          {t('collection.lists.backToLists')}
        </Link>
      </div>
    )
  }

  const saveName = () => {
    const trimmed = draftName.trim()
    if (!trimmed) {
      setDraftName(list.name)
      setIsEditingName(false)
      return
    }

    collectionStore.renameList(list.id, trimmed)
    setIsEditingName(false)
  }

  const handleDeleteList = () => {
    if (!window.confirm(t('collection.lists.deleteConfirm'))) return
    collectionStore.deleteList(list.id)
    navigate('/lists', { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {isEditingName ? (
            <input
              type="text"
              value={draftName}
              maxLength={60}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={saveName}
              onKeyDown={(event) => {
                if (event.key === 'Enter') saveName()
                if (event.key === 'Escape') {
                  setDraftName(list.name)
                  setIsEditingName(false)
                }
              }}
              className={`${theme.inputLg} text-2xl font-bold`}
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className={`text-left text-2xl font-bold ${theme.heading}`}
              title={t('collection.lists.renameHint')}
            >
              {list.name}
            </button>
          )}

          {list.description && (
            <p className={`mt-2 text-sm ${theme.subheading}`}>{list.description}</p>
          )}

          <p className={`mt-2 text-xs ${theme.hint}`}>
            {t('collection.lists.itemCount', { count: list.items.length })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/lists" className={theme.btnSecondary}>
            {t('collection.lists.backToLists')}
          </Link>
          <button
            type="button"
            onClick={handleDeleteList}
            className="rounded-lg bg-red-600/10 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600/20 dark:text-red-400"
          >
            {t('collection.lists.deleteList')}
          </button>
        </div>
      </div>

      {list.items.length === 0 ? (
        <div className={`rounded-2xl p-10 text-center ${theme.card}`}>
          <p className={`text-sm ${theme.subheading}`}>
            {t('collection.lists.detailEmpty')}
          </p>
          <Link to="/" className={`mt-6 inline-block ${theme.btnPrimary}`}>
            {t('collection.lists.browseHome')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.items.map((item) => {
            const posterUrl = getImageUrl(item.mediaSnapshot.poster_path, 'w500')
            const detailPath =
              item.mediaType === 'movie'
                ? `/movie/${item.mediaId}`
                : `/show/${item.mediaId}`

            return (
              <article
                key={`${item.mediaType}-${item.mediaId}`}
                className={`overflow-hidden ${theme.card}`}
              >
                <Link to={detailPath} className="block">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={item.mediaSnapshot.title}
                      className="aspect-[2/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`flex aspect-[2/3] items-center justify-center p-3 text-center text-sm ${theme.placeholderBox}`}
                    >
                      {item.mediaSnapshot.title}
                    </div>
                  )}
                </Link>

                <div className="space-y-2 p-3">
                  <h3 className={`line-clamp-2 text-sm font-semibold ${theme.heading}`}>
                    {item.mediaSnapshot.title}
                  </h3>
                  <p className={`text-xs ${theme.hint}`}>
                    ★ {item.mediaSnapshot.vote_average.toFixed(1)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      collectionStore.removeItemFromList(
                        list.id,
                        item.mediaId,
                        item.mediaType,
                      )
                    }
                    className={`w-full ${theme.btnSecondary}`}
                  >
                    {t('collection.lists.removeFromList')}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
})