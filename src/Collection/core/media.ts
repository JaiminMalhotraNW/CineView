import type { Movie, TVShow } from '../../Common/core/schemas'
import type { WatchlistMediaType } from './schemas'

export type WatchlistMedia = Movie | TVShow

export function getWatchlistMediaType(media: WatchlistMedia): WatchlistMediaType {
  return 'title' in media ? 'movie' : 'tv'
}

export function getWatchlistMediaTitle(media: WatchlistMedia): string {
  return 'title' in media ? media.title : media.name
}