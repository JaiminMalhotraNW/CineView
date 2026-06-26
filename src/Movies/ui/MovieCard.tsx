import { Link } from 'react-router-dom'
import { getImageUrl } from '../../Common/core/api'
import type { Movie } from '../../Common/core/schemas'
import { theme } from '../../Common/core/themeClasses'

type MovieCardProps = { movie: Movie }

function PosterPlaceholder({ title }: { title: string }) {
  return (
    <div className={`aspect-[2/3] w-full ${theme.placeholderBox}`}>
      <span className="line-clamp-4 text-sm font-medium">{title}</span>
    </div>
  )
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, 'w500')

  return (
    <article className="group relative w-40 shrink-0 sm:w-44">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <PosterPlaceholder title={movie.title} />
          )}
          <span className="absolute right-2 top-2 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-yellow-400">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <h3 className={`mt-2 line-clamp-2 text-sm font-medium ${theme.linkTitle}`}>
          {movie.title}
        </h3>
      </Link>
      <button
        type="button"
        aria-label={`Add ${movie.title} to watchlist`}
        className="absolute left-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
        onClick={(event) => event.preventDefault()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </article>
  )
}