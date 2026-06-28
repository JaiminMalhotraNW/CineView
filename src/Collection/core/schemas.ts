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

export const CustomListItemSchema = z.object({
  mediaId: z.number(),
  mediaType: WatchlistMediaTypeSchema,
  mediaSnapshot: MediaSnapshotSchema,
})

export const CustomListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(60),
  description: z.string().optional(),
  items: z.array(CustomListItemSchema),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CustomListsSchema = z.array(CustomListSchema)

/** showId → seasonId → watched episodeIds (JSON keys are strings) */
export const SeasonEpisodeProgressSchema = z.record(
  z.string(),
  z.array(z.number()),
)

export const EpisodeProgressSchema = z.record(
  z.string(),
  SeasonEpisodeProgressSchema,
)

export const UnifiedCollectionSchema = z.object({
  watchlist: WatchlistEntriesSchema,
  customLists: CustomListsSchema,
  episodeProgress: EpisodeProgressSchema,
})


export type WatchlistStatus = z.infer<typeof WatchlistStatusSchema>
export type WatchlistMediaType = z.infer<typeof WatchlistMediaTypeSchema>
export type MediaSnapshot = z.infer<typeof MediaSnapshotSchema>
export type WatchlistEntry = z.infer<typeof WatchlistEntrySchema>
export type CustomListItem = z.infer<typeof CustomListItemSchema>
export type CustomList = z.infer<typeof CustomListSchema>
export type SeasonEpisodeProgress = z.infer<typeof SeasonEpisodeProgressSchema>
export type EpisodeProgress = z.infer<typeof EpisodeProgressSchema>
export type UnifiedCollection = z.infer<typeof UnifiedCollectionSchema>
export type WatchlistFilter = 'all' | WatchlistStatus
export type WatchlistSort = 'dateAdded' | 'title'