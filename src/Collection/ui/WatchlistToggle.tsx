import { observer } from 'mobx-react-lite'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getWatchlistMediaTitle,
  getWatchlistMediaType,
  type WatchlistMedia,
} from '../core/media'
import { collectionStore } from '../data/CollectionStore'

type WatchlistToggleProps = {
  media: WatchlistMedia
  variant?: 'card' | 'detail'
  className?: string
}

const detailBaseClass =
  'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition duration-200'

const detailInactiveClass =
  'border-white/25 bg-black/40 text-white backdrop-blur-sm hover:border-white/40 hover:bg-black/55'

const detailActiveClass =
  'border-red-500/60 bg-red-600/25 text-red-300 shadow-lg shadow-red-900/20 hover:bg-red-600/35'

export const WatchlistToggle = observer(function WatchlistToggle({
  media,
  variant = 'card',
  className = '',
}: WatchlistToggleProps) {
  const { t } = useTranslation()

  const mediaType = getWatchlistMediaType(media)
  const title = getWatchlistMediaTitle(media)
  const isActive = collectionStore.isInWatchlist(media.id, mediaType)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    collectionStore.toggleWatchlist(media)
  }

  const cardClass = isActive
    ? 'absolute left-2 top-2 rounded-full bg-red-600/90 p-2 text-white opacity-100 shadow-lg shadow-red-900/30 transition hover:bg-red-500'
    : 'absolute left-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80'

  const detailClass = `${detailBaseClass} ${
    isActive ? detailActiveClass : detailInactiveClass
  }`

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isActive
          ? t('collection.removeFromWatchlist', { title })
          : t('collection.addToWatchlist', { title })
      }
      aria-pressed={isActive}
      className={`${variant === 'card' ? cardClass : detailClass} ${className}`.trim()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isActive ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.5}
        className={variant === 'card' ? 'h-4 w-4' : 'h-5 w-5'}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
      {variant === 'detail' && (
        <span>
          {isActive
            ? t('collection.inWatchlist')
            : t('collection.addToWatchlistShort')}
        </span>
      )}
    </button>
  )
})