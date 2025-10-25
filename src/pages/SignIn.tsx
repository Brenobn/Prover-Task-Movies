import { useState } from "react"
import { FiLock, FiUser } from "react-icons/fi"
import { Navigate, useNavigate } from "react-router-dom"
import Background from "../assets/Background.png"
import { Button } from "../components/Button"
import { ButtonText } from "../components/ButtonText"
import { Input } from "../components/Input"
import { useUser } from "../contexts/UserContext"
import { loginUser } from "../services/auth"

export function SignIn() {
  const { user, refreshUser } = useUser()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!username || !password) {
      setError("Informe usuario e senha")
      return
    }

    setLoading(true)
    try {
      await loginUser({ username, password })
      const authenticated = await refreshUser()
      if (!authenticated) {
        throw new Error("Nao foi possivel confirmar a sessao")
      }
      navigate("/", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel entrar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-stretch bg-[#1C1B1E]">
      <form
        className="flex flex-col items-center justify-center gap-5 px-[136px] text-center"
        onSubmit={handleSubmit}
      >
        <h1 className="font-secondary text-5xl font-bold text-[#FF859B]">Movies</h1>
        <p className="font-secondary text-sm font-normal text-white">
          Aplicacao para acompanhar tudo que assistir
        </p>

        <h2 className="mt-12 mb-12 text-sm font-normal text-[#CAC4CF]">
          Faca seu login
        </h2>

        <div className="flex w-full flex-col gap-2">
          <Input
            icon={FiUser}
            placeholder="Nome de usuario"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Input
            icon={FiLock}
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <Button title={loading ? "Entrando..." : "Entrar"} type="submit" disabled={loading} />

        <ButtonText title="Criar conta" to="/signup" />
      </form>
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  )
}

