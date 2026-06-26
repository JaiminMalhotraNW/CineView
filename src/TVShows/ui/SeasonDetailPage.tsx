import { theme } from '../../Common/core/themeClasses'

export function SeasonDetailPage() {
  return (
    <div className={`rounded-2xl p-8 text-center ${theme.card}`}>
      <h1 className={`text-2xl font-bold ${theme.heading}`}>Season Details</h1>
      <p className={`mt-2 text-sm ${theme.subheading}`}>
        Episode listings and season info will be available in a future milestone.
      </p>
    </div>
  )
}