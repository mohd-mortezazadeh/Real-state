import React, {FC} from "react";
import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import {useRouter} from "next/router";

interface EstateCardProps {
    data: any,
    status?: boolean,
    ref?: React.Ref<any>,
    setOpenModal?: any,
    setAdvisorId: any
}

const EstateCard: FC<EstateCardProps> = React.forwardRef(({data, status, setOpenModal = false, setAdvisorId}, ref) => {

        const router = useRouter()
        const postBody = data && (
            <div
                onClick={()=>{
                    if(data?.ads_count){
                        router.push(`/consultant/${data?.id}`)
                    }
                }}
                className='grid grid-cols-12 rounded-lg box-shadow-1 overflow-hidden bg-white p-4 cursor-pointer'>
                <div
                    className="col-span-12 flex md:flex-col gap-y-5 flex-row items-center md:justify-center justify-start ">
                    <div className='w-24 h-full flex flex-col justify-start items-start '>
                        <img className='h-24 w-full rounded-full object-cover' src={`${data?.avatar?.file}`} alt=""/>
                    </div>

                    {/* card info */}
                    <div
                        className='flex flex-col md:items-center items-start md:pr-0 pr-4 justify-center gap-y-4  mb-6 md:pt-0'>
                        <h3 className='text-xl font-semibold'>{data?.fullname}</h3>

                        {
                            !!status  && <p className="font-semibold ">
                                <span>{data?.ads_count}</span>
                                <span> پست</span>
                            </p>
                        }
                        {/*<span>{data?.post_count} پست</span>*/}
                        {(!status && data?.phone) &&
                            <span className="font-semibold text-primary">{data?.phone}</span>}
                    </div>
                </div>
                {
                    !status &&
                    <div className="col-span-12 flex flex-row justify-center items-center gap-x-5 ">
                        <button
                            onClick={() => {
                                setOpenModal({value: true, type: 1})

                                setAdvisorId(data?.id)
                            }
                            }
                            className="px-5 py-3 rounded-md text-custom-green font-semibold bg-custom-green/20 basis-1/2">تایید
                        </button>
                        <button
                            onClick={() => {
                                setOpenModal({value: true, type: 0})
                                setAdvisorId(data?.id)
                            }
                            }
                            className="px-5 py-3 rounded-md text-custom-red font-semibold bg-custom-red/20 basis-1/2">رد
                        </button>
                    </div>
                }

            </div>
        )

        const content = ref
            ? <article ref={ref}>
                {postBody}
            </article>
            :
            <article>
                {postBody}
            </article>

        return content
    }
)

EstateCard.displayName = 'EstateCard'

export default EstateCard;