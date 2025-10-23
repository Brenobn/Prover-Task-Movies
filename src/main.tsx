import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { App } from "./App"
import { CreateMovie } from "./pages/CreateMovie"
import { Details } from "./pages/Details"
import { Home } from "./pages/Home"

const router = createBrowserRouter([
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
    ],
  },
])

// biome-ignore lint/style/noNonNullAssertion: React mandatory rule
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
