'use client';

import { createContext, ReactNode, useState } from "react";


type OrderContextData = {
    isOpen: boolean,
    onRequestOpen: (order_id: string) => void,
    onRequestClose: () => void,
    order_id: string,

}

type ChildrenType = {
    children: ReactNode,
 
}


export const OrderContext = createContext({} as OrderContextData);

export const ProviderContext = ({children}: ChildrenType ) => {

    const [isOpen, setOpen] = useState (false);
    const [order_id, setOrderId] = useState("");

    const onRequestOpen = (order_id: string) => {
        setOrderId(order_id);
        setOpen(true);
    }

    const onRequestClose = () => {
        setOpen(false);
    }

    return (
        <OrderContext.Provider value={{isOpen, onRequestClose, onRequestOpen, order_id}}>
            {children}
        </OrderContext.Provider>
    )
} 