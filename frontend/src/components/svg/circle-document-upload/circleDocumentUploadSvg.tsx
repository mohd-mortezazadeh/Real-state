import React, { FC } from 'react'

interface CircleDocumentUploadSvgProps{
    color?:string,
    width?:number,
    height?:number
}

const CircleDocumentUploadSvg:FC<CircleDocumentUploadSvgProps> = ({color="white",width=40,height=40}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20C0 31.0457 8.95431 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.95431 0 0 8.9543 0 20ZM38.0471 20C38.0471 29.9671 29.9671 38.0471 20 38.0471C10.0329 38.0471 1.95292 29.9671 1.95292 20C1.95292 10.0329 10.0329 1.95292 20 1.95292C29.9671 1.95292 38.0471 10.0329 38.0471 20Z" fill="white"/>
        <path d="M17.5 19.167V24.167L19.1667 22.5003" stroke={color} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17.4999 24.1667L15.8333 22.5" stroke={color} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M28.3334 18.3337V22.5003C28.3334 26.667 26.6667 28.3337 22.5001 28.3337H17.5001C13.3334 28.3337 11.6667 26.667 11.6667 22.5003V17.5003C11.6667 13.3337 13.3334 11.667 17.5001 11.667H21.6667" stroke={color} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M28.3334 18.3337H25.0001C22.5001 18.3337 21.6667 17.5003 21.6667 15.0003V11.667L28.3334 18.3337Z" stroke={color} stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default CircleDocumentUploadSvg
