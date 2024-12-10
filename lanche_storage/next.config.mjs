/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['res.cloudinary.com'], // Adicione os domínios permitidos
    },
  };
  
  export default nextConfig;
  