import { useRouter } from 'next/router'
import React, { FC} from 'react'
import DirectSvg from '../svg/direct/DirectSvg'

interface EmptyDataProps{
    title?:any, 
    hasButton?:boolean
    buttonTitle?:string,
    Icon?:any,
    href?:string

}

const EmptyData:FC<EmptyDataProps> = ({Icon=<DirectSvg />,title="هیچ پستی برای نمایش وجود ندارد",hasButton=false,buttonTitle="ثبت اولین آگهی",href="/add-property"}) => {
  
    const router = useRouter()
    
  return (
    <div className='flex flex-col justify-start items-center gap-y-7 '>
        <Icon />
        {title}
        {hasButton && <button type='button' onClick={()=>router.push(href)} className=' bg-primary/80 rounded-md text-white px-5 py-3'>{buttonTitle}</button>}
    </div>
  )
}

export default EmptyData
