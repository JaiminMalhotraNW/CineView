import type { Genre } from '../../Common/core/schemas'

type GenreFilterProps = {
  genres: Genre[]
  activeGenreId: number | null
  onSelect: (genreId: number | null) => void
}

export function GenreFilter({
  genres,
  activeGenreId,
  onSelect,
}: GenreFilterProps) {
  const chipClass = (isActive: boolean) =>
    [
      'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
      isActive
        ? 'border-red-500 bg-red-600 text-white'
        : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white',
    ].join(' ')

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