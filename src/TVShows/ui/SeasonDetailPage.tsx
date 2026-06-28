import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchSeasonDetails } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import type { SeasonDetails } from '../../Common/core/schemas'
import { EpisodeTracker } from './EpisodeTracker'

type PageState = 'loading' | 'success' | 'error'

export function SeasonDetailPage() {
  const { t } = useTranslation()
  const { id, seasonId } = useParams()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [season, setSeason] = useState<SeasonDetails | null>(null)

  useEffect(() => {
    const showId = Number(id)
    const seasonNumber = Number(seasonId)

    if (!id || !seasonId || Number.isNaN(showId) || Number.isNaN(seasonNumber)) {
      setPageState('error')
      return
    }

    let cancelled = false

    async function loadSeason() {
      setPageState('loading')
      try {
        const data = await fetchSeasonDetails(showId, seasonNumber)
        if (!cancelled) {
          setSeason(data)
          setPageState('success')
        }
      } catch {
        if (!cancelled) {
          setSeason(null)
          setPageState('error')
        }
      }
    }

    loadSeason()
    return () => {
      cancelled = true
    }
  }, [id, seasonId])

  if (pageState === 'loading') {
    return (
      <div className={`flex min-h-[40vh] items-center justify-center ${theme.subheading}`}>
        {t('tvShows.loadingSeason')}
      </div>
    )
  }

  if (pageState === 'error' || !season) {
    return (
      <div className={`mx-auto max-w-lg p-8 text-center ${theme.card}`}>
        <h1 className={`text-2xl font-bold ${theme.heading}`}>
          {t('tvShows.seasonNotFound')}
        </h1>
        <Link to={`/show/${id}`} className={`mt-6 inline-block ${theme.btnPrimary}`}>
          {t('tvShows.backToShow')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/show/${id}`}
          className="text-sm font-medium text-red-500 hover:text-red-400"
        >
          ← {t('tvShows.backToShow')}
        </Link>
        <h1 className={`mt-2 text-2xl font-bold ${theme.heading}`}>
          {season.name}
        </h1>
        {season.overview && (
          <p className={`mt-2 text-sm ${theme.subheading}`}>{season.overview}</p>
        )}
      </div>

      <EpisodeTracker
        showId={Number(id)}
        seasonId={season.id}
        episodes={season.episodes}
      />
    </div>
  )
}