import { useTranslation } from 'react-i18next'
import { theme } from '../../Common/core/themeClasses'

export function CustomListsPage() {
  const { t } = useTranslation()

  return (
    <div className={`rounded-2xl p-8 text-center ${theme.card}`}>
      <h1 className={`text-2xl font-bold ${theme.heading}`}>
        {t('common.nav.lists')}
      </h1>
      <p className={`mt-2 text-sm ${theme.subheading}`}>
        Create and manage your custom movie lists here.
      </p>
    </div>
  )
}