import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(`${API_URL}/auth/register`, { email, password });
      alert("Usuário registrado com sucesso! Agora faça login.");
      window.location.href = "/login";
    } catch (err) {
      alert("Erro: " + (err.response?.data?.error || "Falha na requisição"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 flex items-center justify-center space-x-2">
          <FaUserPlus className="text-green-400" />
          <span>Cadastrar</span>
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded border text-black"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded border text-black"
        />
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Registrar
        </button>
        <p className="mt-4 text-sm text-center">
          Já tem conta?{" "}
          <Link href="/login" className="text-green-400 hover:underline flex items-center justify-center space-x-1">
            <FaSignInAlt /> <span>Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
