import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { fetchCurrentUser, logoutUser, type AuthUser } from "../services/auth"

export type User = AuthUser

type UserContextValue = {
  user: User | null
  setUser: (next: User | null) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
  initializing: boolean
  hasRole: (role: string) => boolean
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(true)

  const setUser = useCallback((next: User | null) => {
    setUserState(next)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const current = await fetchCurrentUser()
      setUserState(current)
      return current
    } catch (error) {
      console.error("Nao foi possivel atualizar o usuario autenticado:", error)
      setUserState(null)
      return null
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Falha ao encerrar sessao:", error)
    } finally {
      setUserState(null)
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setInitializing(false))
  }, [refreshUser])

  const hasRole = useCallback(
    (role: string) => {
      if (!role) return false
      return (userState?.roles ?? []).some(
        (current) => current.toLowerCase() === role.toLowerCase(),
      )
    },
    [userState],
  )

  return (
    <UserContext.Provider
      value={{
        user: userState,
        setUser,
        logout,
        refreshUser,
        initializing,
        hasRole,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
