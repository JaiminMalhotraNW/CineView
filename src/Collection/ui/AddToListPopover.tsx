import { observer } from 'mobx-react-lite'
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'
import { getWatchlistMediaType, type WatchlistMedia } from '../core/media'
import { collectionStore } from '../data/CollectionStore'

const MENU_WIDTH = 280

type AddToListPopoverProps = {
  media: WatchlistMedia
  variant?: 'card' | 'detail'
  className?: string
}

type MenuPosition = {
  top: number
  left: number
}

function ListPreviewThumb({ posterPath }: { posterPath: string | null }) {
  const url = getImageUrl(posterPath, 'w185')

  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-10 w-7 shrink-0 rounded object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
      />
    )
  }

  return (
    <div className="flex h-10 w-7 shrink-0 items-center justify-center rounded bg-zinc-200 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
      —
    </div>
  )
}

export const AddToListPopover = observer(function AddToListPopover({
  media,
  variant = 'card',
  className = '',
}: AddToListPopoverProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const mediaType = getWatchlistMediaType(media)

  const updateMenuPosition = () => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    let left = variant === 'detail' ? rect.right - MENU_WIDTH : rect.left
    left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8))

    setMenuPosition({
      top: rect.bottom + 10,
      left,
    })
  }

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition(null)
      return
    }

    updateMenuPosition()

    const handlePointerDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return
      }
      setIsOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    const handleReposition = () => updateMenuPosition()

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [isOpen, variant])

  const handleToggleOpen = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen((open) => !open)
  }

  const cardTriggerClass =
    'absolute right-2 top-10 rounded-full bg-black/70 p-2 text-white opacity-0 shadow-lg backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/90'

  const detailTriggerClass = isOpen
    ? 'inline-flex items-center gap-2 rounded-lg border border-red-500/60 bg-red-600/25 px-4 py-2.5 text-sm font-semibold text-red-300 shadow-lg shadow-red-900/20 backdrop-blur-sm transition'
    : 'inline-flex items-center gap-2 rounded-lg border border-white/25 bg-black/40 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/55'

  const menu =
    isOpen && menuPosition
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={t('collection.lists.chooseList')}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              width: MENU_WIDTH,
              zIndex: 100,
            }}
            className="animate-in fade-in zoom-in-95 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-xl duration-150 dark:border-zinc-700/80 dark:bg-zinc-900/95 dark:shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {t('collection.lists.addToList')}
              </p>
              <p className={`mt-0.5 text-xs ${theme.subheading}`}>
                {t('collection.lists.chooseList')}
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              {collectionStore.customLists.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-zinc-400"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z"
                      />
                    </svg>
                  </div>
                  <p className={`text-sm ${theme.subheading}`}>
                    {t('collection.lists.noListsYet')}
                  </p>
                  <Link
                    to="/lists"
                    onClick={() => setIsOpen(false)}
                    className="mt-3 inline-block text-sm font-medium text-red-500 hover:text-red-400"
                  >
                    {t('collection.lists.createButton')} →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-1">
                  {collectionStore.customLists.map((list) => {
                    const checked = collectionStore.isInList(
                      list.id,
                      media.id,
                      mediaType,
                    )
                    const previewPoster =
                      list.items[0]?.mediaSnapshot.poster_path ?? null

                    return (
                      <li key={list.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={checked}
                          onClick={() =>
                            collectionStore.toggleItemInList(list.id, media)
                          }
                          className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
                            checked
                              ? 'bg-red-500/10 ring-1 ring-red-500/30'
                              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <ListPreviewThumb posterPath={previewPoster} />

                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-sm font-medium ${theme.heading}`}
                            >
                              {list.name}
                            </p>
                            <p className={`text-xs ${theme.hint}`}>
                              {t('collection.lists.itemCount', {
                                count: list.items.length,
                              })}
                            </p>
                          </div>

                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                              checked
                                ? 'border-red-500 bg-red-500 text-white'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}
                            aria-hidden="true"
                          >
                            {checked && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-3 w-3"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {collectionStore.customLists.length > 0 && (
              <div className="border-t border-zinc-200 px-3 py-2 dark:border-zinc-800">
                <Link
                  to="/lists"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-2 py-2 text-center text-xs font-medium text-red-500 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  {t('collection.lists.manageLists')} →
                </Link>
              </div>
            )}
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <div ref={containerRef} className={`relative ${className}`.trim()}>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggleOpen}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={t('collection.lists.addToList')}
          className={variant === 'card' ? cardTriggerClass : detailTriggerClass}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={variant === 'card' ? 'h-4 w-4' : 'h-5 w-5'}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm0 5.25h.007v.008H3.75V12Zm0 5.25h.007v.008H3.75v-.008Z"
            />
          </svg>
          {variant === 'detail' && (
            <span>{t('collection.lists.addToList')}</span>
          )}
        </button>
      </div>
      {menu}
    </>
  )
})