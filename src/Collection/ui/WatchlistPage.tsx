import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../Common/core/api'
import { chipClass, theme } from '../../Common/core/themeClasses'
import type { WatchlistFilter, WatchlistSort, WatchlistStatus } from '../core/schemas'
import { watchlistStore } from '../data/WatchlistStore'

const STATUS_OPTIONS: WatchlistStatus[] = [
  'want to watch',
  'watching',
  'completed',
]

const FILTER_OPTIONS: WatchlistFilter[] = [
  'all',
  'want to watch',
  'watching',
  'completed',
]

function statusLabelKey(status: WatchlistStatus): string {
  return `collection.status.${status.replace(/ /g, '_')}`
}

function filterLabelKey(filter: WatchlistFilter): string {
  return filter === 'all'
    ? 'collection.filters.all'
    : statusLabelKey(filter)
}

export const WatchlistPage = observer(function WatchlistPage() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<WatchlistFilter>('all')
  const [activeSort, setActiveSort] = useState<WatchlistSort>('dateAdded')

  const entries = watchlistStore.getFilteredAndSorted(activeFilter, activeSort)
  const counts = watchlistStore.countsByStatus

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${theme.heading}`}>
          {t('collection.title')}
        </h1>
        <p className={`mt-1 text-sm ${theme.subheading}`}>
          {t('collection.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => {
            const count =
              filter === 'all'
                ? watchlistStore.totalCount
                : counts[filter]

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={chipClass(activeFilter === filter)}
              >
                {t(filterLabelKey(filter))} ({count})
              </button>
            )
          })}
        </div>

        <label className={`flex items-center gap-2 text-sm ${theme.label}`}>
          <span>{t('collection.sort.label')}</span>
          <select
            value={activeSort}
            onChange={(event) =>
              setActiveSort(event.target.value as WatchlistSort)
            }
            className={theme.select}
          >
            <option value="dateAdded">{t('collection.sort.dateAdded')}</option>
            <option value="title">{t('collection.sort.title')}</option>
          </select>
        </label>
      </div>

      {watchlistStore.totalCount === 0 ? (
        <div className={`rounded-2xl p-10 text-center ${theme.card}`}>
          <h2 className={`text-xl font-semibold ${theme.heading}`}>
            {t('collection.empty.title')}
          </h2>
          <p className={`mt-2 text-sm ${theme.subheading}`}>
            {t('collection.empty.description')}
          </p>
          <Link to="/" className={`mt-6 inline-block ${theme.btnPrimary}`}>
            {t('collection.empty.browse')}
          </Link>
        </div>
      ) : entries.length === 0 ? (
        <div className={`rounded-2xl p-8 text-center ${theme.card}`}>
          <p className={`text-sm ${theme.subheading}`}>
            {t('collection.empty.filtered')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {entries.map((entry) => {
            const posterUrl = getImageUrl(
              entry.mediaSnapshot.poster_path,
              'w500',
            )
            const detailPath =
              entry.mediaType === 'movie'
                ? `/movie/${entry.mediaId}`
                : `/show/${entry.mediaId}`

            return (
              <article
                key={entry.id}
                className={`overflow-hidden rounded-xl ${theme.card}`}
              >
                <Link to={detailPath} className="block">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={entry.mediaSnapshot.title}
                      className="aspect-[2/3] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`flex aspect-[2/3] items-center justify-center p-3 text-center text-sm ${theme.placeholderBox}`}
                    >
                      {entry.mediaSnapshot.title}
                    </div>
                  )}
                </Link>

                <div className="space-y-3 p-3">
                  <div>
                    <h3
                      className={`line-clamp-2 text-sm font-semibold ${theme.heading}`}
                    >
                      {entry.mediaSnapshot.title}
                    </h3>
                    <span className="mt-1 inline-block rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                      {t(statusLabelKey(entry.status))}
                    </span>
                    <p className={`mt-1 text-xs ${theme.hint}`}>
                      ★ {entry.mediaSnapshot.vote_average.toFixed(1)}
                    </p>
                  </div>

                  <label className={`block text-xs ${theme.label}`}>
                    {t('collection.status.label')}
                    <select
                      value={entry.status}
                      onChange={(event) =>
                        watchlistStore.updateStatus(
                          entry.mediaId,
                          entry.mediaType,
                          event.target.value as WatchlistStatus,
                        )
                      }
                      className={`${theme.select} mt-1`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {t(statusLabelKey(status))}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={`block text-xs ${theme.label}`}>
                    {t('collection.note.label')}
                    <textarea
                      value={entry.note ?? ''}
                      maxLength={300}
                      rows={2}
                      placeholder={t('collection.note.placeholder')}
                      onChange={(event) =>
                        watchlistStore.updateNote(
                          entry.mediaId,
                          entry.mediaType,
                          event.target.value,
                        )
                      }
                      className={`${theme.input} mt-1 resize-none text-xs`}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      watchlistStore.removeFromWatchlist(
                        entry.mediaId,
                        entry.mediaType,
                      )
                    }
                    className={`w-full ${theme.btnSecondary}`}
                  >
                    {t('collection.remove')}
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