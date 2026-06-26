import { z } from 'zod'

export const WatchlistStatusSchema = z.enum([
  'want to watch',
  'watching',
  'completed',
])

export const WatchlistMediaTypeSchema = z.enum(['movie', 'tv'])

export const MediaSnapshotSchema = z.object({
  title: z.string(),
  poster_path: z.string().nullable(),
  vote_average: z.number(),
})

export const WatchlistEntrySchema = z.object({
  id: z.string().uuid(),
  mediaId: z.number(),
  mediaType: WatchlistMediaTypeSchema,
  status: WatchlistStatusSchema,
  note: z.string().max(300).optional(),
  addedAt: z.number(),
  mediaSnapshot: MediaSnapshotSchema,
})

export const WatchlistEntriesSchema = z.array(WatchlistEntrySchema)

export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>
export type WatchlistMediaType = z.infer<typeof WatchlistMediaTypeSchema>
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>
export type WatchlistFilter = 'all' | WatchlistStatus
export type WatchlistSort = 'dateAdded' | 'title'