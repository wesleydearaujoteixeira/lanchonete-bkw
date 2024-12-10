'use client';

import { useState, FormEvent, useEffect, useContext } from 'react';
import styles from './order.module.scss';
import { getCookie } from "@/lib/cookiesClient";
import { server } from '@/services/globalApi';
import Button from '../components/button/Button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { IoAdd } from "react-icons/io5";
import { IoIosRemove } from "react-icons/io";
import { OrderContext } from '@/app/providers/order';


import { useRouter } from 'next/navigation';




// Definindo o esquema de validação com zod
const schema = z.object({
  productID: z.string().min(1, { message: 'Selecione um produto' }),
});

type FormData = z.infer<typeof schema>;

const Order = () => {



  type ProductType = {
    product_id: string;
    name: string;
    price: string;
    description: string;
    banner: string; // A URL da imagem
  };


  const router = useRouter();


  const [token, setToken] = useState<string | null>(null); // State para armazenar o token

    useEffect(() => {
      // Garante que o token seja obtido apenas no client-side
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }, []);


  const [products, setProducts] = useState<ProductType[]>([]);
  const [productID, setProductID] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1); // Variável para quantidade do produto


  const { table_order } = useContext(OrderContext);




  // Carregar produtos
  const loadProducts = async () => {
    try {
      const response = await server.get('products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setProducts(response.data.products);
      console.log(table_order)

    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Usando react-hook-form com zodResolver para validação
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleOrderSubmit = async (data: FormData) => {
    try {
      const response = await server.post('add_item', {
        order_id: table_order, // Coloque o ID da ordem aqui
        product_id: data.productID, 
        amount: quantity, // Enviando a quantidade selecionada
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Produto adicionado com sucesso!");
      router.push('/dashboard');

      

    } catch (error) {
      toast.warning("Erro ao adicionar produto!");
      console.error('Erro ao adicionar o produto:', error);
    }
  };

  // Atualizar o produto selecionado e sua imagem
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProduct = products.find(product => product.product_id === e.target.value);
    setProductID(e.target.value);
    setSelectedProduct(selectedProduct || null);
  };

  // Atualizar a quantidade
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value, 10)); // Garantir que a quantidade não seja menor que 1
    setQuantity(value);
  };


  const handleRemove = () => {

    if(quantity <= 0) {
      toast.warning("Não é possível remover um item com quantidade negativa!");
      return;
    }
    return setQuantity(quantity - 1);

  }

  return (
    <main className={styles.container}>
      <h1> Selecione um produto </h1>

      <form className={styles.form} onSubmit={handleSubmit(handleOrderSubmit)}>
        
        {/* Select de produtos */}
        <select
          {...register('productID')}
          value={productID}
          onChange={handleProductChange}
          className={styles.select}
        >
          <option value="">Selecione um Produto</option>
          {products.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.name}
            </option>
          ))}
        </select>

        {errors.productID && <span className={styles.error}>{errors.productID.message}</span>}

        {/* Exibir imagem do produto selecionado */}
        {selectedProduct && (
          <div className={styles.productImage}>
            <h3>{selectedProduct.name}</h3>
            <Image
              src={selectedProduct.banner}
              alt={selectedProduct.name}
              className={styles.productImage}
              width={300}
              height={200}
            />
          </div>
        )}

        {/* Input para quantidade */}
        {selectedProduct && (
          <div className={styles.quantityContainer}>
            <label htmlFor="quantity"> Quantidade:  {quantity}  </label>
            
            <span className={styles.qtdBtn} >

              <IoAdd size={20} className={styles.addButton} onClick={() => setQuantity(quantity + 1)} />
              <IoIosRemove size={20} className={styles.removeBtn} onClick={() => handleRemove()} />

            </span>



          </div>
        )}

          <Button text="Enviar Pedido" />
      </form>

    </main>
  );
};

export default Order;
