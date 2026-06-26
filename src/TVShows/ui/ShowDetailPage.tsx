import { useTranslation } from 'react-i18next'
import { theme } from '../../Common/core/themeClasses'

export function ShowDetailPage() {
  const { t } = useTranslation()

  return (
    <div className={`rounded-2xl p-8 text-center ${theme.card}`}>
      <h1 className={`text-2xl font-bold ${theme.heading}`}>
        {t('search.tvShows')}
      </h1>
      <p className={`mt-2 text-sm ${theme.subheading}`}>
        TV show details will be available in a future milestone.
      </p>
    </div>
  )
}