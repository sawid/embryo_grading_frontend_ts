import React from 'react';
import { Image } from 'react-bootstrap';

interface CroppedImageProps {
  src: string;
  width: number;
  height: number;
}

const CroppedImage: React.FC<CroppedImageProps> = ({ src, width, height }) => {
  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    objectFit: 'cover',
    objectPosition: 'center',
  };

  return <Image src={src} style={style} rounded />;
};

export default CroppedImage;
