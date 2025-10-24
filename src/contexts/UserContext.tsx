import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type User = {
  name: string
  email: string
  avatar: string
}

type UserContextValue = {
  user: User | null
  setUser: (next: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

const STORAGE_KEY = "prover-movies:user"

export function UserProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as User
    } catch {}
    return null
  })

  useEffect(() => {
    try {
      if (userState) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userState))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {}
  }, [userState])

  const setUser = (next: User) => {
    setUserState(next)
  }

  const logout = () => {
    setUserState(null)
  }

  return (
    <UserContext.Provider value={{ user: userState, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
