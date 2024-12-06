
import styles from './orders.module.scss'
import { TbRefresh } from "react-icons/tb";

const Orders = () => {
  return (
    <div className={styles.container}>
        
        <section className={styles.containerHeader} >
            <h1> Últimos Pedidos </h1>
            <span>
                <TbRefresh size={24} color='#3fffa3' />
            </span>
        </section>

        <section className={styles.listOrders} >
            <button
                className={styles.orderItem}
            >
                <div className={styles.tag}>  </div>
                <span> Mesa 10 </span>
            </button>


            <button
                className={styles.orderItem}
            >
                <div className={styles.tag}>  </div>
                <span> Mesa 9 </span>
            </button>
        </section>
    </div>
  )
}

export default Orders