import { createBrowserRouter } from 'react-router-dom'
import { LoginPage, ProtectedRoute } from './Auth'
import { NotFoundPage, ShellLayout } from './Common'
import { WatchlistPage, CustomListsPage } from './Collection'
import { HomePage, MovieDetailPage } from './Movies'
import { SettingsPage } from './Preferences'
import { SearchPage } from './Search'
import { ShowDetailPage, SeasonDetailPage } from './TVShows'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movie/:id', element: <MovieDetailPage /> },
      { path: 'show/:id', element: <ShowDetailPage /> },
      { path: 'show/:id/season/:seasonId', element: <SeasonDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'watchlist', element: <WatchlistPage /> },
      { path: 'lists', element: <CustomListsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])