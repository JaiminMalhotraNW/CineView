import { autorun, makeAutoObservable } from 'mobx'
import {
  getWatchlistMediaTitle,
  getWatchlistMediaType,
  type WatchlistMedia,
} from '../core/media'
import {
  UnifiedCollectionSchema,
  WatchlistEntriesSchema,
  type CustomList,
  type EpisodeProgress,
  type MediaSnapshot,
  type UnifiedCollection,
  type WatchlistEntry,
  type WatchlistFilter,
  type WatchlistMediaType,
  type WatchlistSort,
  type WatchlistStatus,
} from '../core/schemas'

const STORAGE_KEY = 'cineview_collection'
const LEGACY_WATCHLIST_KEY = 'cineview_watchlist'

const EMPTY_COUNTS: Record<WatchlistStatus, number> = {
  'want to watch': 0,
  watching: 0,
  completed: 0,
}

function getDefaultCollection(): UnifiedCollection {
  return {
    watchlist: [],
    customLists: [],
    episodeProgress: {},
  }
}

function createMediaSnapshot(media: WatchlistMedia): MediaSnapshot {
  return {
    title: getWatchlistMediaTitle(media),
    poster_path: media.poster_path,
    vote_average: media.vote_average,
  }
}

function loadCollectionFromStorage(): UnifiedCollection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      const result = UnifiedCollectionSchema.safeParse(parsed)
      if (result.success) return result.data
    }
  } catch {
    // fall through to legacy migration
  }

  try {
    const legacyRaw = localStorage.getItem(LEGACY_WATCHLIST_KEY)
    if (legacyRaw) {
      const parsed: unknown = JSON.parse(legacyRaw)
      const result = WatchlistEntriesSchema.safeParse(parsed)
      if (result.success) {
        return {
          watchlist: result.data,
          customLists: [],
          episodeProgress: {},
        }
      }
    }
  } catch {
    // ignore
  }

  return getDefaultCollection()
}

function showKey(showId: number): string {
  return String(showId)
}

function seasonKey(seasonId: number): string {
  return String(seasonId)
}

class CollectionStore {
  watchlist: WatchlistEntry[] = []
  customLists: CustomList[] = []
  episodeProgress: EpisodeProgress = {}

  constructor() {
    const initial = loadCollectionFromStorage()
    this.watchlist = initial.watchlist
    this.customLists = initial.customLists
    this.episodeProgress = initial.episodeProgress

    makeAutoObservable(this)

    autorun(() => {
      const payload = UnifiedCollectionSchema.parse({
        watchlist: this.watchlist,
        customLists: this.customLists,
        episodeProgress: this.episodeProgress,
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))

      // One-time cleanup after migrating legacy data
      if (localStorage.getItem(LEGACY_WATCHLIST_KEY)) {
        localStorage.removeItem(LEGACY_WATCHLIST_KEY)
      }
    })
  }

  // ─── Watchlist computed ───────────────────────────────────────────────

  get totalCount(): number {
    return this.watchlist.length
  }

  get countsByStatus(): Record<WatchlistStatus, number> {
    const counts = { ...EMPTY_COUNTS }
    for (const entry of this.watchlist) {
      counts[entry.status] += 1
    }
    return counts
  }

  isInWatchlist(mediaId: number, mediaType: WatchlistMediaType): boolean {
    return this.watchlist.some(
      (entry) => entry.mediaId === mediaId && entry.mediaType === mediaType,
    )
  }

  getFilteredAndSorted(
    status: WatchlistFilter,
    sortBy: WatchlistSort,
  ): WatchlistEntry[] {
    let list =
      status === 'all'
        ? [...this.watchlist]
        : this.watchlist.filter((entry) => entry.status === status)

    if (sortBy === 'dateAdded') {
      list.sort((a, b) => b.addedAt - a.addedAt)
    } else {
      list.sort((a, b) =>
        a.mediaSnapshot.title.localeCompare(b.mediaSnapshot.title),
      )
    }

    return list
  }

  // ─── Watchlist actions ────────────────────────────────────────────────

  toggleWatchlist(media: WatchlistMedia): void {
    const mediaType = getWatchlistMediaType(media)
    const existing = this.watchlist.find(
      (entry) => entry.mediaId === media.id && entry.mediaType === mediaType,
    )

    if (existing) {
      this.removeWatchlistEntryById(existing.id)
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

    this.watchlist.push(entry)
  }

  removeFromWatchlist(mediaId: number, mediaType: WatchlistMediaType): void {
    const entry = this.watchlist.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )
    if (entry) {
      this.removeWatchlistEntryById(entry.id)
    }
  }

  updateStatus(
    mediaId: number,
    mediaType: WatchlistMediaType,
    newStatus: WatchlistStatus,
  ): void {
    const entry = this.watchlist.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )
    if (entry) {
      entry.status = newStatus
    }
  }

  updateNote(
    mediaId: number,
    mediaType: WatchlistMediaType,
    note: string,
  ): void {
    const entry = this.watchlist.find(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )
    if (!entry) return

    const value = note.slice(0, 300)
    entry.note = value.length > 0 ? value : undefined
  }

  /** Cascading delete: removes entry, note, and TV episode progress */
  private removeWatchlistEntryById(entryId: string): void {
    const entry = this.watchlist.find((item) => item.id === entryId)
    if (!entry) return

    this.watchlist = this.watchlist.filter((item) => item.id !== entryId)

    if (entry.mediaType === 'tv') {
      this.purgeEpisodeProgress(entry.mediaId)
    }
  }

  // ─── Custom lists ─────────────────────────────────────────────────────

  getListById(listId: string): CustomList | undefined {
    return this.customLists.find((list) => list.id === listId)
  }

  isInList(
    listId: string,
    mediaId: number,
    mediaType: WatchlistMediaType,
  ): boolean {
    const list = this.getListById(listId)
    if (!list) return false

    return list.items.some(
      (item) => item.mediaId === mediaId && item.mediaType === mediaType,
    )
  }

  createList(name: string, description?: string): string | null {
    const trimmedName = name.trim().slice(0, 60)
    if (!trimmedName) return null

    const now = Date.now()
    const list: CustomList = {
      id: crypto.randomUUID(),
      name: trimmedName,
      description: description?.trim() || undefined,
      items: [],
      createdAt: now,
      updatedAt: now,
    }

    this.customLists.push(list)
    return list.id
  }

  renameList(listId: string, name: string): boolean {
    const list = this.getListById(listId)
    if (!list) return false

    const trimmedName = name.trim().slice(0, 60)
    if (!trimmedName) return false

    list.name = trimmedName
    list.updatedAt = Date.now()
    return true
  }

  deleteList(listId: string): boolean {
    const before = this.customLists.length
    this.customLists = this.customLists.filter((list) => list.id !== listId)
    return this.customLists.length < before
  }

  toggleItemInList(listId: string, media: WatchlistMedia): boolean {
    const list = this.getListById(listId)
    if (!list) return false

    const mediaType = getWatchlistMediaType(media)
    const existingIndex = list.items.findIndex(
      (item) => item.mediaId === media.id && item.mediaType === mediaType,
    )

    if (existingIndex >= 0) {
      list.items = list.items.filter((_, index) => index !== existingIndex)
    } else {
      list.items.push({
        mediaId: media.id,
        mediaType,
        mediaSnapshot: createMediaSnapshot(media),
      })
    }

    list.updatedAt = Date.now()
    return true
  }

  removeItemFromList(
    listId: string,
    mediaId: number,
    mediaType: WatchlistMediaType,
  ): boolean {
    const list = this.getListById(listId)
    if (!list) return false

    const before = list.items.length
    list.items = list.items.filter(
      (item) => !(item.mediaId === mediaId && item.mediaType === mediaType),
    )

    if (list.items.length < before) {
      list.updatedAt = Date.now()
      return true
    }

    return false
  }

  // ─── Episode progress ─────────────────────────────────────────────────

  isEpisodeWatched(
    showId: number,
    seasonId: number,
    episodeId: number,
  ): boolean {
    const episodes =
      this.episodeProgress[showKey(showId)]?.[seasonKey(seasonId)] ?? []
    return episodes.includes(episodeId)
  }

  getWatchedEpisodesForSeason(showId: number, seasonId: number): number[] {
    return [
      ...(this.episodeProgress[showKey(showId)]?.[seasonKey(seasonId)] ?? []),
    ]
  }

  getTotalWatchedEpisodesForShow(showId: number): number {
    const showProgress = this.episodeProgress[showKey(showId)]
    if (!showProgress) return 0

    return Object.values(showProgress).reduce(
      (total, episodes) => total + episodes.length,
      0,
    )
  }

  toggleEpisode(
    showId: number,
    seasonId: number,
    episodeId: number,
  ): void {
    const sKey = showKey(showId)
    const snKey = seasonKey(seasonId)
    const currentShow = this.episodeProgress[sKey] ?? {}
    const currentSeason = [...(currentShow[snKey] ?? [])]

    const index = currentSeason.indexOf(episodeId)
    const nextSeason =
      index >= 0
        ? currentSeason.filter((id) => id !== episodeId)
        : [...currentSeason, episodeId].sort((a, b) => a - b)

    this.setSeasonEpisodes(showId, seasonId, nextSeason)
  }

  markAllSeason(
    showId: number,
    seasonId: number,
    episodeIds: number[],
  ): void {
    const unique = [...new Set(episodeIds)].sort((a, b) => a - b)
    this.setSeasonEpisodes(showId, seasonId, unique)
  }

  unmarkAllSeason(showId: number, seasonId: number): void {
    this.setSeasonEpisodes(showId, seasonId, [])
  }

  private setSeasonEpisodes(
    showId: number,
    seasonId: number,
    episodeIds: number[],
  ): void {
    const sKey = showKey(showId)
    const snKey = seasonKey(seasonId)
    const nextShow = { ...(this.episodeProgress[sKey] ?? {}) }

    if (episodeIds.length === 0) {
      delete nextShow[snKey]
    } else {
      nextShow[snKey] = episodeIds
    }

    const nextProgress = { ...this.episodeProgress }

    if (Object.keys(nextShow).length === 0) {
      delete nextProgress[sKey]
    } else {
      nextProgress[sKey] = nextShow
    }

    this.episodeProgress = nextProgress
  }

  private purgeEpisodeProgress(showId: number): void {
    const sKey = showKey(showId)
    if (!(sKey in this.episodeProgress)) return

    const nextProgress = { ...this.episodeProgress }
    delete nextProgress[sKey]
    this.episodeProgress = nextProgress
  }
}

export const collectionStore = new CollectionStore()