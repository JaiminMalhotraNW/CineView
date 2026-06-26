import { z } from 'zod'

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  release_date: z.string(),
  genre_ids: z.array(z.number()).optional(),
  media_type: z.literal('movie').optional(),
})

export const TVShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  first_air_date: z.string(),
  genre_ids: z.array(z.number()).optional(),
  media_type: z.literal('tv').optional(),
})

export const PersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  profile_path: z.string().nullable(),
  known_for_department: z.string().optional(),
  media_type: z.literal('person').optional(),
})

export const VideoSchema = z.object({
  id: z.union([z.string(), z.number()]),
  key: z.string(),
  site: z.string(),
  type: z.string(),
  name: z.string(),
})

export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
})

export const PaginatedMoviesSchema = z.object({
  page: z.number(),
  results: z.array(MovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export const GenresResponseSchema = z.object({
  genres: z.array(GenreSchema),
})

export const MultiSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(z.unknown()),
  total_pages: z.number(),
  total_results: z.number(),
})

export const MovieDetailsSchema = MovieSchema.extend({
  runtime: z.number().nullable().optional(),
  genres: z.array(GenreSchema).optional(),
  credits: z
    .object({
      cast: z.array(CastMemberSchema),
    })
    .optional(),
  similar: z
    .object({
      results: z.array(MovieSchema),
    })
    .optional(),
  videos: z
    .object({
      results: z.array(VideoSchema),
    })
    .optional(),
})

export type Genre = z.infer<typeof GenreSchema>
export type Movie = z.infer<typeof MovieSchema>
export type TVShow = z.infer<typeof TVShowSchema>
export type Person = z.infer<typeof PersonSchema>
export type Video = z.infer<typeof VideoSchema>
export type CastMember = z.infer<typeof CastMemberSchema>
export type MovieDetails = z.infer<typeof MovieDetailsSchema>