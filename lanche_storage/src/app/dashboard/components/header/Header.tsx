'use client';

import Link from 'next/link';
import styles from './header.module.scss';
import { ImagesLogo } from '@/app/utils/images/ImagesLogo';
import { FiLogOut } from "react-icons/fi";
import { useRouter } from 'next/navigation';



const Header = () => {

    const router = useRouter();

    const handleLogOut = () => {


        const confirmOut = confirm('Tem certeza que deseja sair?');

        if(confirmOut) {


            setTimeout(() => {
                document.cookie = "session=; max-age=0; path=/;";
                router.push("/");
            }, 1000);
        }


        
    }



    return (
        <header className={styles.headerContainer} >
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <ImagesLogo height={100} width={100}/>
                </Link>


                <nav>
                    <Link href="/dashboard/category">
                        Categoria
                    </Link>
                    <Link href="/dashboard/product">
                        Produto
                    </Link>

                    <div onClick={handleLogOut}>
                        <FiLogOut size={30} color='#fff' />
                    </div>

                </nav>

              



            </div>




        </header>
    )
}


export default Header;