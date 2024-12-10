'use client';

import style from './modal.module.scss';
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useState } from 'react';
import { OrderContext } from '@/app/providers/order';
import { server } from '@/services/globalApi';
import { toast } from 'sonner';
import { getCookie } from '@/lib/cookiesClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



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
  
const TotalOrders = (order: OrderItem[]) => {

    const Total = order.reduce((total, item) => {
        
        const itemTotal = parseFloat(item.product.price) * item.amount;
        return total + itemTotal;

    }, 0);

    return Total.toFixed(2);

}



const Modal = () => {


    const {onRequestClose, order_id} = useContext(OrderContext);

    const [orderDetail, setOrderDetail] = useState  <Orders> ([]);

    const router = useRouter();


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


    const finishOrder = async () => {
        try {
            
            const response = await server.put(`finish/${order_id}`, {},{
                headers: {
                    Authorization: `Bearer ${getCookie("session")}`,
                },
            });

            console.log(response.data);


            toast.success("Pedido finalizado com sucesso!");
            onRequestClose();
            router.refresh();

        
        }
        catch (error) {
            console.error('Erro ao finalizar o pedido:', error);
            toast.error("Erro ao finalizar o pedido!");
            
        }


}


  return (
    <div className={style.dialogContainer}>

        <section className={style.content}>
            <button className={style.dialogBack} onClick={handleClose}>
                <IoMdClose size={50} color='#FF3F4b' />
            </button>


            {orderDetail.length > 0 && orderDetail.map((item) => {
                return (
            <article key={item.id} className={style.container}>
                <h2> Detalhes do Pedido </h2>

                <span className={style.table}> 
                    Mesa <b> {item.order.name} - {item.order.table}º </b>
                </span>
               
               

                <section className={style.item} >
                    <div>
                        <span>
                            {item.amount} - <b> {item.product.name}  </b>
                        </span>
                        <span> {item.product.description} </span>
                    </div>

                    <div className={style.priceAmount} >
                        <span>
                            R$ {(parseFloat(item.product.price) * item.amount).toFixed(2) }
                        </span>
                    </div>

                    <div>
                    <Image
                        src={item.product.banner}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className={style.imageItem}
                    />
                    </div>
                </section>

              

            </article>   
                )

            })}


            <h3 className={style.totalPedido} > Total do Pedido  R$ {TotalOrders(orderDetail)} </h3>

              <button className={style.btnOrder} onClick={()=> finishOrder()}>
                    Concluir Pedido
                </button>

        </section>
    </div>
  )
}

export default Modal
