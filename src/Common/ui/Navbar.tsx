import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { authStore } from '../../Auth/data/AuthStore'
import { navLinkClass, theme } from '../core/themeClasses'

export const Navbar = observer(function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    authStore.logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className={theme.header}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className={`shrink-0 text-lg font-bold tracking-tight ${theme.logo}`}
        >
          Cine <span className="text-red-500">View</span>
        </NavLink>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          <NavLink to="/" end className={navLinkClass}>
            {t('common.nav.home')}
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            {t('common.nav.search')}
          </NavLink>
          <NavLink to="/watchlist" className={navLinkClass}>
            {t('common.nav.watchlist')}
          </NavLink>
          <NavLink to="/lists" className={navLinkClass}>
            {t('common.nav.lists')}
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            {t('common.nav.settings')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/15 text-sm font-semibold text-red-500 dark:bg-red-600/20 dark:text-red-400"
            aria-hidden="true"
          >
            CV
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={theme.btnSecondary}
          >
            {t('common.nav.logout')}
          </button>
        </div>
      </div>
    </header>
  )
})