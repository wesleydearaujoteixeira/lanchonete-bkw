'use client';

import { useRouter } from "next/navigation";
import Orders from "./components/orders/page";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Importa js-cookie

const Dash = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtém o token dos cookies no client-side
    const storedToken = Cookies.get("token");
    if (!storedToken) {
      router.push("/"); // Redireciona caso o token não exista
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // Garante que nada seja renderizado enquanto verifica o token
  if (!token) {
    return null;
  }

  return (
    <div>
      <Orders />
    </div>
  );
};

export default Dash;
