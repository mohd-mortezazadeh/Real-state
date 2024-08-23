import {FC} from "react";
import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import Link from "next/link";

const ConsultantCard: FC<any> = ({data, isRealState = false}) => {
    return (
        <div className='flex flex-col items-center justify-center rounded-lg box-shadow-1 overflow-hidden'>
            {/*   card image */}
            <div className='w-24 h-24 my-6 rounded-full overflow-hidden'>
                <img className='h-full w-full ' src={data?.avatar?.file} alt=""/>
            </div>

            {/* card info */}
            <div className='flex flex-col w-full gap-y-2 text-center mb-6'>

                {
                    isRealState ?
                        <>
                            <h3 className='text-xl font-semibold break-words'>
                                {
                                    data?.company_name ?
                                        <span>دفتر {data?.company_name} </span>
                                        :
                                        <span>مشاور آزاد</span>

                                }
                            </h3>


                            <span>{data?.fullname}</span>
                        </>
                        :
                        <>
                            <h3 className='text-xl font-semibold break-words'>{data?.fullname}</h3>

                            {
                                data?.company_name ?
                                    <span>دفتر {data?.company_name} </span>
                                    :
                                    <span>مشاور آزاد</span>
                            }
                        </>
                }


            </div>

            <Link href={`/consultant/${data?.id}`} className='flex p-6 bg-primary-100/10 w-full justify-center'>
                <span>نمایش پروفایل</span>
                <ArrowLeftSvg height={24} width={24} color={'#0050ac'}/>
            </Link>

        </div>
    );
};

export default ConsultantCard;