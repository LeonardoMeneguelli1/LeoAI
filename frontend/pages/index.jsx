import Link from "next/link";
import { FaUserPlus, FaSignInAlt, FaRobot } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      {/* Logo / Título */}
      <div className="flex items-center space-x-3 mb-8">
        <FaRobot className="text-green-400 text-4xl" />
        <h1 className="text-4xl font-bold">LeoAI</h1>
      </div>

      <p className="text-gray-400 mb-12 text-center max-w-md">
        Bem-vindo ao LeoAI — sua plataforma inteligente inspirada no ChatGPT.
        Escolha como deseja começar:
      </p>

      <div className="flex space-x-6">
        <Link href="/signup">
          <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition">
            <FaUserPlus />
            <span>Cadastrar</span>
          </button>
        </Link>

        <Link href="/login">
          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition">
            <FaSignInAlt />
            <span>Login</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
