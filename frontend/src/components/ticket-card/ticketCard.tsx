import React, { FC } from 'react'
import DateSvg from '../svg/date/DateSvg'
import {textEllipsis} from "../../utils/textEllipsis";

interface TicketCardProps{
    data:any,
    isActive?:boolean,
    handleClick : any
}

const TicketCard:FC<TicketCardProps> = ({data,isActive=false,handleClick}) => {
  return (
    <div className={` box-shadow-1 ${isActive ? 'bg-primary': 'bg-white'} rounded-xl overflow-hidden cursor-pointer`}
    onClick={(e)=>handleClick(data?.id)}
    >
        <div className='flex flex-row justify-between items-center py-5 px-7'>
        <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-text'}`}>{textEllipsis(data?.title , 8)}</span>
        <div className='flex flex-row justify-center items-center gap-x-1'>
            <DateSvg color={`${isActive ? 'white' : '#005adc'}`} width={15} height={15}  />
            <div className='flex flex-row justify-center items-center gap-x-1'>
            <span className={`text-xs ${isActive ? 'text-white' : 'text-text'}`}>تاریخ : </span>
            <span className={`text-xs ${isActive ? 'text-white' : 'text-text'} font-semibold`}>{new Date(+data?.created_at).toLocaleDateString('fa')}</span>
            </div>
        </div>
        </div>
        <div className={`${isActive ? 'bg-primary-100/10' : 'bg-primary/10'} py-4 px-7 `}>
            <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-text'}`}>{data?.description}</span>
        </div>
    </div>
  )
}

export default TicketCard
