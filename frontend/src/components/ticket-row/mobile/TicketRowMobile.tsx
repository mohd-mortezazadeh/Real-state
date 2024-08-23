import React, { FC } from 'react'
import DateSvg from '../../svg/date/DateSvg'

interface TicketRowMobileProps{
    data:any
}


const TicketRowMobile:FC<TicketRowMobileProps> = ({data}) => {
  return (
    <div className="bg-white rounded-t-md rounded-b-xl overflow-y-hidden box-shadow-1 first:mt-5 ">
       <div className='grid grid-cols-12 py-4 pr-5 gap-x-6'>
        <div className='col-span-6 flex flex-col justify-center items-start gap-y-5'>
                <div className='flex flex-col items-start justify-center gap-y-1'>
                    <span className='text-sm text-primary font-medium'>موضوع</span>
                    <span className='font-bold text-lg truncate '>{data?.subject}</span>
                </div>
                <div className='flex flex-col items-start justify-center gap-y-1'>
                    <span className='text-sm text-primary font-medium'>عنوان</span>
                    <span className='truncate w-[110px] '>{data?.title}</span>
                </div>
            </div>
            <div className='col-span-6 flex flex-col justify-center items-start gap-y-5'>
                <div className='flex flex-col items-start justify-center gap-y-1'>
                    <span className='text-sm text-primary font-medium'>اولویت</span>
                    <span className='truncate '>{data?.priority}</span>
                </div>
                <div className='flex flex-col items-start justify-center gap-y-1'>
                    <span className='text-sm text-primary font-medium'>توضیحات</span>
                    <span className='truncate w-[110px]'>{data?.description}</span>
                </div>
            </div>
       </div>
       <div className='flex flex-row justify-center items-center gap-x-2 py-4 bg-primary/20'>
            <DateSvg color='#005adc' />
            <span className='text-sm font-semibold'>{data?.date}</span>
       </div>
    </div>
  )
}

export default TicketRowMobile
