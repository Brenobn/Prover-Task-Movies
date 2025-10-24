// biome-ignore assist/source/organizeImports: ok
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "./App"
import { CreateMovie } from "./pages/CreateMovie"
import { Details } from "./pages/Details"
import { EditMovie } from "./pages/EditMovie"
import { Perfil } from "./pages/Perfil"
import { UserProvider } from "./contexts/UserContext"
import { Home } from "./pages/Home"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SingnUp"

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin",
    element: <SignIn />,
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
        path: "/detalhes/:movieId",
        element: <Details />,
      },
      {
        path: "/editarfilme/:movieId",
        element: <EditMovie />,
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
