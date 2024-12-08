'use client';

import { createContext, ReactNode, useState } from "react";


type OrderContextData = {
    isOpen: boolean,
    onRequestOpen: (order_id: string) => void,
    onRequestClose: () => void,
    order_id: string,
    table_order: string;
    isTableOpen: (table_id: string) => void

}

type ChildrenType = {
    children: ReactNode,
 
}


export const OrderContext = createContext({} as OrderContextData);

export const ProviderContext = ({children}: ChildrenType ) => {

    const [isOpen, setOpen] = useState (false);
    const [order_id, setOrderId] = useState("");

    const [table_order, setTableOrder] = useState("");



    const isTableOpen = (table_id: string) => {
        setTableOrder(table_id);
    }


    const onRequestOpen = (order_id: string) => {
        setOrderId(order_id);
        setOpen(true);
    }

    const onRequestClose = () => {
        setOpen(false);
    }

    return (
        <OrderContext.Provider value={{isOpen, onRequestClose, onRequestOpen, order_id, table_order, isTableOpen}}>
            {children}
        </OrderContext.Provider>
    )
} 