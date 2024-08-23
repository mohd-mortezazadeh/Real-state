import React,{FC} from 'react'

interface PlusSvgProps{
    color: string;
    width: number;
    height: number;
}

const PlusSvg:FC<PlusSvgProps> = ({width,height,color}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.16162 4.5H8.16162" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.8374 8V1" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default PlusSvg
