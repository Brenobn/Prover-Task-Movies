import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type User = {
  name: string
  email: string
  avatar: string
}

type UserContextValue = {
  user: User
  setUser: (next: User) => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

const STORAGE_KEY = "prover-movies:user"

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as User
    } catch {}
    return {
      name: "Breno",
      email: "breno@email.com",
      avatar: "https://github.com/Brenobn.png",
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch {}
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
