import { autorun, makeAutoObservable } from 'mobx'
import {
  getWatchlistMediaTitle,
  getWatchlistMediaType,
  type WatchlistMedia,
} from '../core/media'
import {
  WatchlistEntriesSchema,
  type MediaSnapshot,
  type WatchlistEntry,
  type WatchlistFilter,
  type WatchlistSort,
  type WatchlistStatus,
  type WatchlistMediaType,
} from '../core/schemas'

const STORAGE_KEY = 'cineview_watchlist'

const EMPTY_COUNTS: Record<WatchlistStatus, number> = {
  'want to watch': 0,
  watching: 0,
  completed: 0,
}

function loadEntriesFromStorage(): WatchlistEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    const result = WatchlistEntriesSchema.safeParse(parsed)

    return result.success ? result.data : []
  } catch {
    return []
  }
}

function createMediaSnapshot(media: WatchlistMedia): MediaSnapshot {
  return {
    title: getWatchlistMediaTitle(media),
    poster_path: media.poster_path,
    vote_average: media.vote_average,
  }
}

class WatchlistStore {
  entries: WatchlistEntry[] = []

  constructor() {
    this.entries = loadEntriesFromStorage()
    makeAutoObservable(this)

    autorun(() => {
      const payload = WatchlistEntriesSchema.parse(this.entries)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    })
  }

  get totalCount(): number {
    return this.entries.length
  }

  get countsByStatus(): Record<WatchlistStatus, number> {
    const counts = { ...EMPTY_COUNTS }

    for (const entry of this.entries) {
      counts[entry.status] += 1
    }

    return counts
  }

  isInWatchlist(mediaId: number, mediaType: WatchlistMediaType): boolean {
    return this.entries.some(
      (entry) => entry.mediaId === mediaId && entry.mediaType === mediaType,
    )
  }

  getFilteredAndSorted(
    status: WatchlistFilter,
    sortBy: WatchlistSort,
  ): WatchlistEntry[] {
    let list =
      status === 'all'
        ? [...this.entries]
        : this.entries.filter((entry) => entry.status === status)

    if (sortBy === 'dateAdded') {
      list.sort((a, b) => b.addedAt - a.addedAt)
    } else {
      list.sort((a, b) =>
        a.mediaSnapshot.title.localeCompare(b.mediaSnapshot.title),
      )
    }

    return list
  }

  toggleWatchlist(media: WatchlistMedia): void {
    const mediaType = getWatchlistMediaType(media)
    const existing = this.entries.find(
      (entry) => entry.mediaId === media.id && entry.mediaType === mediaType,
    )

    if (existing) {
      this.removeEntry(existing.id)
      return
    }

    const entry: WatchlistEntry = {
      id: crypto.randomUUID(),
      mediaId: media.id,
      mediaType,
      status: 'want to watch',
      addedAt: Date.now(),
      mediaSnapshot: createMediaSnapshot(media),
    }

    this.entries.push(entry)
  }

  removeFromWatchlist(mediaId: number, mediaType: WatchlistMediaType): void {
    const entry = this.entries.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )

    if (entry) {
      this.removeEntry(entry.id)
    }
  }

  updateStatus(mediaId: number, mediaType: WatchlistMediaType, newStatus: WatchlistStatus): void {
    const entry = this.entries.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )

    if (entry) {
      entry.status = newStatus
    }
  }

  updateNote(mediaId: number, mediaType: WatchlistMediaType, note: string): void {
    const entry = this.entries.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )
    if (!entry) return
    const value = note.slice(0, 300)
    entry.note = value.length > 0 ? value : undefined
  }

  private removeEntry(entryId: string): void {
    this.entries = this.entries.filter((entry) => entry.id !== entryId)
  }
}

export const watchlistStore = new WatchlistStore()