'use client';
import styles from '../page.module.scss'
import { ImagesLogo } from '../utils/images/ImagesLogo'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { server } from '@/services/globalApi';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z
    .string()
    .email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
})

type FormData = z.infer <typeof schema>

export default function Page() {


  const navigation = useRouter();


  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    console.log('Dados enviados:', data)
    try {

      const response = await server.post('register', data);
      console.log('Resposta do server:', response.data);

      
      if (response.status === 200) {
        navigation.push('/dashboard'); // Redireciona para o dashboard
      } else {
        console.error('Erro inesperado no login:', response.statusText);
      }

      

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      
    }
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <ImagesLogo height={200} width={200} />

        <section className={styles.login}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              placeholder="Digite seu nome..."
              className={styles.input}
              {...register('name')}
            />
            {errors.name && <span className={styles.error}>{errors.name.message}</span>}

            <input
              type="email"
              placeholder="Digite seu email..."
              className={styles.input}
              {...register('email')}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}

            <input
              type="password"
              placeholder="***********"
              className={styles.input}
              {...register('password')}
            />
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}

            <button type="submit" className={styles.button}>
              Cadastrar
            </button>
          </form>
          <Link href="/" className={styles.text}>
            já possui uma conta? <span> Faça Login </span>
          </Link>
        </section>
      </div>
    </>
  )
}
