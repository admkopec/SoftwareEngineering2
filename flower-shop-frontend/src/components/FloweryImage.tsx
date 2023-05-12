import Image from 'mui-image';
import React from 'react';

interface FloweryImageProps {
  src: string;
  width: string;
  height: string;
}

// NOTE: This is a prototype of an image wrapper that would be used in an image magnifying component
export default function FloweryImage(props: FloweryImageProps) {
  return <Image src={props.src} width={props.width} height={props.height} duration={2000} style={{ objectFit: 'contain' }} />;
}
