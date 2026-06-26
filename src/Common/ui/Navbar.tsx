import { useState, type FormEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { authStore } from '../../Auth/data/AuthStore'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-zinc-800 text-white'
      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white',
  ].join(' ')

export const Navbar = observer(function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const handleLogout = () => {
    authStore.logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="shrink-0 text-lg font-bold tracking-tight text-white"
        >
          Cine <span className="text-red-500">View</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/search" className={navLinkClass}>
            Search
          </NavLink>
          <NavLink to="/watchlist" className={navLinkClass}>
            Watchlist
          </NavLink>
          <NavLink to="/lists" className={navLinkClass}>
            Lists
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            Settings
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden sm:block">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search movies, shows..."
              className="w-48 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 lg:w-64"
              aria-label="Global search"
            />
          </form>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white sm:hidden"
            aria-label="Open search page"
          >
            Search
          </button>

          <button
            type="button"
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            aria-label="Language switcher"
          >
            EN
          </button>

          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/20 text-sm font-semibold text-red-400"
            aria-hidden="true"
          >
            CV
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
})