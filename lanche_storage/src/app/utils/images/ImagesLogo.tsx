import Image from "next/image"
import logoImg from '../../../../public/mega-removebg.png';


interface ImagesLogo {
    height: number;
    width: number;
}


export const ImagesLogo = ({height, width}:ImagesLogo) => {
    return (
        <div>
        <Image
          src={logoImg}
          height={height}
          width={width}
          priority
          alt="Logo da pizzaria"
          quality={100}
        />
        </div>
    )
} 