'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './form.module.scss';
import { MdOutlineFileUpload } from "react-icons/md";
import { server } from '@/services/globalApi';
import Image from 'next/image';
import Button from '../../components/button/Button';
import { toast } from 'sonner';
import Cookies from 'js-cookie'; // Importa js-cookie

type CategoryType = {
  category_id: string;
  created_at: string;
  name: string;
  updated_at: string;
};

const Form = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryID, setCategoryID] = useState<string>('');
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Obtém o token diretamente do cookie
  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      const fetchCategories = async () => {
        try {
          const response = await server.get('category', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategories(response.data.category);
        } catch (error) {
          console.error('Erro ao carregar as categorias:', error);
        }
      };

      fetchCategories();
    } else {
      console.log('Token não encontrado');
    }
  }, [token]);

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
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Produto Cadastrado com sucesso!");
      console.log(response.data);
    } catch (error) {
      toast.warning("Erro ao cadastrar produto!");
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
          {categories.length > 0 &&
            categories.map((categorie) => (
              <option key={categorie.category_id} value={categorie.category_id}>
                {categorie.name}
              </option>
            ))}
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
        <Button text="Cadastrar Produto" />
      </form>
    </main>
  );
};

export default Form;
