'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './form.module.scss';
import { MdOutlineFileUpload } from "react-icons/md";
import { getCookie } from "@/lib/cookiesClient";
import { server } from '@/services/globalApi';
import Image from 'next/image';
import Button from '../../components/button/Button';
import { toast } from 'sonner';

type CategoryType = {
  category_id: string;
  created_at: string;
  name: string;
  updated_at: string;
}


const Form = () => {

 
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryID, setCategoryID] = useState<string>('');
  const [categories, setCategories] = useState <CategoryType[]> ([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);


  const [token, setToken] = useState<string | null>(null); // State para armazenar o token

  useEffect(() => {
    // Garante que o token seja obtido apenas no client-side
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);


  // Carregar categorias
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await server.get('category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.category);

      console.log(response.data);

    } catch (error) {
      console.error('Erro ao carregar as categorias:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();

  }, []);

  // Manipular upload de arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const image = e.target.files[0];

      if (image && !["image/png", "image/jpeg", "image/jpg"].includes(image.type)) {
        toast("Formato não permitido!");
        return;
      }

      setImage(image);
      setPreviewImage(URL.createObjectURL(image));
    }
  };

  // Resetar formulário
  

  // Submeter formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (image) formData.append('banner', image);
    formData.append('category_id', categoryID);

    try {
      const response = await server.post('products', formData, {
        headers: {
          Authorization: `Bearer ${getCookie("session")}`,
        },
      });


      toast.success("Produto Cadastrado com sucesso!")
      console.log(response.data);
    
    
    } catch (error) {
      toast.warning("Erro ao cadastrar produto!")
      console.error('Erro ao cadastrar o produto:', error);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Novo Produto</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Upload de imagem */}
        <label htmlFor="banner" className={styles.labelImage}>
          <span>
            <MdOutlineFileUpload size={24} color="#fff" />
          </span>
          <input
            type="file"
            id="banner"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
          {previewImage && (
            <div className={styles.previewContainer}>
              <Image
                src={previewImage}
                height={200}
                width={400}
                alt="Imagem do produto"
                className={styles.previewImage}
                quality={100}
              />
            
            </div>
          )}
        </label>

        {/* Nome do produto */}
        <input
          type="text"
          id="name"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputText}

          required
        />

        {/* Preço */}
        <input
          type="number"
          id="price"
          placeholder="Preço do Produto"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className={styles.inputText}
          step="0.01"
        />

        {/* Categorias */}
          <select
              value={categoryID}
              onChange={(e) => setCategoryID(e.target.value)}
              required 
              className={styles.select}
            >
              <option value="">Selecione uma Categoria</option>
              {loadingCategories ? (
                <option disabled>Carregando categorias...</option>
              ) : (
                categories.length  > 0 ? (
                  categories.map((categorie) => (
                    <option key={categorie.category_id} value={categorie.category_id}>
                      {categorie.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhuma categoria encontrada</option>
                )
              )}
        </select>


        {/* Descrição */}
        <textarea
          id="description"
          placeholder="Descrição do Produto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.desc}
          required
        />

        {/* Botão de submit */}
       
        <Button text="Cadastrar Produto"/>

      </form>
    </main>
  );
};

export default Form;
