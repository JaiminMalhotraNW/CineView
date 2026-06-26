import { useEffect, useState } from 'react'
import { getImageUrl, searchMulti } from '../../Common/core/api'
import type { Movie, Person, TVShow } from '../../Common/core/schemas'
import { Link, useSearchParams } from 'react-router-dom'


const RECENT_SEARCHES_KEY = 'cineview_recent_searches'
const MAX_RECENT_SEARCHES = 5

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return

  const updated = [
    trimmed,
    ...loadRecentSearches().filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCHES)

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
}

function PosterPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-zinc-800 p-3 text-center text-sm text-zinc-400">
      {label}
    </div>
  )
}

function SearchMovieCard({ movie }: { movie: Movie }) {
  const posterUrl = getImageUrl(movie.poster_path, 'w500')

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="aspect-[2/3] w-full rounded-lg object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <PosterPlaceholder label={movie.title} />
      )}
      <p className="mt-2 line-clamp-2 text-sm font-medium text-white group-hover:text-red-400">
        {movie.title}
      </p>
    </Link>
  )
}

function SearchTvCard({ show }: { show: TVShow }) {
  const posterUrl = getImageUrl(show.poster_path, 'w500')

  return (
    <Link to={`/show/${show.id}`} className="group block">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={show.name}
          className="aspect-[2/3] w-full rounded-lg object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <PosterPlaceholder label={show.name} />
      )}
      <p className="mt-2 line-clamp-2 text-sm font-medium text-white group-hover:text-red-400">
        {show.name}
      </p>
    </Link>
  )
}

function SearchPersonCard({ person }: { person: Person }) {
  const profileUrl = getImageUrl(person.profile_path, 'w185')

  return (
    <div className="text-center">
      {profileUrl ? (
        <img
          src={profileUrl}
          alt={person.name}
          className="mx-auto aspect-square w-full max-w-[140px] rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="mx-auto flex aspect-square w-full max-w-[140px] items-center justify-center rounded-full bg-zinc-800 text-sm text-zinc-400">
          {person.name.slice(0, 1)}
        </div>
      )}
      <p className="mt-2 text-sm font-medium text-white">{person.name}</p>
      {person.known_for_department && (
        <p className="text-xs text-zinc-500">{person.known_for_department}</p>
      )}
    </div>
  )
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  
  const [searchParams] = useSearchParams()

  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])
  // Read ?q= from URL (Navbar submits here)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) {
      setQuery(q)
      setDebouncedQuery(q.trim())
    }
    else {
      setQuery('')
      setDebouncedQuery('')
    }
  }, [searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 500)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!debouncedQuery) {
      setMovies([])
      setTvShows([])
      setPeople([])
      setError(null)
      return
    }

    let cancelled = false

    async function runSearch() {
      setIsLoading(true)
      setError(null)

      try {
        const results = await searchMulti(debouncedQuery)
        if (cancelled) return

        setMovies(results.movies)
        setTvShows(results.tvShows)
        setPeople(results.people)
        saveRecentSearch(debouncedQuery)
        setRecentSearches(loadRecentSearches())
      } catch {
        if (!cancelled) {
          setError('Search failed. Please try again.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    runSearch()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  const showRecent = query.trim().length === 0 && recentSearches.length > 0
  const hasResults = movies.length > 0 || tvShows.length > 0 || people.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Search</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Find movies, TV shows, and people
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies, shows, people..."
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      />

      {showRecent && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Recent Searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-red-500 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-zinc-400">Searching...</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {!isLoading && debouncedQuery && !hasResults && !error && (
        <p className="text-sm text-zinc-400">
          No results found for &quot;{debouncedQuery}&quot;.
        </p>
      )}

      {movies.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Movies</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <SearchMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">TV Shows</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tvShows.map((show) => (
              <SearchTvCard key={show.id} show={show} />
            ))}
          </div>
        </section>
      )}

      {people.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">People</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {people.map((person) => (
              <SearchPersonCard key={person.id} person={person} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}