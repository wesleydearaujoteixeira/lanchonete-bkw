'use client';

import Button from '../components/button/Button';
import style from './table.module.scss';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { server } from '@/services/globalApi';
import { useForm } from 'react-hook-form';
import { getCookie } from '@/lib/cookiesClient';
import { useRouter } from 'next/navigation';

import { OrderContext } from '@/app/providers/order';
import { useContext, useEffect, useState } from 'react';


const schema = z.object({
    name: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  
    table: z
      .string()
      .min(1, { message: 'A mesa é obrigatória' }) // Valida o campo como string inicialmente
      .transform((val) => parseInt(val, 10)) // Converte o valor para número
      .refine((val) => !isNaN(val) && Number.isInteger(val), { message: 'A mesa deve ser um número inteiro' }),
  });

type FormData = z.infer <typeof schema>


const Table = () => {

    const navigation = useRouter();

    const [token, setToken] = useState<string | null>(null); // State para armazenar o token

    useEffect(() => {
      // Garante que o token seja obtido apenas no client-side
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }, []);

    const { isTableOpen } = useContext(OrderContext); 


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
      })
    
      const onSubmit = async (data: FormData) => {

        console.log('Dados enviados:', data)
        try {
    
          const response = await server.post('order', data, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          console.log('Resposta do server:', response.data);
          isTableOpen(response.data.order.order_id);
  
          
          if (response.status === 200) {
          } else {
            console.error('Erro inesperado ao cadastrar a categoria:', response.statusText);
          }
    
          
    
        } catch (error) {
          console.error('Erro ao cadastrar:', error);
          
        }
        
        navigation.push('/dashboard/order');
        

      }
    


  return (
    <div className={style.container}>    
        <h1> Abrir uma mesa </h1>

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>

            <input type="number" 
              placeholder='Número da mesa'
              required
              {...register('table')}
              className={style.input} 
            />

            {errors.table && <span className={style.error}>{errors.table.message}</span>}


            <input type="text" 
              placeholder='Nome do cliente'
              required
              {...register('name')}
              className={style.input} 
            />

            {errors.name && <span className={style.error}>{errors.name.message}</span>}

            <Button text="Abrir Pedido"/>

        </form>
    </div>
  )
}

export default Table;