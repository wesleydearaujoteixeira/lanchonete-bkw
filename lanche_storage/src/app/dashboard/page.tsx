 'use client'
 import { getCookie } from "@/lib/cookiesClient";
 import { useRouter } from "next/navigation";
 
 const Dash = () => {


    const token = getCookie("session");
    const router = useRouter();


    if(!token) {
        router.push("/login");
        return null;
    }


    return (
        <div>
            <h1>valor do token {token} </h1>
        </div>
    )
}

export default Dash;