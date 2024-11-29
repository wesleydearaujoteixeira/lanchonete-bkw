'use client';

import Image from "next/image";
import styles from "./page.module.css";
import logoImg from '../../public/mega-removebg.png';
import Link from "next/link";

export default function Home() {


  return (
    <main className={styles.containerCenter}>


      <Image
        src={logoImg}
        alt="logo"
        height={150}
        width={150}
        priority
      
      />

      <section className={styles.login} > 
          <form action="" className={styles.form} >
            <input type="email" name="email"
            placeholder="digite seu email"
            required
            className={styles.input}

             />

        <input type="password" name="password"
            placeholder="digite sua senha"
            required
            className={styles.input}
          />

          <button type="submit">
            acessar
          </button>

        

          </form>


          <Link href="/signup" className={styles.text}>  
            Não possui uma conta? Cadastre-se.
          </Link>
      </section>


    </main>    

  );
}
