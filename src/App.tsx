import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Header } from "./components/Header"
import { useUser } from "./contexts/UserContext"

export function App() {
  const location = useLocation()
  const { user, initializing } = useUser()
  const hideHeader = location.pathname === "/perfil"

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
        Verificando sessao...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return (
    <div
      className={`grid h-screen ${
        hideHeader ? "grid-rows-1" : "grid-rows-[116px_1fr]"
      } bg-zinc-900`}
    >
      {!hideHeader && <Header />}

      <main className="w-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
