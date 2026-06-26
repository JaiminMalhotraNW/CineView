import { useTranslation } from 'react-i18next'
import { theme } from '../../Common/core/themeClasses'

export function WatchlistPage() {
  const { t } = useTranslation()

  return (
    <div className={`rounded-2xl p-8 text-center ${theme.card}`}>
      <h1 className={`text-2xl font-bold ${theme.heading}`}>
        {t('common.nav.watchlist')}
      </h1>
      <p className={`mt-2 text-sm ${theme.subheading}`}>
        Your saved movies and shows will appear here.
      </p>
    </div>
  )
}