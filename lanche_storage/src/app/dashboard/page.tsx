 'use client'
import { getCookie } from "@/lib/cookiesClient";
import { useRouter } from "next/navigation";
import Orders from "./components/orders/page";
 
 const Dash = () => {


    const token = getCookie("session");
    const id = getCookie("user_id");

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