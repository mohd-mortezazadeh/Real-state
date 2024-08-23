import React,{FC} from 'react'

interface CategoriesSvgProps{
    width:string,
    height:string,
    color:string
}

const CategoriesSvg:FC<CategoriesSvgProps> = ({width,height,color}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.625 11.25H7.875C10.125 11.25 11.25 10.125 11.25 7.875V5.625C11.25 3.375 10.125 2.25 7.875 2.25H5.625C3.375 2.25 2.25 3.375 2.25 5.625V7.875C2.25 10.125 3.375 11.25 5.625 11.25Z" stroke={color} stroke-width="1.6875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.125 11.25H21.375C23.625 11.25 24.75 10.125 24.75 7.875V5.625C24.75 3.375 23.625 2.25 21.375 2.25H19.125C16.875 2.25 15.75 3.375 15.75 5.625V7.875C15.75 10.125 16.875 11.25 19.125 11.25Z" stroke={color} stroke-width="1.6875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.125 24.75H21.375C23.625 24.75 24.75 23.625 24.75 21.375V19.125C24.75 16.875 23.625 15.75 21.375 15.75H19.125C16.875 15.75 15.75 16.875 15.75 19.125V21.375C15.75 23.625 16.875 24.75 19.125 24.75Z" stroke={color} stroke-width="1.6875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.625 24.75H7.875C10.125 24.75 11.25 23.625 11.25 21.375V19.125C11.25 16.875 10.125 15.75 7.875 15.75H5.625C3.375 15.75 2.25 16.875 2.25 19.125V21.375C2.25 23.625 3.375 24.75 5.625 24.75Z" stroke={color} stroke-width="1.6875" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>  

  )
}

export default CategoriesSvg
