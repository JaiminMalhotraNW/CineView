import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import type { CustomListItem } from '../core/schemas'
import { collectionStore } from '../data/CollectionStore'
import { CreateListModal } from './CreateListModal'

function PosterCollage({ items }: { items: CustomListItem[] }) {
  const previews = items.slice(0, 4)
  const slots = Array.from({ length: 4 }, (_, index) => previews[index] ?? null)

  return (
    <div className="grid aspect-[2/3] grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
      {slots.map((item, index) => {
        const posterUrl = item
          ? getImageUrl(item.mediaSnapshot.poster_path, 'w500')
          : null

        return (
          <div key={index} className="relative overflow-hidden">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={`h-full w-full ${theme.placeholderBox}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export const CustomListsPage = observer(function CustomListsPage() {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.heading}`}>
            {t('collection.lists.title')}
          </h1>
          <p className={`mt-1 text-sm ${theme.subheading}`}>
            {t('collection.lists.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={theme.btnPrimary}
        >
          {t('collection.lists.createButton')}
        </button>
      </div>

      {collectionStore.customLists.length === 0 ? (
        <div className={`rounded-2xl p-10 text-center ${theme.card}`}>
          <h2 className={`text-xl font-semibold ${theme.heading}`}>
            {t('collection.lists.emptyTitle')}
          </h2>
          <p className={`mt-2 text-sm ${theme.subheading}`}>
            {t('collection.lists.emptyDescription')}
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`mt-6 ${theme.btnPrimary}`}
          >
            {t('collection.lists.createButton')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionStore.customLists.map((list) => (
            <Link
              key={list.id}
              to={`/lists/${list.id}`}
              className={`overflow-hidden transition hover:ring-2 hover:ring-red-500/40 ${theme.card}`}
            >
              <div className="p-3">
                <PosterCollage items={list.items} />
              </div>
              <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                <h2 className={`line-clamp-1 text-lg font-semibold ${theme.heading}`}>
                  {list.name}
                </h2>
                {list.description && (
                  <p className={`mt-1 line-clamp-2 text-sm ${theme.subheading}`}>
                    {list.description}
                  </p>
                )}
                <p className={`mt-2 text-xs ${theme.hint}`}>
                  {t('collection.lists.itemCount', { count: list.items.length })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
})