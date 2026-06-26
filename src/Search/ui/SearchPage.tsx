import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getImageUrl, searchMulti } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import type { Movie, Person, TVShow } from '../../Common/core/schemas'

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
    <div className={`aspect-[2/3] w-full ${theme.placeholderBox}`}>
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
      <p className={`mt-2 line-clamp-2 text-sm font-medium ${theme.linkTitle}`}>
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
      <p className={`mt-2 line-clamp-2 text-sm font-medium ${theme.linkTitle}`}>
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
        <div
          className={`mx-auto aspect-square w-full max-w-[140px] ${theme.avatarPlaceholder}`}
        >
          {person.name.slice(0, 1)}
        </div>
      )}
      <p className={`mt-2 text-sm font-medium ${theme.heading}`}>{person.name}</p>
      {person.known_for_department && (
        <p className={`text-xs ${theme.hint}`}>{person.known_for_department}</p>
      )}
    </div>
  )
}

export function SearchPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setRecentSearches(loadRecentSearches())
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) {
      setQuery(q)
      setDebouncedQuery(q.trim())
    } else {
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
          setError(t('search.failed'))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    runSearch()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, t])

  const showRecent = query.trim().length === 0 && recentSearches.length > 0
  const hasResults = movies.length > 0 || tvShows.length > 0 || people.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl font-bold ${theme.heading}`}>
          {t('search.title')}
        </h1>
        <p className={`mt-2 text-sm ${theme.subheading}`}>
          {t('search.subtitle')}
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t('search.placeholder')}
        className={theme.inputLg}
      />

      {showRecent && (
        <div className="space-y-3">
          <h2
            className={`text-sm font-semibold uppercase tracking-wide ${theme.subheading}`}
          >
            {t('search.recentSearches')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className={theme.recentChip}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <p className={`text-sm ${theme.subheading}`}>{t('search.searching')}</p>
      )}

      {error && <div className={theme.errorBox}>{error}</div>}

      {!isLoading && debouncedQuery && !hasResults && !error && (
        <p className={`text-sm ${theme.subheading}`}>
          {t('search.noResults', { query: debouncedQuery })}
        </p>
      )}

      {movies.length > 0 && (
        <section className="space-y-4">
          <h2 className={`text-xl font-semibold ${theme.heading}`}>
            {t('search.movies')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <SearchMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section className="space-y-4">
          <h2 className={`text-xl font-semibold ${theme.heading}`}>
            {t('search.tvShows')}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tvShows.map((show) => (
              <SearchTvCard key={show.id} show={show} />
            ))}
          </div>
        </section>
      )}

      {people.length > 0 && (
        <section className="space-y-4">
          <h2 className={`text-xl font-semibold ${theme.heading}`}>
            {t('search.people')}
          </h2>
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