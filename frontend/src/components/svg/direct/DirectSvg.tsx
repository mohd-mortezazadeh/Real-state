import React, { FC } from 'react'

interface DirectSvgProps{
    width?:number,
    height?:number,
    color?:string
}

const DirectSvg:FC<DirectSvgProps> = ({width=55,height=55,color="#99BDF1"}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.625 50.4163H34.375C45.8334 50.4163 50.4167 45.833 50.4167 34.3747V20.6247C50.4167 9.16634 45.8334 4.58301 34.375 4.58301H20.625C9.16671 4.58301 4.58337 9.16634 4.58337 20.6247V34.3747C4.58337 45.833 9.16671 50.4163 20.625 50.4163Z" stroke={color} stroke-width="3.4375" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.58337 29.7924H13.2C14.9417 29.7924 16.523 30.7779 17.3021 32.3362L19.3417 36.4383C20.625 38.9591 22.9167 38.9591 23.4667 38.9591H31.5563C33.298 38.9591 34.8792 37.9737 35.6584 36.4154L37.698 32.3133C38.4771 30.7549 40.0584 29.7695 41.8 29.7695H50.3709" stroke={color} stroke-width="3.4375" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.6958 16.042H31.3271" stroke={color} stroke-width="3.4375" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21.7709 22.917H33.2292" stroke={color} stroke-width="3.4375" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default DirectSvg
