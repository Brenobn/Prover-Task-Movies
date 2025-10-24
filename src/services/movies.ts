export type Movie = {
  id: string
  title: string
  description: string
  rating: number // 0..5
  tags: string[]
}

const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Interestelar",
    description:
      "Uma equipe viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.",
    rating: 5,
    tags: ["Ficção Científica", "Drama"],
  },
  {
    id: "2",
    title: "A Origem",
    description:
      "Um ladrão invade sonhos para roubar segredos e precisa plantar uma ideia em uma mente.",
    rating: 4,
    tags: ["Ação", "Sci-Fi"],
  },
  {
    id: "3",
    title: "O Cavaleiro das Trevas",
    description: "Batman enfrenta o Coringa enquanto luta para proteger Gotham do caos.",
    rating: 5,
    tags: ["Ação", "Crime"],
  },
]

export async function listMovies(signal?: AbortSignal): Promise<Movie[]> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    const res = await fetch(`${baseURL}/movies`, { signal })
    if (!res.ok) { throw new Error(`HTTP ${res.status}`) }
    return (await res.json()) as Movie[]
  }

  return Promise.resolve(mockMovies)
}

export async function getMovieById(id: string, signal?: AbortSignal): Promise<Movie> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    const res = await fetch(`${baseURL}/movies/${id}`, { signal })
    if (!res.ok) {
      // biome-ignore lint/style/noMagicNumbers: ok
      throw new Error(res.status === 404 ? "Filme não encontrado" : `HTTP ${res.status}`)
    }
    return (await res.json()) as Movie
  }

  const movie = mockMovies.find((m) => m.id === id)
  if (!movie) {
    throw new Error("Filme não encontrado")
  }
  return Promise.resolve(movie)
}

