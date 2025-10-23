import { FiLock, FiMail } from "react-icons/fi";
import Background from "../assets/Background.png"; // Correto
import { Button } from "../components/Button";
import { ButtonText } from "../components/ButtonText";
import { Input } from "../components/Input";

export function SiginIn() {
  return (
    // 1. O PAI (estava correto)
    <div className="h-screen bg-[#1C1B1E] flex items-stretch">
      
      {/* 2. FILHO 1: O FORMULÁRIO */}
      {/* - Adicionei padding horizontal (ex: px-[136px]) 
        - Você pode ajustar esse valor como quiser
      */}
      <form className="py-[136px] px-[136px] flex flex-col justify-center items-center text-center">
        <h1 className="text-[#FF859B] font-secondary text-5xl font-bold">
          {/* O Figma diz "RocketMovies", mas vou manter o seu */}
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
        
        {/* - CORREÇÃO: Usamos 'children' e não 'title'
          - CORREÇÃO: Corrigido o typo "cibta"
        */}
        <ButtonText title="Criar conta" />

        {/* O <div> DA IMAGEM NÃO FICA AQUI DENTRO! 
          Eu o movi para fora do <form>
        */}
      </form>

      {/* 3. FILHO 2: A IMAGEM DE FUNDO */}
      {/*
        - Este é o segundo filho do <div> principal
        - 'flex-1' faz ele "crescer" e ocupar o resto do espaço
        - 'style' aplica a imagem
        - Ele é "auto-fechado" (<div ... />) pois não tem nada dentro
      */}
      <div 
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Background})` }} 
      />

    </div>
  );
}