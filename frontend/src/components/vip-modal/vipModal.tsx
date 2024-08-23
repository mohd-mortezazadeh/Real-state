import React,{FC} from 'react'

interface VipModalProps {
    setVipModal?: any,
    vipModal?: any,
    handleNotifToMe?:any

}

const VipModal:FC<VipModalProps> = ({vipModal,setVipModal,handleNotifToMe}) => {
    return (
        <div
            className='bg-white p-5  z-50 xl:w-1/5 lg:w-2/5 md:w-3/5 w-full box-shadow-1 sm:rounded-lg overflow-y-auto transition-all duration-300'>
            <div className={`flex flex-col items-center justify-between gap-y-10 h-full`}>
                <div className={`mt-5 text-center space-y-3`}>
                    <span className='text-lg font-semibold '>
                        خبرم کن
                    </span>

                    <p className='text-center'>
                        در صورت خالی بودن بخش vip آگهی ها با فرستادن یک پیامک به شما اطلاع رسانی خواهیم کرد.
                    </p>
                </div>

                <div className={`flex flex-row justify-center items-center gap-x-5 w-full`}>

                    <button className={`flex px-8 py-2  rounded-md bg-custom-red text-white`}
                            onClick={handleNotifToMe}
                    >تایید
                    </button>
                    <button className={`flex px-8 py-2  rounded-md bg-custom-gray-200/10 text-custom-gray-200`}
                            onClick={() => setVipModal(false)}
                    >بازگشت
                    </button>

                </div>
            </div>
        </div>
    )
}

export default VipModal
