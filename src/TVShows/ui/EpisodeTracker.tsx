import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import type { Episode } from '../../Common/core/schemas'
import { theme } from '../../Common/core/themeClasses'
import { collectionStore } from '../../Collection/data/CollectionStore'

type EpisodeTrackerProps = {
  showId: number
  seasonId: number
  episodes: Episode[]
}

export const EpisodeTracker = observer(function EpisodeTracker({
  showId,
  seasonId,
  episodes,
}: EpisodeTrackerProps) {
  const { t } = useTranslation()

  const total = episodes.length
  const watched = episodes.filter((ep) =>
    collectionStore.isEpisodeWatched(showId, seasonId, ep.id),
  ).length
  const percent = total > 0 ? Math.round((watched / total) * 100) : 0
  const allIds = episodes.map((ep) => ep.id)
  const allWatched = total > 0 && watched === total

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className={theme.subheading}>
            {t('collection.episodes.progress', { watched, total })}
          </span>
          <span className={`font-semibold ${theme.heading}`}>{percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            allWatched
              ? collectionStore.unmarkAllSeason(showId, seasonId)
              : collectionStore.markAllSeason(showId, seasonId, allIds)
          }
          className={theme.btnSecondary}
        >
          {allWatched
            ? t('collection.episodes.unmarkAll')
            : t('collection.episodes.markAll')}
        </button>
      </div>

      <ul className="space-y-2">
        {episodes.map((episode) => {
          const checked = collectionStore.isEpisodeWatched(
            showId,
            seasonId,
            episode.id,
          )

          return (
            <li key={episode.id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                  checked
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    collectionStore.toggleEpisode(
                      showId,
                      seasonId,
                      episode.id,
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500"
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${theme.heading}`}>
                    {t('collection.episodes.episodeLabel', {
                      number: episode.episode_number,
                    })}
                    {episode.name ? `: ${episode.name}` : ''}
                  </p>
                  {episode.overview && (
                    <p className={`mt-1 line-clamp-2 text-xs ${theme.subheading}`}>
                      {episode.overview}
                    </p>
                  )}
                </div>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
})