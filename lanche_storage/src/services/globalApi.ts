import axios from 'axios';

export const server = axios.create({
   baseURL: 'https://pizza-system-mocha.vercel.app/system/' 
});