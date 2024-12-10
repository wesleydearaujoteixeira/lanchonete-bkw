'use client';

import styles from './page.module.scss';
import { ImagesLogo } from './utils/images/ImagesLogo';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { server } from '@/services/globalApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie'; 

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

      // Define os cookies no cliente
      Cookies.set('token', response.data.user.token, {
        expires: 7, // Expira em 7 dias
        secure: process.env.NODE_ENV === 'production', // Apenas HTTPS em produção
        sameSite: 'Strict', // Previne envios cross-site
        path: '/', // Disponível em toda a aplicação
      });

      Cookies.set('user_id', response.data.user.user_id, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
      });

      // Redireciona para o dashboard
      navigation.push('/dashboard/product');
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      toast.warning('Login mal sucedido!');
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
