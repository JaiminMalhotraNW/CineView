import { makeAutoObservable } from 'mobx'

const SESSION_KEY = 'cineview_session'
const VALID_EMAIL = 'name@example.com'
const VALID_PASSWORD = 'password123'

class AuthStore {
  isAuthenticated = false

  constructor() {
    makeAutoObservable(this)
    this.isAuthenticated = sessionStorage.getItem(SESSION_KEY) === 'true'
  }

  login(email: string, password: string): boolean {
    const isValid =
      email.trim().toLowerCase() === VALID_EMAIL &&
      password === VALID_PASSWORD

    if (!isValid) {
      return false
    }

    sessionStorage.setItem(SESSION_KEY, 'true')
    this.isAuthenticated = true
    return true
  }

  logout(): void {
    sessionStorage.removeItem(SESSION_KEY)
    this.isAuthenticated = false
  }
}

export const authStore = new AuthStore()