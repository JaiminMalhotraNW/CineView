import { Link } from 'react-router-dom'
import { theme } from '../core/themeClasses'

export function NotFoundPage() {
  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${theme.page}`}>
      <div className={`mx-auto max-w-md p-8 text-center ${theme.card}`}>
        <p className="text-6xl font-bold text-red-500">404</p>
        <h1 className={`mt-4 text-2xl font-bold ${theme.heading}`}>
          Page Not Found
        </h1>
        <p className={`mt-3 text-sm ${theme.subheading}`}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/" className={`mt-6 inline-block ${theme.btnPrimary}`}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}