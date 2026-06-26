import { z } from 'zod'
import {
  GenresResponseSchema,
  MovieDetailsSchema,
  MovieSchema,
  MultiSearchResponseSchema,
  PaginatedMoviesSchema,
  PersonSchema,
  TVShowSchema,
  type Genre,
  type Movie,
  type MovieDetails,
  type Person,
  type TVShow,
} from './schemas'

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN
const IMAGE_BASE_URL =
  import.meta.env.VITE_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p'

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export type ImageSize = 'w185' | 'w500' | 'w780' | 'original'

export function getImageUrl(
  path: string | null | undefined,
  size: ImageSize = 'w500',
): string | null {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export type SearchResults = {
  movies: Movie[]
  tvShows: TVShow[]
  people: Person[]
}

async function tmdbFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  if (!BASE_URL || !ACCESS_TOKEN) {
    throw new ApiError(
      500,
      'Missing TMDB configuration. Check your .env file.',
    )
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `TMDB request failed: ${response.status} ${response.statusText}`,
    )
  }

  const json: unknown = await response.json()
  return schema.parse(json)
}

function parseSearchResults(results: unknown[]): SearchResults {
  const movies: Movie[] = []
  const tvShows: TVShow[] = []
  const people: Person[] = []

  for (const item of results) {
    if (typeof item !== 'object' || item === null) continue

    const record = item as Record<string, unknown>
    const mediaType = record.media_type

    if (mediaType === 'movie') {
      const parsed = MovieSchema.safeParse(item)
      if (parsed.success) movies.push(parsed.data)
      continue
    }

    if (mediaType === 'tv') {
      const parsed = TVShowSchema.safeParse(item)
      if (parsed.success) tvShows.push(parsed.data)
      continue
    }

    if (mediaType === 'person') {
      const parsed = PersonSchema.safeParse(item)
      if (parsed.success) people.push(parsed.data)
    }
  }

  return { movies, tvShows, people }
}

export async function fetchTrending(): Promise<Movie[]> {
  const data = await tmdbFetch('/trending/movie/day', PaginatedMoviesSchema)
  return data.results
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  const data = await tmdbFetch('/movie/popular', PaginatedMoviesSchema)
  return data.results
}

export async function fetchGenres(): Promise<Genre[]> {
  const data = await tmdbFetch('/genre/movie/list', GenresResponseSchema)
  return data.genres
}

export async function fetchMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data = await tmdbFetch(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`,
    PaginatedMoviesSchema,
  )
  return data.results
}

export async function searchMulti(query: string): Promise<SearchResults> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { movies: [], tvShows: [], people: [] }
  }

  const data = await tmdbFetch(
    `/search/multi?query=${encodeURIComponent(trimmed)}&include_adult=false`,
    MultiSearchResponseSchema,
  )

  return parseSearchResults(data.results)
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbFetch(
    `/movie/${id}?append_to_response=credits,similar,videos`,
    MovieDetailsSchema,
  )
}

export function findYouTubeTrailer(
  videos: MovieDetails['videos'],
): string | null {
  const trailer = videos?.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  )
  return trailer?.key ?? null
}