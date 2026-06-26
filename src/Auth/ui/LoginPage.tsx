import { useEffect, useState, type FormEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authStore } from '../data/AuthStore'

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FieldErrors = {
  email?: string
  password?: string
}

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  )
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.818 5.287 8 9.066 8 1.016 0 1.99-.157 2.89-.443M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639a10.494 10.494 0 0 1-1.255 2.132M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  )
}

export const LoginPage = observer(function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthError('')
    setFieldErrors({})

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const errors: FieldErrors = {}

      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field === 'email' || field === 'password') {
          errors[field] = issue.message
        }
      }

      setFieldErrors(errors)
      return
    }

    const success = authStore.login(result.data.email, result.data.password)

    if (!success) {
      setAuthError('Invalid email or password. Please try again.')
      return
    }

    const redirectPath =
      (location.state as LoginLocationState | null)?.from?.pathname || '/'

    navigate(redirectPath, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-red-600/10 px-4 py-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              Cine <span className="text-red-500">View</span>
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to continue exploring movies and shows
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              placeholder="name@example.com"
            />
            {fieldErrors.email && (
              <p className="mt-2 text-sm text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2.5 pr-11 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-2 text-sm text-red-400">{fieldErrors.password}</p>
            )}
          </div>

          {authError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
})