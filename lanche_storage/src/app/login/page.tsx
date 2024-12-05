'use client';

import styles from '../page.module.scss';
import { ImagesLogo } from '../utils/images/ImagesLogo';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { server } from '@/services/globalApi';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type FormData = z.infer<typeof schema>;

export default function Page() {
  const navigation = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await server.post('login', data);
      console.log('Resposta do server:', response.data.user);

      if (response.status === 200) {
        // Define o cookie no cliente
        const expressTime = 60 * 60 * 24 * 30; // 30 dias em segundos
        document.cookie = `session=${response.data.user.token}; max-age=${expressTime}; path=/; ${
          process.env.NODE_ENV === 'production' ? 'Secure;' : ''
        }`;

        // Redireciona para o dashboard
        navigation.push('/dashboard');
      } else {
        console.error('Erro inesperado no login:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
    }
  };

  return (
    <>
      <div className={styles.containerCenter}>
        <ImagesLogo height={200} width={200} />

        <section className={styles.login}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              Acessar
            </button>
          </form>
          <Link href="/register" className={styles.text}>
            já possui uma conta? <span> cadastre-se </span>
          </Link>
        </section>
      </div>
    </>
  );
}
