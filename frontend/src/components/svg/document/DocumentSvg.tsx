import React, { FC } from 'react'

interface DocumentSvgProps {
    color: string;
    width: number;
    height: number;
}
const DocumentSvg:FC<DocumentSvgProps> = ({width,height,color}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.75 7.58341V18.4167C22.75 21.6667 21.125 23.8334 17.3333 23.8334H8.66667C4.875 23.8334 3.25 21.6667 3.25 18.4167V7.58341C3.25 4.33341 4.875 2.16675 8.66667 2.16675H17.3333C21.125 2.16675 22.75 4.33341 22.75 7.58341Z" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.7085 4.875V7.04167C15.7085 8.23333 16.6835 9.20833 17.8752 9.20833H20.0418" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.6665 14.0833H12.9998" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.6665 18.4167H17.3332" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default DocumentSvg
