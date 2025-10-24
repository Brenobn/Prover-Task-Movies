import { FiLock, FiMail } from "react-icons/fi";
import Background from "../assets/Background.png"; // Correto
import { Button } from "../components/Button";
import { ButtonText } from "../components/ButtonText";
import { Input } from "../components/Input";

export function SiginIn() {
  return (
    <div className="h-screen bg-[#1C1B1E] flex items-stretch">
      <form className="py-0 px-[136px] flex flex-col justify-center items-center text-center gap-5">
        <h1 className="text-[#FF859B] font-secondary text-5xl font-bold">
          Movies
        </h1>
        <p className="text-white font-secondary text-sm font-normal">
          Aplicação para acompanhar tudo que assistir
        </p>

        <h2 className="text-[#CAC4CF] text-sm font-normal mt-12 mb-12">
          Faça seu login
        </h2>

        <div className="flex flex-col gap-2 w-full">
          <Input placeholder="E-mail" type="text" icon={FiMail} />
          <Input placeholder="Senha" type="password" icon={FiLock} />
        </div>

        <Button title="Entrar" />
        
        <ButtonText title="Criar conta" />
      </form>
      <div 
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }} 
      />

    </div>
  );
}