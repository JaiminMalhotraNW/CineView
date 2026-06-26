import { Outlet } from 'react-router-dom'
import { theme } from '../core/themeClasses'
import { Navbar } from './Navbar'

export function ShellLayout() {
  return (
    <div className={`min-h-screen ${theme.page}`}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}