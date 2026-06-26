import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../../Auth/data/AuthStore'
import { theme } from '../../Common/core/themeClasses'
import {
  preferencesStore,
  REGION_OPTIONS,
  type Language,
  type Region,
  type Theme,
} from '../data/PreferencesStore'

export const SettingsPage = observer(function SettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = () => {
    authStore.logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${theme.heading}`}>
          {t('preferences.title')}
        </h1>
        <p className={`mt-2 text-sm ${theme.subheading}`}>
          {t('preferences.subtitle')}
        </p>
      </div>

      <section className={`p-6 ${theme.card}`}>
        <h2 className={`text-lg font-semibold ${theme.heading}`}>
          {t('preferences.appearance')}
        </h2>

        <div className="mt-6">
          <label
            htmlFor="theme"
            className={`block text-sm font-medium ${theme.label}`}
          >
            {t('preferences.theme')}
          </label>
          <p className={`mt-1 text-xs ${theme.hint}`}>
            {t('preferences.themeDescription')}
          </p>
          <select
            id="theme"
            value={preferencesStore.theme}
            onChange={(event) =>
              preferencesStore.setTheme(event.target.value as Theme)
            }
            className={theme.select}
          >
            <option value="light">{t('preferences.light')}</option>
            <option value="dark">{t('preferences.dark')}</option>
          </select>
        </div>
      </section>

      <section className={`p-6 ${theme.card}`}>
        <h2 className={`text-lg font-semibold ${theme.heading}`}>
          {t('preferences.localization')}
        </h2>

        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="language"
              className={`block text-sm font-medium ${theme.label}`}
            >
              {t('preferences.language')}
            </label>
            <p className={`mt-1 text-xs ${theme.hint}`}>
              {t('preferences.languageDescription')}
            </p>
            <select
              id="language"
              value={preferencesStore.language}
              onChange={(event) =>
                preferencesStore.setLanguage(event.target.value as Language)
              }
              className={theme.select}
            >
              <option value="en">{t('preferences.english')}</option>
              <option value="es">{t('preferences.spanish')}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="region"
              className={`block text-sm font-medium ${theme.label}`}
            >
              {t('preferences.region')}
            </label>
            <p className={`mt-1 text-xs ${theme.hint}`}>
              {t('preferences.regionDescription')}
            </p>
            <select
              id="region"
              value={preferencesStore.region}
              onChange={(event) =>
                preferencesStore.setRegion(event.target.value as Region)
              }
              className={theme.select}
            >
              {REGION_OPTIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className={`p-6 ${theme.card}`}>
        <h2 className={`text-lg font-semibold ${theme.heading}`}>
          {t('preferences.account')}
        </h2>
        <p className={`mt-1 text-xs ${theme.hint}`}>
          {t('preferences.logoutDescription')}
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className={`mt-6 ${theme.btnPrimary}`}
        >
          {t('preferences.logout')}
        </button>
      </section>
    </div>
  )
})