// biome-ignore assist/source/organizeImports: ok
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "./App"
import { CreateMovie } from "./pages/CreateMovie"
import { Details } from "./pages/Details"
import { Perfil } from "./pages/Perfil"
import { UserProvider } from "./contexts/UserContext"
import { Home } from "./pages/Home"
import { SiginIn } from "./pages/SiginIn"

const router = createBrowserRouter([
  {
    path: "/siginin",
    element: <SiginIn />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/detalhes",
        element: <Details />,
      },
      {
        path: "/criarfilme",
        element: <CreateMovie />,
      },
      {
        path: "/perfil",
        element: <Perfil />,
      },
    ],
  },
])

// biome-ignore lint/style/noNonNullAssertion: React mandatory rule
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
