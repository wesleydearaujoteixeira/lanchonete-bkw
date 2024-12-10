'use client';

import { useEffect, useState, useCallback, useContext } from 'react';
import styles from './orders.module.scss';
import { TbRefresh } from "react-icons/tb";
import { server } from '@/services/globalApi';
import { toast } from 'sonner';
import { OrderContext } from '@/app/providers/order';
import Modal from '../modal/Modal';
import { removeQuotes } from '@/app/utils/removeString';
import { getCookie } from '@/lib/cookiesClient'; // Importando a função para obter o cookie

interface Orders {
    name: string;
    order_id: string;
    draft: boolean;
    status: boolean;
    created_at: string;
    updated_at: string;
    table: number;
}

const Orders = () => {
    const { isOpen, onRequestOpen } = useContext(OrderContext);

    const [orders, setOrders] = useState<Orders[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [token, setToken] = useState<string | null>('');

    // Obtém o token do cookie no client-side
    useEffect(() => {
        const storedToken = getCookie('token'); // Usando js-cookie para obter o token
        setToken(storedToken);
    }, []);

    console.log(token);

    useEffect(() => {
        if (token) {
            setTimeout(async () => {
                setLoading(true);
                try {
                    const response = await server.get('order', {
                        headers: {
                            Authorization: `Bearer ${removeQuotes(token)}`, // Utilizando o token obtido por cookie
                        },
                    });

                    setOrders(response.data.orders);
                } catch (error) {
                    toast.warning("Erro ao carregar os pedidos");
                    console.error("Erro ao carregar os pedidos:", error);
                } finally {
                    setLoading(false);
                }
            }, 100);
        }
    }, [token]);

    // Função para abrir o modal do pedido
    const handleOpen = useCallback(
        (id: string) => {
            onRequestOpen(id);
        },
        [onRequestOpen]
    );

    return (
        <>
            <div className={styles.container}>
                <section className={styles.containerHeader}>
                    <h1>Últimos Pedidos</h1>
                    <span>
                        <TbRefresh
                            size={24}
                            color='#3fffa3'
                            style={{ cursor: 'pointer' }}
                        />
                    </span>
                </section>

                <section className={styles.listOrders}>
                    {loading ? (
                        <p>Carregando pedidos...</p> // Mostra uma mensagem de carregamento
                    ) : (
                        <>
                            {orders.length > 0 ? (
                                orders.map((item) => (
                                    <button
                                        onClick={() => handleOpen(item.order_id)}
                                        key={item.order_id}
                                        className={styles.orderItem}
                                    >
                                        <div className={styles.tag}></div>
                                        <span>Mesa {item.table}</span>
                                    </button>
                                ))
                            ) : (
                                <div className={styles.messageAlert}>
                                    <h2>Nenhum pedido encontrado.</h2>
                                </div> // Exibe mensagem caso não haja pedidos
                            )}
                        </>
                    )}
                </section>
            </div>

            {isOpen && <Modal />}
        </>
    );
};

export default Orders;
