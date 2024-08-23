import React, { FC } from 'react'

interface TicketSvgProps{
    color?:string,
    width?:number,
    height?:number
}

const TicketSvg:FC<TicketSvgProps> = ({color="white",width=20,height=20}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.2513 10.4166C16.2513 9.26665 17.1846 8.33331 18.3346 8.33331V7.49998C18.3346 4.16665 17.5013 3.33331 14.168 3.33331H5.83464C2.5013 3.33331 1.66797 4.16665 1.66797 7.49998V7.91665C2.81797 7.91665 3.7513 8.84998 3.7513 9.99998C3.7513 11.15 2.81797 12.0833 1.66797 12.0833V12.5C1.66797 15.8333 2.5013 16.6666 5.83464 16.6666H14.168C17.5013 16.6666 18.3346 15.8333 18.3346 12.5C17.1846 12.5 16.2513 11.5666 16.2513 10.4166Z" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.33203 3.33331L8.33203 16.6666" stroke={color} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 5"/>
    </svg>

  )
}

export default TicketSvg
