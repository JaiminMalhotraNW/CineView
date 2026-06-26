import { getImageUrl } from '../../Common/core/api'
import type { Movie } from '../../Common/core/schemas'

type HeroBannerProps = {
  movie: Movie
  onWatchTrailer: () => void
}

export function HeroBanner({ movie, onWatchTrailer }: HeroBannerProps) {
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')

  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-2xl">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

      <div className="relative flex min-h-[420px] flex-col justify-end p-6 sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
          Trending Now
        </p>
        <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-5xl">
          {movie.title}
        </h1>
        <p className="mt-4 max-w-2xl line-clamp-3 text-sm text-zinc-300 sm:text-base">
          {movie.overview || 'No overview available.'}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-md bg-yellow-500/15 px-3 py-1 text-sm font-semibold text-yellow-400">
            ★ {movie.vote_average.toFixed(1)}
          </span>

          <button
            type="button"
            onClick={onWatchTrailer}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Watch Trailer
          </button>
        </div>
      </div>
    </section>
  )
}