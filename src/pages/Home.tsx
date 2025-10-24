import { useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { Link } from "react-router-dom"
import { Section } from "../components/Section"
import { StarRating } from "../components/StarRating"
import { Tag } from "../components/Tag"
import { listMovies, type Movie } from "../services/movies"

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    listMovies(ctrl.signal)
      .then(setMovies)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar filmes")
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-around gap-[460px]">
        <h1 className="font-normal font-secondary text-3xl text-white">Meus Filmes</h1>

        <Link
          className="mt-4 inline-flex h-12 w-52 shrink-0 items-center gap-2 rounded-lg border-0 bg-[#FF859B] p-7 font-medium text-[#3E3B47] disabled:opacity-50"
          to="/criarfilme"
        >
          <FiPlus />
          Adicionar filme
        </Link>
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {loading && (
          <p className="font-primary text-[#999591] text-base">Carregando filmes...</p>
        )}
        {error && <p className="font-primary text-base text-red-400">{error}</p>}
        {!(loading || error ) && movies.length === 0 && (
          <p className="font-primary text-[#999591] text-base">Nenhum filme encontrado.</p>
        )}
        {!(loading || error ) &&
          movies.map((m) => (
            <Section key={m.id} title={m.title} to={`/detalhes/${m.id}`}>
              <StarRating value={m.rating} />
              <p className="font-normal font-primary text-[#999591] text-base">
                {m.description}
              </p>
              <div className="mt-3.5 flex gap-2">
                {m.tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            </Section>
          ))}
      </div>
    </div>
  )
}
