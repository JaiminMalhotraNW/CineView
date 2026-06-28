import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchTVShowDetails, getImageUrl } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import type { TVShowDetails } from '../../Common/core/schemas'
import { AddToListPopover } from '../../Collection/ui/AddToListPopover'
import { WatchlistToggle } from '../../Collection/ui/WatchlistToggle'
import { collectionStore } from '../../Collection/data/CollectionStore'

type PageState = 'loading' | 'success' | 'error'

export const ShowDetailPage = observer(function ShowDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [show, setShow] = useState<TVShowDetails | null>(null)

  useEffect(() => {
    const showId = Number(id)
    if (!id || Number.isNaN(showId)) {
      setPageState('error')
      return
    }

    let cancelled = false
    fetchTVShowDetails(showId)
      .then((data) => {
        if (!cancelled) {
          setShow(data)
          setPageState('success')
        }
      })
      .catch(() => {
        if (!cancelled) setPageState('error')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (pageState === 'loading') {
    return (
      <div className={`flex min-h-[40vh] items-center justify-center ${theme.subheading}`}>
        {t('tvShows.loading')}
      </div>
    )
  }

  if (pageState === 'error' || !show) {
    return (
      <div className={`mx-auto max-w-lg p-8 text-center ${theme.card}`}>
        <h1 className={`text-2xl font-bold ${theme.heading}`}>
          {t('tvShows.notFound')}
        </h1>
        <Link to="/" className={`mt-6 inline-block ${theme.btnPrimary}`}>
          {t('movies.backToHome')}
        </Link>
      </div>
    )
  }

  const posterUrl = getImageUrl(show.poster_path, 'w500')
  const seasons =
    show.seasons?.filter((s) => s.season_number > 0 && s.episode_count > 0) ?? []
  const watchedCount = collectionStore.getTotalWatchedEpisodesForShow(show.id)

  return (
    <div className="space-y-8">
      <section className={`overflow-hidden ${theme.card}`}>
        <div className="grid gap-6 p-6 md:grid-cols-[160px_1fr]">
          {posterUrl ? (
            <img src={posterUrl} alt={show.name} className="rounded-xl object-cover" />
          ) : (
            <div className={`flex min-h-[240px] items-center justify-center p-4 ${theme.placeholderBox}`}>
              {show.name}
            </div>
          )}
          <div>
            <h1 className={`text-3xl font-bold ${theme.heading}`}>{show.name}</h1>
            <p className={`mt-2 text-sm ${theme.subheading}`}>
              ★ {show.vote_average.toFixed(1)}
              {show.first_air_date && ` · ${show.first_air_date.slice(0, 4)}`}
            </p>
            {watchedCount > 0 && (
              <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                {t('collection.episodesWatched', { count: watchedCount })}
              </p>
            )}
            <p className={`mt-4 text-sm leading-7 ${theme.subheading}`}>
              {show.overview || t('movies.noOverview')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <WatchlistToggle media={show} variant="detail" />
              <AddToListPopover media={show} variant="detail" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={`text-xl font-semibold ${theme.heading}`}>
          {t('tvShows.seasons')}
        </h2>
        {seasons.length === 0 ? (
          <p className={`text-sm ${theme.subheading}`}>{t('tvShows.noSeasons')}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {seasons.map((season) => (
              <Link
                key={season.id}
                to={`/show/${show.id}/season/${season.season_number}`}
                className={`flex items-center gap-3 rounded-xl border p-3 transition hover:border-red-500/40 hover:ring-2 hover:ring-red-500/20 ${theme.card}`}
              >
                {getImageUrl(season.poster_path, 'w185') ? (
                  <img
                    src={getImageUrl(season.poster_path, 'w185')!}
                    alt=""
                    className="h-16 w-11 rounded object-cover"
                  />
                ) : (
                  <div className={`h-16 w-11 ${theme.placeholderBox}`} />
                )}
                <div>
                  <p className={`font-medium ${theme.heading}`}>{season.name}</p>
                  <p className={`text-xs ${theme.hint}`}>
                    {t('tvShows.episodeCount', { count: season.episode_count })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
})