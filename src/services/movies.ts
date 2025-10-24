export type Movie = {
  id: string
  title: string
  description: string
  rating: number // 0..5
  tags: string[]
  year?: number
}

export type MovieInput = {
  title: string
  description: string
  tags: string[]
  year?: number
  rating?: number
}

const STORAGE_KEY = "prover-movies:movies"

const seedMovies: Movie[] = [
  {
    id: "1",
    title: "Interestelar",
    description:
      "Ex-piloto da NASA lidera uma missao atraves de um buraco de minhoca em busca de um novo lar para a humanidade.",
    rating: 4.5,
    tags: ["Ficcao Cientifica", "Drama"],
    year: 2014,
  },
  {
    id: "2",
    title: "A Origem",
    description:
      "Um ladrao invade sonhos para roubar segredos corporativos e precisa plantar uma ideia na mente de um herdeiro.",
    rating: 4,
    tags: ["Acao", "Sci-Fi"],
    year: 2010,
  },
  {
    id: "3",
    title: "O Cavaleiro das Trevas",
    description:
      "Batman enfrenta o Coringa enquanto luta para proteger Gotham do caos que o vilao deseja instaurar.",
    rating: 5,
    tags: ["Acao", "Crime"],
    year: 2008,
  },
]

function cloneMovies(source: Movie[]): Movie[] {
  return source.map((movie) => ({ ...movie, tags: [...movie.tags] }))
}

function loadMockMovies(): Movie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return cloneMovies(JSON.parse(raw) as Movie[])
    }
  } catch {}
  const seeded = cloneMovies(seedMovies)
  saveMockMovies(seeded)
  return seeded
}

function saveMockMovies(movies: Movie[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies))
  } catch {}
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export async function listMovies(signal?: AbortSignal): Promise<Movie[]> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Movies): substituir por chamada GET /movies
    const res = await fetch(`${baseURL}/movies`, { signal })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return (await res.json()) as Movie[]
  }

  return loadMockMovies()
}

export async function getMovieById(id: string, signal?: AbortSignal): Promise<Movie> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Movies): substituir por chamada GET /movies/{id}
    const res = await fetch(`${baseURL}/movies/${id}`, { signal })
    if (!res.ok) {
      throw new Error(res.status === 404 ? "Filme nao encontrado" : `HTTP ${res.status}`)
    }
    return (await res.json()) as Movie
  }

  const movies = loadMockMovies()
  const movie = movies.find((m) => m.id === id)
  if (!movie) {
    throw new Error("Filme nao encontrado")
  }
  return movie
}

export async function createMovie(payload: MovieInput, signal?: AbortSignal): Promise<Movie> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Movies): substituir por chamada POST /movies
    const res = await fetch(`${baseURL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return (await res.json()) as Movie
  }

  const movies = loadMockMovies()
  const movie: Movie = {
    id: generateId(),
    title: payload.title,
    description: payload.description,
    tags: [...payload.tags],
    year: payload.year,
    rating: payload.rating ?? 0,
  }
  movies.push(movie)
  saveMockMovies(movies)
  return movie
}

export async function updateMovie(
  movieId: string,
  payload: MovieInput,
  signal?: AbortSignal,
): Promise<Movie> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Movies): substituir por chamada PUT/PATCH /movies/{id}
    const res = await fetch(`${baseURL}/movies/${movieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return (await res.json()) as Movie
  }

  const movies = loadMockMovies()
  const index = movies.findIndex((movie) => movie.id === movieId)
  if (index === -1) {
    throw new Error("Filme nao encontrado")
  }
  const current = movies[index]
  const updated: Movie = {
    ...current,
    title: payload.title,
    description: payload.description,
    tags: [...payload.tags],
    year: payload.year,
    rating: payload.rating ?? current.rating,
  }
  movies[index] = updated
  saveMockMovies(movies)
  return updated
}

export async function deleteMovie(movieId: string, signal?: AbortSignal): Promise<void> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Movies): substituir por chamada DELETE /movies/{id}
    const res = await fetch(`${baseURL}/movies/${movieId}`, {
      method: "DELETE",
      signal,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return
  }

  const movies = loadMockMovies().filter((movie) => movie.id !== movieId)
  saveMockMovies(movies)
}

export async function submitMovieRating(
  movieId: string,
  rating: number,
  signal?: AbortSignal,
): Promise<void> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (baseURL) {
    // TODO (.NET Movies): substituir por chamada POST /movies/{id}/ratings
    const res = await fetch(`${baseURL}/movies/${movieId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
      signal,
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return
  }

  const movies = loadMockMovies()
  const index = movies.findIndex((movie) => movie.id === movieId)
  if (index === -1) {
    throw new Error("Filme nao encontrado")
  }

  movies[index] = {
    ...movies[index],
    rating,
  }
  saveMockMovies(movies)
}

