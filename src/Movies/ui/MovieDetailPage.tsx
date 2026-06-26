import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ApiError,
  fetchMovieDetails,
  findYouTubeTrailer,
  getImageUrl,
} from '../../Common/core/api'
import type { MovieDetails } from '../../Common/core/schemas'
import { ContentRow } from './ContentRow'
import { TrailerModal } from './TrailerModal'

type PageState = 'loading' | 'success' | 'error'

export function MovieDetailPage() {
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
      <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">
        Loading movie details...
      </div>
    )
  }

  if (pageState === 'error' || !movie) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <h1 className="text-2xl font-bold text-white">Movie Not Found</h1>
        <p className="mt-3 text-sm text-zinc-400">
          We couldn&apos;t load this movie. The ID may be invalid or the
          request failed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Back to Home
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
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40" />

        <div className="relative grid gap-6 p-6 md:grid-cols-[180px_1fr] md:p-8">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div className="flex min-h-[270px] items-center justify-center rounded-xl bg-zinc-800 p-4 text-center text-zinc-400">
              {movie.title}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-300">
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
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
              {movie.overview || 'No overview available.'}
            </p>

            {youtubeTrailerKey && (
              <button
                type="button"
                onClick={() => setTrailerKey(youtubeTrailerKey)}
                className="mt-6 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </section>

      {cast.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((member) => {
              const profileUrl = getImageUrl(member.profile_path, 'w185')

              return (
                <article key={member.id} className="w-28 shrink-0 text-center">
                  {profileUrl ? (
                    <img
                      src={profileUrl}
                      alt={member.name}
                      className="mx-auto aspect-square w-24 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mx-auto flex aspect-square w-24 items-center justify-center rounded-full bg-zinc-800 text-sm text-zinc-400">
                      {member.name.slice(0, 1)}
                    </div>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-white">
                    {member.name}
                  </p>
                  <p className="line-clamp-2 text-xs text-zinc-500">
                    {member.character}
                  </p>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {similarMovies.length > 0 && (
        <ContentRow title="Similar Movies" movies={similarMovies} />
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