'use client';

import Button from '../components/button/Button';
import style from './category.module.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { server } from '@/services/globalApi';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
});

type FormData = z.infer<typeof schema>;

const Category = () => {
  const navigation = useRouter();
  const [token, setToken] = useState<string | null>(null); // State para armazenar o token

  useEffect(() => {
    // Garante que o token seja obtido apenas no client-side
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('Dados enviados:', data);
    try {
      const response = await server.post('category', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Resposta do server:', response.data);

      if (response.status === 200) {
        console.log('Categoria cadastrada com sucesso!');
      } else {
        console.error('Erro inesperado ao cadastrar a categoria:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }

    navigation.push('/dashboard');
  };

  return (
    <div className={style.container}>
      <h1>Nova Categoria</h1>

      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Nome da Categoria"
          required
          {...register('name')}
          className={style.input}
        />
        {errors.name && <span className={style.error}>{errors.name.message}</span>}

        <Button text="Enviar" />
      </form>
    </div>
  );
};

export default Category;
