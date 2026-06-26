import { getImageUrl } from '../../Common/core/api'
import type { Movie } from '../../Common/core/schemas'
import { theme } from '../../Common/core/themeClasses'

type HeroBannerProps = {
  movie: Movie
  onWatchTrailer: () => void
}

export function HeroBanner({ movie, onWatchTrailer }: HeroBannerProps) {
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')

  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-2xl">
      {backdropUrl ? (
        <img src={backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className={theme.heroFallback} />
      )}
      <div className={theme.heroOverlay} />
      <div className={theme.heroOverlayBottom} />

      <div className="relative flex min-h-[420px] flex-col justify-end p-6 text-white sm:p-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
          Trending Now
        </p>
        <h1 className="max-w-2xl text-3xl font-bold sm:text-5xl">{movie.title}</h1>
        <p className="mt-4 max-w-2xl line-clamp-3 text-sm text-zinc-200 sm:text-base">
          {movie.overview || 'No overview available.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-md bg-yellow-500/15 px-3 py-1 text-sm font-semibold text-yellow-400">
            ★ {movie.vote_average.toFixed(1)}
          </span>
          <button type="button" onClick={onWatchTrailer} className={theme.btnPrimary}>
            Watch Trailer
          </button>
        </div>
      </div>
    </section>
  )
}