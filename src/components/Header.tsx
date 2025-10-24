/** biome-ignore-all lint/a11y/useValidAnchor: Never mind */
/** biome-ignore-all lint/performance/noImgElement: ok */
/** biome-ignore-all lint/style/useFilenamingConvention: ok */
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"
import { Input } from "./Input"

export function Header() {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate("/signin", { replace: true })
  }

  return (
    <div className="flex w-full justify-between border border-b border-b-[#3E3B47] bg-[#1C1B1E] px-32 py-6">
      <div className="flex w-full items-center gap-16 px-[70px] py-6">
        <h1 className="font-bold font-secondary text-2xl text-[#FF859B]">
          Movies
        </h1>
        <Input />
        <div className="inline-flex h-16 items-center gap-2.5">
          <div className="inline-flex flex-col items-end">
            <a
              className="font-bold font-secondary text-sm text-white no-underline"
              href="#"
            >
              {user?.name ?? "Convidado"}
            </a>
            <a
              className="font-normal font-secondary text-[#948F99] text-sm"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handleSignOut()
              }}
            >
              sair
            </a>
          </div>

          <Link
            aria-label="Abrir perfil"
            className="inline-block cursor-pointer"
            to="/perfil"
          >
            <div className="h-16 w-16 overflow-hidden rounded-full">
              {/** biome-ignore lint/a11y/useAltText: Never mind */}
              {/** biome-ignore lint/nursery/useImageSize: ok */}
              <img
                className="h-full w-full object-cover"
                src={user?.avatar ?? "https://via.placeholder.com/150"}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
