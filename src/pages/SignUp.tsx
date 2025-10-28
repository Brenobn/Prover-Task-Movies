import { useState } from "react"
import { FiArrowLeft, FiLock, FiMail, FiUser } from "react-icons/fi"
import { Navigate, useNavigate } from "react-router-dom"
import Background from "../assets/Background.png"
import { Button } from "../components/Button"
import { ButtonText } from "../components/ButtonText"
import { Input } from "../components/Input"
import { useUser } from "../contexts/UserContext"
import { registerUser } from "../services/auth"

const PASSWORD_REQUIREMENTS = [
  {
    test: (value: string) => /[A-Z]/.test(value),
    label: "Letra maiuscula",
    errorFragment: "uma letra maiuscula",
  },
  {
    test: (value: string) => /[0-9]/.test(value),
    label: "Numero",
    errorFragment: "um numero",
  },
  {
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
    label: "Caractere especial",
    errorFragment: "um caractere especial",
  },
]

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

    const missingRequirements = PASSWORD_REQUIREMENTS.filter((rule) => !rule.test(password))
    if (missingRequirements.length > 0) {
      const details = missingRequirements.map((rule) => rule.errorFragment).join(", ")
      setError(`A senha deve conter ${details}.`)
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
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === "string") {
        setError(err)
      } else {
        setError("Nao foi possivel cadastrar")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-stretch bg-[#1C1B1E]">
      <form
        className="flex flex-col items-start justify-center gap-5 px-[136px] text-center"
        onSubmit={handleSubmit}
      >
        <h1 className="font-secondary text-5xl font-bold text-[#FF859B]">Movies</h1>
        <h2 className="font-secondary text-sm font-normal text-[#CAC4CF]">
          Aplicacao para acompanhar tudo que assistir
        </h2>

        <p className="mt-8 mb-8 text-2xl font-secondary font-medium text-white">
          Crie sua conta
        </p>

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

        {error ? <p className="text-sm text-red-400 whitespace-pre-line">{error}</p> : null}

        <Button title={loading ? "Cadastrando..." : "Cadastrar"} type="submit" disabled={loading} />

        <ButtonText icon={FiArrowLeft} title="Voltar para o login" to="/signin" className="inline-flex items-center my-0 mx-auto gap-2 border-0 bg-none text-base text-[#FF859B] [&_svg]:text-[#FF859B]" />
      </form>
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  )
}
