import { useEffect, useState } from "react"
import { GoArrowLeft } from "react-icons/go"
import { useParams } from "react-router-dom"
import { ButtonText } from "../components/ButtonText"
import { StarRating } from "../components/StarRating"
import { Tag } from "../components/Tag"
import { getMovieById, type Movie } from "../services/movies"

export function Details() {
  const { movieId } = useParams<{ movieId: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!movieId) {
      setError("Filme não encontrado")
      setLoading(false)
      return
    }

    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    getMovieById(movieId, ctrl.signal)
      .then(setMovie)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar filme")
      })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [movieId])

  return (
    <div className="mx-auto my-10 flex max-w-6xl flex-col gap-10">
      <div className="flex items-center gap-2">
        {/** biome-ignore assist/source/useSortedAttributes: ok */}
        <ButtonText title="Voltar" icon={GoArrowLeft} />
      </div>

      {loading && (
        <p className="font-primary text-[#999591] text-base">Carregando filme...</p>
      )}
      {error && <p className="font-primary text-base text-red-400">{error}</p>}

      {!(loading || error ) && movie && (
        <>
          <div className="inline-flex flex-row items-center">
            <h1 className="mr-5 font-medium font-secondary text-4xl text-white">
              {movie.title}
            </h1>
            <StarRating value={movie.rating} />
          </div>

          {movie.tags.length > 0 && (
            <div className="inline-flex items-start gap-2">
              {movie.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}

          <p className="font-normal font-secondary text-base text-white">
            {movie.description}
          </p>
        </>
      )}
    </div>
  )
}

