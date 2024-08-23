import React, {FC} from 'react'
import BasketSvg from '../svg/basket/basketSvg'
import CorrectMark from '../svg/correct-mark/CorrectMark'
import {useRouter} from "next/router";
import {createOrder} from "../../services/api/packages";

interface PackageRowProps {
    rowOpen?: boolean,
    data: any
}

const PackageRow: FC<PackageRowProps> = ({rowOpen = true, data}) => {
    const router = useRouter()

    //TODO
    // order not work until paymant dargah is active
    const sendOrder =async (id: any) => {
        createOrder({package: id})
            .then(res=>{
                router.push(res?.zp?.url)
            })
    }

    return (
        <div
            className={`bg-white py-4  md:px-7 first:mt-5 flex md:flex-row flex-col ${rowOpen && 'box-shadow-1 '} rounded-xl justify-between items-center   gap-y-5 cursor-pointer gap-x-5 w-full`}>
            <div
                className={`xl:basis-3/12  md:text-text text-primary md:text-right text-center   text-lg font-bold truncate w-full`}>
                {data?.name}
            </div>

            <div
                className='flex md:flex-row flex-col justify-between items-center lg:gap-x-32 gap-x-8 md:bg-transparent bg-primary/10 w-full md:w-auto md:py-0 py-5 gap-y-5 '>
                <div className='flex flex-row justify-center items-center gap-x-4 '>
                <span className='mb-1'>
                    <CorrectMark width={21} height={18}/>
                </span>
                    <div className='flex flex-row justify-center items-center gap-x-1'>
                        <span className='text-xl font-bold text-primary'>{data?.ad_count}</span>
                        <span className='text-lg font-medium'>آگهی</span>
                    </div>
                </div>
                <div className='flex flex-row justify-center items-center gap-x-4 '>
                <span className='mb-1'>
                    <CorrectMark width={21} height={18}/>
                </span>
                    <div className='flex flex-row justify-center items-center gap-x-1'>
                        <span className='text-xl font-bold text-primary'>{data?.nardeban_count}</span>
                        <span className='text-lg font-medium'>نردبان</span>
                    </div>
                </div>
            </div>
            <div
                className='flex md:flex-row flex-col justify-between items-center lg:gap-x-24 gap-x-8 gap-y-4 md:py-0 py-4 w-full '>
                <div className='flex flex-row justify-center items-center gap-x-4 w-full'>
                <span className='mb-1 text-lg'>
                    قیمت
                </span>
                    <div className='flex flex-row justify-center items-center gap-x-1'>
                        <span className='md:text-2xl text-xl font-bold text-primary'>{data?.price}</span>
                        <span className='text-xl text-primary'>تومان</span>
                    </div>
                </div>
                <div className='xl:w-[250px] w-full xl:px-0 md:px-2 px-5'>
                    <button
                        //TODO
                        disabled={true}
                        onClick={() => sendOrder(data?.id)}
                            className='bg-primary disabled:bg-custom-gray-200 w-full py-2 rounded-lg flex flex-row justify-center items-center gap-x-3 xl:px-0 px-5'>
                    <span>
                        <BasketSvg color='white' width={23} height={23}/>
                    </span>
                        <span className='font-bold text-white'>
                        خرید
                    </span>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default PackageRow
