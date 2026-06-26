import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { autorun } from 'mobx'
import { preferencesStore } from '../data/PreferencesStore'
import type { Language } from '../data/PreferencesStore'

const resources = {
  en: {
    translation: {
      common: {
        nav: {
          home: 'Home',
          search: 'Search',
          watchlist: 'Watchlist',
          lists: 'Lists',
          settings: 'Settings',
          logout: 'Logout',
        },
        loading: 'Loading...',
        error: 'Something went wrong',
        notFound: 'Page not found',
      },
      auth: {
        welcomeBack: 'Welcome Back',
        signInSubtitle: 'Sign in to continue exploring movies and shows',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        invalidCredentials: 'Invalid email or password. Please try again.',
        showPassword: 'Show password',
        hidePassword: 'Hide password',
      },
      movies: {
        trendingNow: 'Trending Now',
        watchTrailer: 'Watch Trailer',
        moreInfo: 'More Info',
        goToSlide: 'Go to slide {{number}}',
        trending: 'Trending',
        popular: 'Popular',
        similarMovies: 'Similar Movies',
        cast: 'Cast',
        movieNotFound: 'Movie Not Found',
        movieNotFoundDescription:
          "We couldn't load this movie. The ID may be invalid or the request failed.",
        backToHome: 'Back to Home',
        loadingDiscovery: 'Loading discovery content...',
        loadingDetails: 'Loading movie details...',
        noOverview: 'No overview available.',
        noTrailer: 'No trailer available for this title.',
        trailerLoadFailed: 'Unable to load trailer.',
        loadFailed: 'Failed to load discovery content. Please try again later.',
      },
      search: {
        title: 'Search',
        subtitle: 'Find movies, TV shows, and people',
        placeholder: 'Search movies, shows, people...',
        recentSearches: 'Recent Searches',
        searching: 'Searching...',
        failed: 'Search failed. Please try again.',
        noResults: 'No results found for "{{query}}".',
        movies: 'Movies',
        tvShows: 'TV Shows',
        people: 'People',
      },
      preferences: {
        title: 'Settings',
        subtitle: 'Customize your CineView experience',
        appearance: 'Appearance',
        theme: 'Theme',
        themeDescription: 'Choose light or dark mode for the app.',
        light: 'Light',
        dark: 'Dark',
        localization: 'Localization',
        language: 'Language',
        languageDescription: 'Changes UI text and TMDB content language.',
        english: 'English',
        spanish: 'Español',
        region: 'Region',
        regionDescription: 'Targets regional content from TMDB.',
        account: 'Account',
        logout: 'Log out',
        logoutDescription: 'End your current session on this device.',
      },
    },
  },
  es: {
    translation: {
      common: {
        nav: {
          home: 'Inicio',
          search: 'Buscar',
          watchlist: 'Mi lista',
          lists: 'Listas',
          settings: 'Ajustes',
          logout: 'Salir',
        },
        loading: 'Cargando...',
        error: 'Algo salió mal',
        notFound: 'Página no encontrada',
      },
      auth: {
        welcomeBack: 'Bienvenido de nuevo',
        signInSubtitle: 'Inicia sesión para seguir explorando películas y series',
        email: 'Correo electrónico',
        password: 'Contraseña',
        signIn: 'Iniciar sesión',
        invalidCredentials: 'Correo o contraseña incorrectos. Inténtalo de nuevo.',
        showPassword: 'Mostrar contraseña',
        hidePassword: 'Ocultar contraseña',
      },
      movies: {
        trendingNow: 'Tendencias',
        watchTrailer: 'Ver tráiler',
        moreInfo: 'Más información',
        goToSlide: 'Ir a la diapositiva {{number}}',
        trending: 'Tendencias',
        popular: 'Popular',
        similarMovies: 'Películas similares',
        cast: 'Reparto',
        movieNotFound: 'Película no encontrada',
        movieNotFoundDescription:
          'No pudimos cargar esta película. El ID puede ser inválido o la solicitud falló.',
        backToHome: 'Volver al inicio',
        loadingDiscovery: 'Cargando contenido...',
        loadingDetails: 'Cargando detalles de la película...',
        noOverview: 'Sin sinopsis disponible.',
        noTrailer: 'No hay tráiler disponible para este título.',
        trailerLoadFailed: 'No se pudo cargar el tráiler.',
        loadFailed: 'No se pudo cargar el contenido. Inténtalo de nuevo más tarde.',
      },
      search: {
        title: 'Buscar',
        subtitle: 'Encuentra películas, series y personas',
        placeholder: 'Buscar películas, series, personas...',
        recentSearches: 'Búsquedas recientes',
        searching: 'Buscando...',
        failed: 'La búsqueda falló. Inténtalo de nuevo.',
        noResults: 'No se encontraron resultados para "{{query}}".',
        movies: 'Películas',
        tvShows: 'Series',
        people: 'Personas',
      },
      preferences: {
        title: 'Ajustes',
        subtitle: 'Personaliza tu experiencia en CineView',
        appearance: 'Apariencia',
        theme: 'Tema',
        themeDescription: 'Elige el modo claro u oscuro para la app.',
        light: 'Claro',
        dark: 'Oscuro',
        localization: 'Localización',
        language: 'Idioma',
        languageDescription: 'Cambia el texto de la interfaz y el idioma del contenido TMDB.',
        english: 'Inglés',
        spanish: 'Español',
        region: 'Región',
        regionDescription: 'Define el contenido regional de TMDB.',
        account: 'Cuenta',
        logout: 'Cerrar sesión',
        logoutDescription: 'Finaliza tu sesión actual en este dispositivo.',
      },
    },
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: preferencesStore.language,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

autorun(() => {
  void i18n.changeLanguage(preferencesStore.language)
})

export function getTmdbLanguage(language: Language): string {
  return language === 'es' ? 'es-ES' : 'en-US'
}

export default i18n