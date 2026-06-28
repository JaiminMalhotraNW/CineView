import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { WatchlistToggle } from '../../Collection/ui/WatchlistToggle'
import { useTranslation } from 'react-i18next'
import {
  fetchMovieDetails,
  findYouTubeTrailer,
  getImageUrl,
} from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import { AddToListPopover } from '../../Collection/ui/AddToListPopover'
import type { MovieDetails } from '../../Common/core/schemas'
import { ContentRow } from './ContentRow'
import { TrailerModal } from './TrailerModal'

type PageState = 'loading' | 'success' | 'error'

export function MovieDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  useEffect(() => {
    const movieId = Number(id)

    if (!id || Number.isNaN(movieId)) {
      setPageState('error')
      return
    }

    let cancelled = false

    async function loadMovie() {
      setPageState('loading')

      try {
        const data = await fetchMovieDetails(movieId)
        if (!cancelled) {
          setMovie(data)
          setPageState('success')
        }
      } catch (error) {
        if (!cancelled) {
          setMovie(null)
          setPageState('error')
          console.error('Failed to load movie details:', error)
        }
      }
    }

    loadMovie()

    return () => {
      cancelled = true
    }
  }, [id])

  if (pageState === 'loading') {
    return (
      <div
        className={`flex min-h-[50vh] items-center justify-center ${theme.subheading}`}
      >
        {t('movies.loadingDetails')}
      </div>
    )
  }

  if (pageState === 'error' || !movie) {
    return (
      <div className={`mx-auto max-w-lg p-8 text-center ${theme.card}`}>
        <h1 className={`text-2xl font-bold ${theme.heading}`}>
          {t('movies.movieNotFound')}
        </h1>
        <p className={`mt-3 text-sm ${theme.subheading}`}>
          {t('movies.movieNotFoundDescription')}
        </p>
        <Link to="/" className={`mt-6 inline-block ${theme.btnPrimary}`}>
          {t('movies.backToHome')}
        </Link>
      </div>
    )
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')
  const posterUrl = getImageUrl(movie.poster_path, 'w500')
  const cast = movie.credits?.cast.slice(0, 12) ?? []
  const similarMovies = movie.similar?.results ?? []
  const youtubeTrailerKey = findYouTubeTrailer(movie.videos)

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className={theme.heroFallback} />
        )}

        <div className={theme.heroOverlay} />
        <div className={theme.heroOverlayBottom} />

        <div className="relative grid gap-6 p-6 text-white md:grid-cols-[180px_1fr] md:p-8">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div
              className={`flex min-h-[270px] items-center justify-center rounded-xl p-4 text-center ${theme.placeholderBox}`}
            >
              {movie.title}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{movie.title}</h1>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-200">
              <span className="rounded-md bg-yellow-500/15 px-3 py-1 font-semibold text-yellow-400">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              {movie.release_date && <span>{movie.release_date}</span>}
              {movie.runtime ? <span>{movie.runtime} min</span> : null}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-zinc-100"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-200 md:text-base">
              {movie.overview || t('movies.noOverview')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {youtubeTrailerKey && (
                <button
                  type="button"
                  onClick={() => setTrailerKey(youtubeTrailerKey)}
                  className={`${theme.btnPrimary} shadow-lg shadow-red-900/30`}
                >
                  {t('movies.watchTrailer')}
                </button>
              )}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-1.5 backdrop-blur-sm">
                <WatchlistToggle media={movie} variant="detail" />
                <AddToListPopover media={movie} variant="detail" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {cast.length > 0 && (
        <section className="space-y-4">
          <h2 className={`text-xl font-semibold ${theme.heading}`}>
            {t('movies.cast')}
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((member) => {
              const profileUrl = getImageUrl(member.profile_path, 'w500')

              return (
                <article key={member.id} className="w-36 shrink-0 text-center">
                  {profileUrl ? (
                    <img
                      src={profileUrl}
                      alt={member.name}
                      className="mx-auto aspect-square w-32 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`mx-auto aspect-square w-32 ${theme.avatarPlaceholder}`}
                    >
                      {member.name.slice(0, 1)}
                    </div>
                  )}
                  <p
                    className={`mt-2 line-clamp-2 text-sm font-medium ${theme.heading}`}
                  >
                    {member.name}
                  </p>
                  <p className={`line-clamp-2 text-xs ${theme.hint}`}>
                    {member.character}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {similarMovies.length > 0 && (
        <ContentRow title={t('movies.similarMovies')} movies={similarMovies} />
      )}

      {trailerKey && (
        <TrailerModal
          trailerKey={trailerKey}
          title={movie.title}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  )
}