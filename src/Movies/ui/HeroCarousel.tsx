import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getImageUrl, type HeroItem } from '../../Common/core/api'
import { theme } from '../../Common/core/themeClasses'

const ROTATE_MS = 6000

type HeroCarouselProps = {
  items: HeroItem[]
  onWatchTrailer: (item: HeroItem) => void
}

export function HeroCarousel({ items, onWatchTrailer }: HeroCarouselProps) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeItem = items[activeIndex]

  useEffect(() => {
    setActiveIndex(0)
  }, [items])

  useEffect(() => {
    if (items.length <= 1 || isPaused) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length)
    }, ROTATE_MS)

    return () => window.clearInterval(timer)
  }, [items.length, isPaused])

  if (!activeItem) return null

  return (
    <section
      className="relative min-h-[420px] overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label={t('movies.trendingNow')}
    >
      {items.map((item, index) => {
        const backdropUrl = getImageUrl(item.backdrop_path, 'original')
        const isActive = index === activeIndex
        const detailPath =
          item.mediaType === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`

        return (
          <div
            key={`${item.mediaType}-${item.id}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!isActive}
          >
            {backdropUrl ? (
              <img
                src={backdropUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className={theme.heroFallback} />
            )}

            <div className={theme.heroOverlay} />
            <div className={theme.heroOverlayBottom} />

            <div className="relative flex min-h-[420px] flex-col justify-end p-6 pb-16 text-white sm:p-10 sm:pb-20">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                {t('movies.trendingNow')}
              </p>
              <h1 className="max-w-2xl text-3xl font-bold sm:text-5xl">
                {item.title}
              </h1>
              <p className="mt-4 max-w-2xl line-clamp-3 text-sm text-zinc-200 sm:text-base">
                {item.overview || t('movies.noOverview')}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="rounded-md bg-yellow-500/15 px-3 py-1 text-sm font-semibold text-yellow-400">
                  ★ {item.vote_average.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => onWatchTrailer(item)}
                  className={theme.btnPrimary}
                >
                  {t('movies.watchTrailer')}
                </button>
                <Link
                  to={detailPath}
                  className={`${theme.btnSecondary} inline-block`}
                >
                  {t('movies.moreInfo')}
                </Link>
              </div>
            </div>
          </div>
        )
      })}

      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {items.map((item, index) => (
            <button
              key={`dot-${item.mediaType}-${item.id}`}
              type="button"
              aria-label={t('movies.goToSlide', { number: index + 1 })}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}