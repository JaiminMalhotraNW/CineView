import { theme } from '../../Common/core/themeClasses'
import type { Movie } from '../../Common/core/schemas'
import { MovieCard } from './MovieCard'

type ContentRowProps = { title: string; movies: Movie[] }

export function ContentRow({ title, movies }: ContentRowProps) {
  if (movies.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className={`text-xl font-semibold ${theme.heading}`}>{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}