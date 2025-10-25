import { apiRequest } from "./api"

export type Movie = {
  id: string
  title: string
  description: string
  rating: number
  tags: string[]
  year?: number
  releaseDate?: string
}

export type MovieInput = {
  title: string
  description: string
  tags: string[]
  year?: number
  rating?: number
}

type ApiMovie = {
  id: string
  titulo: string
  nota: number
  observacao: string
  dtAnoLancamento: string
  marcadores: string[]
}

type ApiMoviePayload = {
  id?: string
  titulo: string
  nota: number
  observacao: string
  dtAnoLancamento: string
  marcadores: string[]
}

function parseYear(dateValue?: string | null) {
  if (!dateValue) return undefined
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return date.getUTCFullYear()
}

function buildReleaseDate(year?: number) {
  if (!year) {
    return new Date().toISOString()
  }
  return new Date(Date.UTC(year, 0, 1)).toISOString()
}

function mapApiMovie(movie: ApiMovie): Movie {
  return {
    id: movie.id,
    title: movie.titulo,
    description: movie.observacao,
    rating: movie.nota,
    tags: movie.marcadores ?? [],
    year: parseYear(movie.dtAnoLancamento),
    releaseDate: movie.dtAnoLancamento,
  }
}

function toApiPayload(payload: MovieInput, id?: string): ApiMoviePayload {
  return {
    id,
    titulo: payload.title,
    observacao: payload.description,
    nota: typeof payload.rating === "number" ? payload.rating : 0,
    dtAnoLancamento: buildReleaseDate(payload.year),
    marcadores: payload.tags,
  }
}

export async function listMovies(signal?: AbortSignal): Promise<Movie[]> {
  const response = await apiRequest<ApiMovie[]>(`/Filme/todos-filmes`, {
    method: "GET",
    signal,
  })
  return response.map(mapApiMovie)
}

export async function getMovieById(id: string, signal?: AbortSignal): Promise<Movie> {
  const response = await apiRequest<ApiMovie>(`/Filme/filme/${id}`, {
    method: "GET",
    signal,
  })
  return mapApiMovie(response)
}

export async function createMovie(payload: MovieInput, signal?: AbortSignal): Promise<Movie> {
  const response = await apiRequest<ApiMovie>(`/Filme/adicionar-filme`, {
    method: "POST",
    json: toApiPayload(payload),
    signal,
  })
  return mapApiMovie(response)
}

export async function updateMovie(
  movieId: string,
  payload: MovieInput,
  signal?: AbortSignal,
): Promise<Movie> {
  const response = await apiRequest<ApiMovie>(`/Filme/editar-filme/${movieId}`, {
    method: "PUT",
    json: toApiPayload(payload, movieId),
    signal,
  })
  return mapApiMovie(response)
}

export async function deleteMovie(movieId: string, signal?: AbortSignal): Promise<void> {
  await apiRequest(`/Filme/excluir-filme/${movieId}`, {
    method: "DELETE",
    signal,
  })
}

