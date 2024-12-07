'use client';

import style from './modal.module.scss';
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '@/app/providers/order';
import { server } from '@/services/globalApi';
import { toast } from 'sonner';
import { getCookie } from '@/lib/cookiesClient';



interface Product {
    product_id: string;
    name: string;
    price: string;
    description: string;
    banner: string;
    created_at: string;
    updated_at: string;
    category_id: string;
  }
  
  interface Order {
    order_id: string;
    table: number;
    status: boolean;
    draft: boolean;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  interface OrderItem {
    id: string;
    amount: number;
    created_at: string;
    updated_at: string;
    order_id_item: string;
    product_item: string;
    product: Product;
    order: Order;
  }
  
  // Tipagem para o array de orders
  type Orders = OrderItem[];
  


const Modal = () => {


    const {onRequestClose, order_id} = useContext(OrderContext);

    const [orderDetail, setOrderDetail] = useState  <Orders> ([]);


    const handleClose = () => {
        onRequestClose();
    }

    const loadReuestOrders = async () => {
        try {
            
            const response = await server.get(`details_table/${order_id}`,{
                headers: {
                    Authorization: `Bearer ${getCookie("session")}`,
                },
            });

            console.log(response.data.orders);
            setOrderDetail(response.data.orders);
            

            toast.success(" Orders details, carregadas com sucesso!");

        } catch (error) {
            console.error('Erro ao carregar os pedidos:', error);
            toast.error("Erro ao carregar os pedidos!");
            
        }
    }


    useEffect(() => {
        
        loadReuestOrders();

    }, []);


  return (
    <div className={style.dialogContainer}>

        <section className={style.content}>
            <button className={style.dialogBack} onClick={handleClose}>
                <IoMdClose size={50} color='#FF3F4b' />
            </button>


            {orderDetail.length > 0 && orderDetail.map((item, index) => {
                return (
            <article key={item.id} className={style.container}>
                <h2> Detalhes do Pedido </h2>

                <span className={style.table}> 
                    Mesa <b>{item.order.table}</b>
                </span>


                <section className={style.item} >
                    <span>
                        1 - <b> {item.product.name}  </b>
                    </span>
                    <span> {item.product.description} </span>
                </section>

                <button className={style.btnOrder}>
                    Concluir Pedido
                </button>

            </article>   
                )

            })}

            

        </section>
    </div>
  )
}

export default Modal
