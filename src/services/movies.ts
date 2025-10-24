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
    rating: 3.8,
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
    description:
      "Batman enfrenta o Coringa enquanto luta para proteger Gotham do caos.",
    rating: 5,
    tags: ["Ação", "Crime"],
  },
  {
    id: "4",
    title: "Forrest Gump",
    description:
      "Um homem simples com um coração puro vive eventos marcantes da história americana.",
    rating: 5,
    tags: ["Drama", "Romance"],
  },
  {
    id: "5",
    title: "Vingadores: Ultimato",
    description:
      "Os heróis restantes se unem para reverter o estalo de Thanos e salvar o universo.",
    rating: 5,
    tags: ["Ação", "Super-Heróis"],
  },
  {
    id: "6",
    title: "Gladiador",
    description:
      "Um general romano busca vingança contra o imperador corrupto que destruiu sua família.",
    rating: 5,
    tags: ["Ação", "Histórico"],
  },
  {
    id: "7",
    title: "Clube da Luta",
    description:
      "Um homem entediado com a vida corporativa encontra uma forma extrema de se sentir vivo.",
    rating: 4,
    tags: ["Drama", "Psicológico"],
  },
  {
    id: "8",
    title: "Matrix",
    description:
      "Um hacker descobre que o mundo que conhece é uma simulação criada por máquinas.",
    rating: 5,
    tags: ["Ficção Científica", "Ação"],
  },
  {
    id: "9",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    description:
      "Um grupo improvável parte em uma jornada para destruir um anel que ameaça o mundo.",
    rating: 5,
    tags: ["Fantasia", "Aventura"],
  },
  {
    id: "10",
    title: "Parasita",
    description:
      "Uma família pobre se infiltra na vida de uma família rica em busca de oportunidades.",
    rating: 5,
    tags: ["Drama", "Suspense"],
  },
  {
    id: "11",
    title: "Coringa",
    description:
      "A origem sombria de Arthur Fleck, um comediante fracassado que se transforma em um símbolo do caos.",
    rating: 5,
    tags: ["Drama", "Psicológico"],
  },
  {
    id: "12",
    title: "O Poderoso Chefão",
    description:
      "A saga da família Corleone e sua luta pelo poder e pela sobrevivência no mundo do crime.",
    rating: 5,
    tags: ["Crime", "Drama"],
  },
  {
    id: "13",
    title: "Duna",
    description:
      "Um jovem herdeiro embarca em uma jornada para proteger o planeta mais valioso do universo.",
    rating: 4,
    tags: ["Ficção Científica", "Aventura"],
  },
  {
    id: "14",
    title: "Homem-Aranha: Sem Volta Para Casa",
    description:
      "Peter Parker enfrenta vilões de universos diferentes após um feitiço dar errado.",
    rating: 4,
    tags: ["Ação", "Super-Heróis"],
  },
  {
    id: "15",
    title: "O Grande Gatsby",
    description:
      "Um misterioso milionário organiza festas extravagantes em busca de um amor perdido.",
    rating: 3,
    tags: ["Drama", "Romance"],
  },
];


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

