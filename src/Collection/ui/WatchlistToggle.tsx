import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { theme } from '../../Common/core/themeClasses'
import {
  getWatchlistMediaTitle,
  getWatchlistMediaType,
  type WatchlistMedia,
} from '../core/media'
import { watchlistStore } from '../data/WatchlistStore'

type WatchlistToggleProps = {
  media: WatchlistMedia
  variant?: 'card' | 'detail'
  className?: string
}

export const WatchlistToggle = observer(function WatchlistToggle({
  media,
  variant = 'card',
  className = '',
}: WatchlistToggleProps) {
  const { t } = useTranslation()

  const mediaType = getWatchlistMediaType(media)
  const title = getWatchlistMediaTitle(media)
  const isActive = watchlistStore.isInWatchlist(media.id, mediaType)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    watchlistStore.toggleWatchlist(media)
  }

  const baseClass =
    variant === 'card'
      ? 'absolute left-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80'
      : `inline-flex ite  ms-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${theme.chipInactive}`

  const activeClass = isActive
    ? variant === 'card'
      ? 'text-red-500 opacity-100'
      : 'border-red-500 text-red-500'
    : variant === 'card'
      ? 'text-white'
      : ''

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
      className={`${baseClass} ${activeClass} ${className}`.trim()}
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