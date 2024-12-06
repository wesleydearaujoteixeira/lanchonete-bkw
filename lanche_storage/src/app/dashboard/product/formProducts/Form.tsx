'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './form.module.scss';
import { MdOutlineFileUpload } from "react-icons/md";
import { getCookie } from "@/lib/cookiesClient";
import { server } from '@/services/globalApi';
import Image from 'next/image';


const Form = () => {

  const id =  getCookie("user_id");

  const [image, setImage] = useState<File | null>(null);


  const [previewImage, setPreviewImage] = useState("");



  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryID, setCategoryID] = useState<string>('');



  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const image = e.target.files[0];


      if(image) {

        if(image.type !== "image/png" && image.type !== "image/jpeg" && image.type !== "image/jpg") {
            console.log("formato não permitido!!! ");
            return;
        }

        setImage(image);
        setPreviewImage(URL.createObjectURL(image));


    }



  }

}

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    
    setCategoryID(String(id));

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    if (image) formData.append('banner', image);
    formData.append('category_id', categoryID);
    

    try {
        const response = await server.post('/products', formData, {
            headers: {
              Authorization: `Bearer ${getCookie("session")}`,
            },
      
        });

        console.log(response.data);

    } catch (error) {
        
        console.error('Erro ao cadastrar o produto:', error);
    }


  };

  return (
    <main className={styles.container}>
      
      <h1> Novo Produto </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* File Upload */}

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
            <Image
                src={previewImage}
                height={200}
                width={400}
                alt="Imagem do produto"
                className={styles.previewImage}
                quality={100}

            />
        )}


        </label>


        {/* Name */}
        <input
          type="text"
          id="name"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Price */}
        <input
          type="text"
          id="price"
          placeholder="Preço do Produto"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          
          required
        />

        {/* Description */}

        <textarea
          id="description"
          placeholder="Descrição do Produto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.desc}
          required
        />

        {/* Category */}
        <input
          type="text"
          id="categoryID"
          placeholder="ID da Categoria"
          value={categoryID}
          onChange={(e) => setCategoryID(e.target.value)}
          required
        />

        {/* Submit Button */}
        <button type="submit">Criar Produto</button>
      </form>
    </main>
  );
};

export default Form;
