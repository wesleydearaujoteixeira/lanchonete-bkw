'use client';

import Button from '../components/button/Button';
import style from './table.module.scss';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { server } from '@/services/globalApi';
import { useForm } from 'react-hook-form';
import { getCookie } from '@/lib/cookiesClient';
import { useRouter } from 'next/navigation';
import { OrderContext } from '@/app/providers/order';
import { useContext, useEffect } from 'react';

// Esquema de validação com Zod
const schema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  table: z
    .string()
    .min(1, { message: 'A mesa é obrigatória' })
    .transform((val) => parseInt(val, 10)) // Converte para número
    .refine((val) => !isNaN(val) && Number.isInteger(val), {
      message: 'A mesa deve ser um número inteiro',
    }),
});

type FormData = z.infer<typeof schema>;

const Table = () => {
  const navigation = useRouter();
  const { isTableOpen } = useContext(OrderContext);

  // Recuperar o token usando cookies (substituindo localStorage)
  const token = getCookie('token');

  // Hook para gerenciar formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Função de envio do formulário
  const onSubmit = async (data: FormData) => {
    try {
      const response = await server.post('order', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Resposta do servidor:', response.data);
      isTableOpen(response.data.order.order_id);

      if (response.status === 200) {
        navigation.push('/dashboard/order');
      } else {
        console.error('Erro inesperado:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao abrir a mesa:', error);
    }
  };

  return (
    <div className={style.container}>
      <h1>Abrir uma mesa</h1>

      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        {/* Campo de número da mesa */}
        <input
          type="number"
          placeholder="Número da mesa"
          {...register('table')}
          className={style.input}
        />
        {errors.table && <span className={style.error}>{errors.table.message}</span>}

        {/* Campo de nome do cliente */}
        <input
          type="text"
          placeholder="Nome do cliente"
          {...register('name')}
          className={style.input}
        />
        {errors.name && <span className={style.error}>{errors.name.message}</span>}

        {/* Botão de envio */}
        <Button text="Abrir Pedido" />
      </form>
    </div>
  );
};

export default Table;
