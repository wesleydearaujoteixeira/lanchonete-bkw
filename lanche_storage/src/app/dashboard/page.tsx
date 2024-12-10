'use client'
import { useRouter } from "next/navigation";
import Orders from "./components/orders/page";
import { useEffect, useState } from "react";
 
 const Dash = () => {


    const [token, setToken] = useState<string | null>(null); 
    useEffect(() => {
      // Garante que o token seja obtido apenas no client-side
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }, []);
  

    const router = useRouter();


    if(!token) {
        router.push("/");
        return null;
    }


    return (
        <div>
            <Orders/>
        </div>
    )
}

export default Dash;