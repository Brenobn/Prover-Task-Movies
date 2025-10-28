/** biome-ignore-all lint/a11y/useValidAnchor: Never mind */
/** biome-ignore-all lint/performance/noImgElement: ok */
/** biome-ignore-all lint/style/useFilenamingConvention: ok */
import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"
import { Input } from "./Input"
import { listMovies, type Movie } from "../services/movies"

export function Header() {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [moviesError, setMoviesError] = useState<string | null>(null)

  async function handleSignOut() {
    await logout()
    navigate("/signin", { replace: true })
  }

  useEffect(() => {
    const ctrl = new AbortController()
    setLoadingMovies(true)
    setMoviesError(null)
    listMovies(ctrl.signal)
      .then(setMovies)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }
        setMoviesError(err instanceof Error ? err.message : "Erro ao carregar filmes")
      })
      .finally(() => setLoadingMovies(false))

    return () => ctrl.abort()
  }, [])

  const filteredMovies = useMemo(() => {
    if (!searchTerm.trim()) return []
    const query = searchTerm.trim().toLowerCase()
    return movies
      .filter((movie) => movie.title.toLowerCase().includes(query))
      .slice(0, 6)
  }, [movies, searchTerm])

  function handleSelectMovie(movieId: string) {
    setSearchTerm("")
    navigate(`/detalhes/${movieId}`)
  }

  const shouldShowDropdown =
    searchTerm.trim().length > 0 && (loadingMovies || moviesError || filteredMovies.length > 0)

  return (
    <div className="flex w-full justify-between border border-b border-b-[#3E3B47] bg-[#1C1B1E] px-32 py-6">
      <div className="flex w-full items-center gap-16 px-[70px] py-6">
        <Link to="/" className="font-bold font-secondary text-2xl text-[#FF859B]">
          Movies
        </Link>
        <div className="relative w-full">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Pesquisar por filmes"
          />

          {shouldShowDropdown && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-xl border border-[#3E3B47] bg-[#0D0C0F] shadow-xl">
              {loadingMovies && (
                <p className="px-4 py-3 text-sm text-[#948F99]">Carregando filmes...</p>
              )}
              {moviesError && (
                <p className="px-4 py-3 text-sm text-red-400">
                  Nao foi possivel carregar os filmes
                </p>
              )}
              {!loadingMovies && !moviesError && filteredMovies.length === 0 && (
                <p className="px-4 py-3 text-sm text-[#948F99]">Nenhum filme encontrado</p>
              )}
              {!loadingMovies && !moviesError && filteredMovies.length > 0 && (
                <ul className="max-h-72 divide-y divide-[#3E3B47]/60 overflow-y-auto">
                  {filteredMovies.map((movie) => (
                    <li key={movie.id}>
                      <button
                        className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-[#1C1B1E]"
                        type="button"
                        onClick={() => handleSelectMovie(movie.id)}
                      >
                        <span className="text-base font-medium text-white">{movie.title}</span>
                        <span className="text-xs text-[#948F99]">
                          Nota {movie.rating.toFixed(1)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="inline-flex h-16 items-center gap-2.5">
          <div className="inline-flex flex-col items-end">
            <a
              className="font-bold font-secondary text-sm text-white no-underline"
              href="#"
            >
              {user?.username ?? "Convidado"}
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
                src={
                  user?.avatarUrl ??
                  "https://via.placeholder.com/150/3E3B47/FFFFFF?text=User"
                }
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
