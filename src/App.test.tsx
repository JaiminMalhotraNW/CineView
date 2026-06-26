import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'
import { authStore } from './Auth'

describe('App', () => {
  beforeEach(() => {
    sessionStorage.clear()
    authStore.logout()
  })

  it('redirects unauthenticated users to login', () => {
    render(<App />)
    expect(screen.getByText('Welcome Back')).toBeTruthy()
  })
})