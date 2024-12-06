'use client';

import btn from './button.module.scss';
import { useFormStatus } from 'react-dom';

interface ButtonType {
    text: string;
}

const Button = ({text}: ButtonType) => {


    const { pending } = useFormStatus();

  return (
    <button  className={btn.btn}  type="submit">
        {pending && "Carregando..."}
        {!pending && text}    
     </button>

  )
}

export default Button