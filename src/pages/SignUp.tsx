import { useState } from "react"
import { FiArrowLeft, FiLock, FiMail, FiUser } from "react-icons/fi"
import { Navigate, useNavigate } from "react-router-dom"
import Background from "../assets/Background.png"
import { Button } from "../components/Button"
import { ButtonText } from "../components/ButtonText"
import { Input } from "../components/Input"
import { useUser } from "../contexts/UserContext"
import { registerUser } from "../services/auth"

export function SignUp() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!username || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas nao conferem")
      return
    }

    setLoading(true)
    try {
      await registerUser({ username, email, password, confirmPassword })
      navigate("/signin", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel cadastrar")
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
          Crie sua conta
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
            icon={FiMail}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            icon={FiLock}
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            icon={FiLock}
            placeholder="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <Button title={loading ? "Cadastrando..." : "Cadastrar"} type="submit" disabled={loading} />

        <ButtonText icon={FiArrowLeft} title="Voltar para o login" to="/signin" />
      </form>
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  )
}

