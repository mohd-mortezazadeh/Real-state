import React from 'react';
import CorrectMark from "../svg/correct-mark/CorrectMark";
import BasketSvg from "../svg/basket/basketSvg";
import {numberWithCommas} from "../../utils/numberWithCommas";
import SearchIcon from "../svg/search/searchSvg";
import CustomSelect from "../select/CustomSelect";

const OrderRow = ({data}: any) => {
    return (
        <>

            <div
                className={`bg-white py-4  md:px-7 first:mt-5 flex md:flex-row flex-col box-shadow-1 rounded-xl justify-between items-center   gap-y-5 gap-x-5 w-full`}>
                <div
                    className={`xl:basis-4/12  md:text-text text-primary md:text-right text-center text-lg font-bold truncate w-full`}>
                    {data?.show_package?.name}
                </div>

                {/*<div*/}
                {/*    className='flex md:flex-row flex-col justify-between items-center lg:gap-x-32 gap-x-8 md:bg-transparent bg-primary/10 w-full md:w-auto md:py-0 py-5 gap-y-5 '>*/}
                {/*    /!*<div className='flex flex-row justify-center items-center gap-x-4 '>*!/*/}
                {/*    /!*    <span className='mb-1'>*!/*/}
                {/*    /!*       <CorrectMark width={21} height={18}/>*!/*/}
                {/*    /!*    </span>*!/*/}
                {/*    /!*    <div className='flex flex-row justify-center items-center gap-x-1'>*!/*/}
                {/*    /!*        <span className='text-xl font-bold text-primary'>{data?.ad_count}</span>*!/*/}
                {/*    /!*        <span className='text-lg font-medium'>آگهی</span>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*    /!*<div className='flex flex-row justify-center items-center gap-x-4 '>*!/*/}
                {/*    /!*    <span className='mb-1'>*!/*/}
                {/*    /!*       <CorrectMark width={21} height={18}/>*!/*/}
                {/*    /!*    </span>*!/*/}
                {/*    /!*    <div className='flex flex-row justify-center items-center gap-x-1'>*!/*/}
                {/*    /!*        <span className='text-xl font-bold text-primary'>{data?.nardeban_count}</span>*!/*/}
                {/*    /!*        <span className='text-lg font-medium'>نردبان</span>*!/*/}
                {/*    /!*    </div>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</div>*/}
                <div
                    className='flex xl:basis-8/12 md:flex-row flex-col justify-between items-center lg:gap-x-24 gap-x-8 gap-y-4 md:py-0 py-4 w-full '>
                    <div className='flex flex-row justify-center items-center gap-x-4 w-full'>
                <span className='mb-1 text-lg'>
                    قیمت
                </span>
                        <div className='flex flex-row justify-center items-center gap-x-1'>
                            <span
                                className='md:text-2xl text-xl font-bold text-primary'>{numberWithCommas(data?.amount)}</span>
                            <span className='text-xl text-primary'>تومان</span>
                        </div>
                    </div>
                    <div className=' w-full xl:px-0 md:px-2 px-5 text-end text-sm'>

                        {
                            data?.status === 0 ?
                                <span className='text-custom-gold'>در انتظار پرداخت</span>
                                :
                                data?.status === -1 ?
                                    <span className='text-custom-red'>لغو شده</span>
                                    :
                                    data.status === 1 &&
                                    <span className='text-custom-green'>پرداخت شده</span>
                        }
                    </div>
                </div>

            </div>
        </>
    );
};

export default OrderRow;