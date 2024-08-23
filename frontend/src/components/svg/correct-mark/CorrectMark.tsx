import React, { FC } from 'react'

interface CorrectMarkProps{
    color?:string,
    width?:string | number,
    height?:string | number
}

const CorrectMark:FC<CorrectMarkProps> = ({color="#0D9E2D",width="28",height="23"}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M3.31641 11.7102L10.679 20.0029L25.4303 3.41748" stroke={color} stroke-width="4.83742" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default CorrectMark
