import { useState } from "react"
import { FiLock, FiMail } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import Background from "../assets/Background.png"
import { Button } from "../components/Button"
import { ButtonText } from "../components/ButtonText"
import { Input } from "../components/Input"
import { useUser } from "../contexts/UserContext"

export function SiginIn() {
  const { setUser } = useUser()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Informe e-mail e senha")
      return
    }

    // TODO: integrar com Identity no backend (.NET) quando disponível
    setUser({
      name: email.split("@")[0] || "Usuário",
      email,
      avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    })
    navigate("/", { replace: true })
  }

  return (
    <div className="flex h-screen items-stretch bg-[#1C1B1E]">
      <form
        className="flex flex-col items-center justify-center gap-5 px-[136px] text-center"
        onSubmit={handleSubmit}
      >
        <h1 className="font-secondary text-5xl font-bold text-[#FF859B]">Movies</h1>
        <p className="font-secondary text-sm font-normal text-white">
          Aplicação para acompanhar tudo que assistir
        </p>

        <h2 className="mt-12 mb-12 text-sm font-normal text-[#CAC4CF]">
          Faça seu login
        </h2>

        <div className="flex w-full flex-col gap-2">
          <Input
            icon={FiMail}
            placeholder="E-mail"
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
        </div>

        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : null}

        <Button title="Entrar" type="submit" />

        <ButtonText title="Criar conta" />
      </form>
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }}
      />
    </div>
  )
}
