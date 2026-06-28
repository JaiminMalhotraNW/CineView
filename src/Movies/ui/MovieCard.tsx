import { Link } from 'react-router-dom'
import { AddToListPopover } from '../../Collection/ui/AddToListPopover'
import { WatchlistToggle } from '../../Collection/ui/WatchlistToggle'
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

      <WatchlistToggle media={movie} />
      <AddToListPopover media={movie} />
    </article>
  )
}