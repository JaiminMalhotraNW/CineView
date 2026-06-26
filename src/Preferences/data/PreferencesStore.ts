import { autorun, makeAutoObservable } from 'mobx'
import { z } from 'zod'

const STORAGE_KEY = 'cineview_preferences'

export const PreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  language: z.enum(['en', 'es']),
  region: z.enum(['US', 'IN', 'GB', 'MX']),
})

export type Theme = z.infer<typeof PreferencesSchema>['theme']
export type Language = z.infer<typeof PreferencesSchema>['language']
export type Region = z.infer<typeof PreferencesSchema>['region']

export const REGION_OPTIONS: Region[] = ['US', 'IN', 'GB', 'MX']

function getOsTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getDefaultPreferences(): z.infer<typeof PreferencesSchema> {
  return {
    theme: getOsTheme(),
    language: 'en',
    region: 'US',
  }
}

function loadPreferencesFromStorage(): z.infer<typeof PreferencesSchema> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultPreferences()

    const parsed: unknown = JSON.parse(raw)
    const result = PreferencesSchema.safeParse(parsed)

    return result.success ? result.data : getDefaultPreferences()
  } catch {
    return getDefaultPreferences()
  }
}

class PreferencesStore {
  theme: Theme
  language: Language
  region: Region

  constructor() {
    const initial = loadPreferencesFromStorage()

    this.theme = initial.theme
    this.language = initial.language
    this.region = initial.region

    makeAutoObservable(this)

    autorun(() => {
      document.documentElement.classList.toggle('dark', this.theme === 'dark')
    })

    autorun(() => {
      const payload = PreferencesSchema.parse({
        theme: this.theme,
        language: this.language,
        region: this.region,
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    })
  }

  setTheme(theme: Theme) {
    this.theme = theme
  }

  setLanguage(language: Language) {
    this.language = language
  }

  setRegion(region: Region) {
    this.region = region
  }
}

export const preferencesStore = new PreferencesStore()