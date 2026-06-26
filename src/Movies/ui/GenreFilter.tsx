import type { Genre } from '../../Common/core/schemas'
import { chipClass } from '../../Common/core/themeClasses'

type GenreFilterProps = {
  genres: Genre[]
  activeGenreId: number | null
  onSelect: (genreId: number | null) => void
}

export function GenreFilter({ genres, activeGenreId, onSelect }: GenreFilterProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={chipClass(activeGenreId === null)}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            type="button"
            onClick={() => onSelect(genre.id)}
            className={chipClass(activeGenreId === genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}