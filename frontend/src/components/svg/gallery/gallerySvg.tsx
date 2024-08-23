import React, { FC } from 'react'

interface GallerySvgProps{
    color?:string,
    width?:number,
    height?:number
}

const GallerySvg:FC<GallerySvgProps> = ({color="#005adc",width=22,height=22}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.24992 20.1663H13.7499C18.3333 20.1663 20.1666 18.333 20.1666 13.7497V8.24967C20.1666 3.66634 18.3333 1.83301 13.7499 1.83301H8.24992C3.66659 1.83301 1.83325 3.66634 1.83325 8.24967V13.7497C1.83325 18.333 3.66659 20.1663 8.24992 20.1663Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.25008 9.16667C9.2626 9.16667 10.0834 8.34586 10.0834 7.33333C10.0834 6.32081 9.2626 5.5 8.25008 5.5C7.23756 5.5 6.41675 6.32081 6.41675 7.33333C6.41675 8.34586 7.23756 9.16667 8.25008 9.16667Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.44751 17.3712L6.96668 14.337C7.69084 13.8512 8.73584 13.9062 9.38668 14.4653L9.68918 14.7312C10.4042 15.3453 11.5592 15.3453 12.2742 14.7312L16.0875 11.4587C16.8025 10.8445 17.9575 10.8445 18.6725 11.4587L20.1667 12.742" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
  )
}

export default GallerySvg
