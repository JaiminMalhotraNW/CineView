import { useEffect, useMemo, useState } from 'react'
import { SectionErrorBoundary } from '../../Common/ui/SectionErrorBoundary'
import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchPopularMovies,
  fetchMovieDetails,
  fetchTrending,
  findYouTubeTrailer,
} from '../../Common/core/api'
import type { Genre, Movie } from '../../Common/core/schemas'
import { ContentRow } from './ContentRow'
import { GenreFilter } from './GenreFilter'
import { HeroBanner } from './HeroBanner'
import { TrailerModal } from './TrailerModal'

function filterByGenre(movies: Movie[], genreId: number | null) {
  if (genreId === null) return movies
  return movies.filter((movie) => movie.genre_ids?.includes(genreId))
}

export function HomePage() {
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
        const [trendingData, popularData, genreData] = await Promise.all([
          fetchTrending(),
          fetchPopularMovies(),
          fetchGenres(),
        ])

        if (cancelled) return

        setTrending(trendingData)
        setPopular(popularData)
        setGenres(genreData)
      } catch {
        if (!cancelled) {
          setError('Failed to load discovery content. Please try again later.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadHomeData()

    return () => {
      cancelled = true
    }
  }, [])

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

  const featuredMovie = trending[0] ?? null

  const filteredTrending = useMemo(
    () => filterByGenre(trending, activeGenreId),
    [trending, activeGenreId],
  )

  const filteredPopular = useMemo(
    () => filterByGenre(popular, activeGenreId),
    [popular, activeGenreId],
  )

  const handleWatchTrailer = async () => {
    if (!featuredMovie) return

    try {
      const details = await fetchMovieDetails(featuredMovie.id)
      const key = findYouTubeTrailer(details.videos)

      if (key) {
        setTrailerKey(key)
        setTrailerTitle(featuredMovie.title)
        return
      }

      setError('No trailer available for this title.')
    } catch {
      setError('Unable to load trailer.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">
        Loading discovery content...
      </div>
    )
  }

  if (error && !featuredMovie) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {featuredMovie && (
        <SectionErrorBoundary>
          <HeroBanner movie={featuredMovie} onWatchTrailer={handleWatchTrailer} />
        </SectionErrorBoundary>
      )}

      <GenreFilter
        genres={genres}
        activeGenreId={activeGenreId}
        onSelect={setActiveGenreId}
      />

      <SectionErrorBoundary>
        <ContentRow title="Trending" movies={filteredTrending} />
      </SectionErrorBoundary>

      <SectionErrorBoundary>
        <ContentRow title="Popular" movies={filteredPopular} />
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