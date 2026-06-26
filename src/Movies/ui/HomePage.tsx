import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theme } from '../../Common/core/themeClasses'
import { SectionErrorBoundary } from '../../Common/ui/SectionErrorBoundary'
import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchPopularMovies,
  fetchMovieDetails,
  fetchTVShowDetails,
  fetchTrending,
  fetchTrendingAll,
  findYouTubeTrailer,
  type HeroItem,
} from '../../Common/core/api'
import type { Genre, Movie } from '../../Common/core/schemas'
import { ContentRow } from './ContentRow'
import { GenreFilter } from './GenreFilter'
import { HeroCarousel } from './HeroCarousel'
import { TrailerModal } from './TrailerModal'

function filterByGenre(movies: Movie[], genreId: number | null) {
  if (genreId === null) return movies
  return movies.filter((movie) => movie.genre_ids?.includes(genreId))
}

export function HomePage() {
  const { t } = useTranslation()

  const [heroItems, setHeroItems] = useState<HeroItem[]>([])
  const [trending, setTrending] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [genreMovies, setGenreMovies] = useState<Movie[]>([])
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [trailerTitle, setTrailerTitle] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadHomeData() {
      setIsLoading(true)
      setError(null)

      try {
        const [heroData, trendingData, popularData, genreData] =
          await Promise.all([
            fetchTrendingAll(10),
            fetchTrending(),
            fetchPopularMovies(),
            fetchGenres(),
          ])

        if (cancelled) return

        setHeroItems(heroData)
        setTrending(trendingData)
        setPopular(popularData)
        setGenres(genreData)
      } catch {
        if (!cancelled) {
          setError(t('movies.loadFailed'))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [t])

  useEffect(() => {
    if (activeGenreId === null) {
      setGenreMovies([])
      return
    }

    let cancelled = false

    fetchMoviesByGenre(activeGenreId)
      .then((movies) => {
        if (!cancelled) setGenreMovies(movies)
      })
      .catch(() => {
        if (!cancelled) setGenreMovies([])
      })

    return () => {
      cancelled = true
    }
  }, [activeGenreId])

  const filteredTrending = useMemo(
    () => filterByGenre(trending, activeGenreId),
    [trending, activeGenreId],
  )

  const filteredPopular = useMemo(
    () => filterByGenre(popular, activeGenreId),
    [popular, activeGenreId],
  )

  const handleWatchTrailer = async (item: HeroItem) => {
    try {
      const details =
        item.mediaType === 'movie'
          ? await fetchMovieDetails(item.id)
          : await fetchTVShowDetails(item.id)

      const key = findYouTubeTrailer(details.videos)

      if (key) {
        setTrailerKey(key)
        setTrailerTitle(item.title)
        return
      }

      setError(t('movies.noTrailer'))
    } catch {
      setError(t('movies.trailerLoadFailed'))
    }
  }

  if (isLoading) {
    return (
      <div
        className={`flex min-h-[50vh] items-center justify-center ${theme.subheading}`}
      >
        {t('movies.loadingDiscovery')}
      </div>
    )
  }

  if (error && heroItems.length === 0) {
    return <div className={theme.errorBoxLg}>{error}</div>
  }

  return (
    <div className="space-y-8">
      {error && <div className={theme.errorBox}>{error}</div>}

      {heroItems.length > 0 && (
        <SectionErrorBoundary>
          <HeroCarousel
            items={heroItems}
            onWatchTrailer={handleWatchTrailer}
          />
        </SectionErrorBoundary>
      )}

      <GenreFilter
        genres={genres}
        activeGenreId={activeGenreId}
        onSelect={setActiveGenreId}
      />

      <SectionErrorBoundary>
        <ContentRow title={t('movies.trending')} movies={filteredTrending} />
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <ContentRow title={t('movies.popular')} movies={filteredPopular} />
      </SectionErrorBoundary>

      {activeGenreId !== null && (
        <SectionErrorBoundary>
          <ContentRow
            title={
              genres.find((genre) => genre.id === activeGenreId)?.name ??
              'Selected Genre'
            }
            movies={genreMovies}
          />
        </SectionErrorBoundary>
      )}

      {trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          title={trailerTitle}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  )
}