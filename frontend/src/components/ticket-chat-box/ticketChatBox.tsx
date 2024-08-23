import React, {useEffect, useMemo, useRef, useState} from 'react'
import DateSvg from '../svg/date/DateSvg'
import GallerySvg from '../svg/gallery/gallerySvg'
import SendMessage from '../svg/send-message/sendMessage'
import {FC} from 'react'
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {create_chat_ticket, create_ticket, get_ticket, ticketBox} from "../../redux/slices/ticketSlice";
import PlusSvg from "../svg/plus/PlusSvg";
import {BiDownload, BiMinus} from "react-icons/bi";
import {postThumbnail} from "../../services/api/property";
import toast from "react-hot-toast";

interface TicketChatBoxProps {
    ticketId: any,
    adminBox?: boolean
}


const TicketChatBox: FC<TicketChatBoxProps> = ({ticketId, adminBox}) => {

    const [description, setDescription] = useState('')
    const [descriptionError, setDescriptionError] = useState('')

    const [progress, setProgress] = useState(0)
    const [endUpload, setEndUpload] = useState(false)


    const [imgFiles, setImgFiles] = useState<any>([])
    const [imgIds, setImgIds] = useState<number[]>([])
    const [ticketBoxFiles, setTicketBoxFiles] = useState<any>([])

    const [errorTicketBoxes, setErrorTicketBoxes] = useState('')

    const options = {
        onUploadProgress: (progressEvent: ProgressEvent) => {
            const {loaded, total} = progressEvent;
            let precentage = Math.floor((loaded * 100) / total);

            if (precentage <= 100) {
                setProgress(precentage)
            }
        },
        headers: {
            "Content-Type": "multipart/form-data"
        },
    };

    const addTicketBoxFile = () => {
        if (ticketBoxFiles?.length < 1) {
            setTicketBoxFiles([{id: Math.random()}])
            setErrorTicketBoxes('')
        }
    }

    const addTicketBoxFiles = () => {
        ticketBoxFiles.length < 5 ?
            setTicketBoxFiles((prev: any) => [...prev, {id: Math.random()}])

            : setErrorTicketBoxes('مجاز به ارسال حداکثر 5 فایل میباشید')
    }

    const deleteTicketBoxFile = (id: number, index: number) => {
        setTicketBoxFiles((prev: any) => prev.filter((item: any) => item.id !== id))
        setErrorTicketBoxes('')
        setImgFiles((prev: any) => prev.filter((img: any) => img.id !== id))

        imgIds.splice(index, 1)
        setImgIds(imgIds)
    }


    const bottomRef = useRef<any>()

    const ticketBoxState = useAppSelector(ticketBox)
    const dispatch = useAppDispatch()

    useMemo(() => {
        ticketId && dispatch(get_ticket({id: ticketId}))
    }, [ticketId])
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({behavior: 'smooth', block: "center"});
    }, [ticketBoxState]);

    const handleSubmit = (e: any) => {
        e.preventDefault()

        if (description.trim()) {
            setTicketBoxFiles([])
            setImgIds([])
            let value: any = {}
            value.description = description
            value.title = ticketBoxState[0]?.title
            value.file = imgIds
            value.urgency = ticketBoxState[0]?.urgency
            value.department = ticketBoxState[0]?.department
            value.replied_to = ticketBoxState[0].id

            dispatch(create_chat_ticket(value))
            setDescription('')
            setDescriptionError('')
        } else {
            setDescriptionError('ابتدا متنی وارد نمایید!')
        }


    }


    const handleUploadImages = async (e: any, id: any) => {
        setImgFiles((prev: any) => [...prev, {file: (e.target.files[0]), id}])
        let ticketImg = new FormData()
        ticketImg.append('file', e.target.files[0])
        ticketImg.append('subject_type', '4')

        await postThumbnail(ticketImg, options).then(res => {
            setImgIds((prev: any) => [...prev, res])
            // dispatch(handleAddThumbnail(res))
            setEndUpload(true)
            setProgress(0)
        }).catch(err => {

            setProgress(0)
            setEndUpload(true)
            setTicketBoxFiles((prev: any) => prev.filter((item: any) => item.id !== id))

            // setPrimaryImage([])
            toast.error('آپلود عکس با مشکل مواجه شد')
            // if (err.response.status === 500) {
            // }else{
            //     toast.error('آپلود عکس ')
            // }
        })
    }

    return (
        <div className='bg-white md:sticky md:top-3  rounded-xl overflow-y-auto md:w-auto w-full shadow-lg'>

            {/* ticket chat box titlebar */}
            <div className=' py-4 px-5 w-full box-shadow-1 bg-white  '>
                <div className='flex flex-row justify-between items-center'>
                    <span className='text-lg font-semibold'>
                    {ticketBoxState[0]?.title}
                </span>
                    <div className='flex flex-row justify-center items-center gap-x-1'>

                        {
                            ticketBoxState[0]?.created_at &&
                            <>
                                <DateSvg color={`#005adc`} width={15} height={15}/>
                                <div className='flex flex-row justify-center items-center gap-x-1'>
                                    <span className={`text-sm`}>تاریخ : </span>
                                    <span className={`text-sm font-semibold`}>

                                    {new Date(+ticketBoxState[0]?.created_at).toLocaleDateString("fa")}

                                </span>
                                </div>
                            </>
                        }
                    </div>
                </div>
                {
                    !!ticketId &&
                    <div className='flex flex-row justify-between items-center text-sm mt-1'>
                        <p>
                            <span className='text-custom-gray-200'>اولویت : </span>
                            <span className='text-primary'>
                            {
                                ticketBoxState[0]?.urgency === 0 ? 'کم' : ticketBoxState[0]?.urgency === 1 ? 'متوسط' : ticketBoxState[0]?.urgency === 2 && 'زیاد'
                            }
                        </span>
                        </p>
                        <p>
                            <span className='text-custom-gray-200'> موضوع : </span>
                            <span className='text-primary'>
                             {
                                 ticketBoxState[0]?.department === 0 ? 'پشتیبانی' : ticketBoxState[0]?.department === 1 ? 'فروش' : ticketBoxState[0]?.department === 2 && 'فنی'
                             }
                        </span>
                        </p>
                    </div>
                }
            </div>

            <div>

            </div>

            {/* chat box */}
            <div className='h-[400px] py-3 px-4  overflow-y-auto flex flex-col gap-y-8'>

                {
                    ticketBoxState?.length > 0 ?
                        <>


                            {
                                ticketBoxState.map((item: any) => (
                                    <React.Fragment key={item.name}>

                                        <div
                                            dir={`${adminBox ? 'ltr' : 'rtl'}`}
                                            className={`w-full flex flex-col ${item?.admin_replied ? 'items-end' : 'items-start'} gap-y-5`}>

                                            <div
                                                className={`bg-primary ${item?.admin_replied ? 'bg-[#F4F6F8] text-text  tri-left' : 'bg-primary  text-white tri-right'} items-start md:w-1/2 w-4/5 rounded-xl  flex flex-col   p-4 relative  first:mb-3 my-3`}>
                                                <div className='pb-4 flex flex-col'>
                                                    <span
                                                        className='text-sm font-bold'> {item?.writer}</span>
                                                    {
                                                        item?.admin_replied && <span className='text-xs'>ادمین</span>
                                                    }
                                                </div>
                                                <div className='text-sm leading-5 pb-4'>
                                                    {item?.description}
                                                </div>
                                                <span
                                                    className={`absolute -bottom-7 ${item?.admin_replied ? 'right-0 text-text' : 'left-0 text-primary'}  text-xs`}>{new Date(+item?.created_at).toLocaleDateString('fa', {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                })}</span>
                                            </div>
                                            {
                                                item?.file?.length > 0 ?
                                                    item?.file?.map((img: any) => (
                                                        <div
                                                            key={img?.file?.toString()}
                                                            className={`bg-primary border p-3 ${item?.admin_replied ? 'bg-[#F4F6F8] text-text  ' : ' text-white '} md:w-3/5 w-4/5 h-[100px] rounded-xl  flex flex-col justify-between  items-start   relative  first:mb-3 my-3`}>
                                                            <div className='w-full h-full'>
                                                                <span
                                                                    className='text-sm font-bold'> {item?.writer}</span>
                                                                {/*<img src={img?.file}*/}
                                                                {/*     className='w-10 h-full object-fill rounded-xl object-cover'/>*/}

                                                            </div>
                                                            <div className='flex justify-between w-full items-center'>
                                                                <a className='w-2/3 break-words'
                                                                   href={img?.file}>{img?.file?.split("media_file/")[1]}</a>
                                                                <a download href={img?.file}>
                                                                    <BiDownload className='w-8 h-8'/>
                                                                </a>
                                                            </div>
                                                            <span
                                                                className={`absolute -bottom-7 ${item?.admin_replied ? 'right-0 text-text' : 'left-0 text-primary'}  text-xs`}>
                                                                {new Date(+item?.created_at).toLocaleDateString('fa', {
                                                                    hour: "numeric",
                                                                    minute: "numeric",
                                                                    month: "long",
                                                                    day: "numeric"
                                                                })}
                                                            </span>
                                                            {/*<a href={img?.file} download >a</a>*/}
                                                        </div>
                                                    ))
                                                    : null


                                                // :
                                                // <div className={`bg-primary ${item?.isAdmin ? 'bg-[#F4F6F8] text-text  tri-left' : 'bg-primary  text-white tri-right'} md:w-3/5 w-4/5 rounded-xl  flex flex-row justify-between  items-center  p-4 relative  first:mb-3 my-3`}>
                                                //     <div>
                                                //         <span className='text-xs font-bold pb-4'>{item?.isAdmin ? 'ادمین' : `${item?.name}` }</span>
                                                //         <div className='text-sm leading-5 pb-4'>
                                                //             {item?.message}
                                                //         </div>
                                                //     </div>
                                                //     <div>
                                                //         <CircleDocumentUploadSvg />
                                                //     </div>
                                                //     <span className={`absolute -bottom-7 ${item?.isAdmin ? 'right-0 text-text' : 'left-0 text-primary'}  text-xs`}>{item?.date}</span>
                                                // </div>
                                            }

                                            {/*{*/}
                                            {/*    imgFiles?.length > 0 ?*/}
                                            {/*        imgFiles?.map((img : any)=>(*/}
                                            {/*            <div*/}
                                            {/*                key={img?.file?.lastModified}*/}
                                            {/*                className={`bg-primary border ${item?.admin_replied ? 'bg-[#F4F6F8] text-text  ' : ' text-white '} md:w-3/5 w-4/5 h-[220px] rounded-xl  flex flex-col justify-between  items-start   relative  first:mb-3 my-3`}>*/}
                                            {/*                <img src={URL?.createObjectURL(img?.file)}*/}
                                            {/*                     className='w-full h-full object-fill rounded-xl object-cover'/>*/}
                                            {/*                <span className={`absolute -bottom-7 ${item?.admin_replied ? 'right-0 text-text' : 'left-0 text-primary'}  text-xs`}>{new Date(+item?.created_at).toLocaleDateString('fa', {hour: "numeric"})}</span>*/}
                                            {/*            </div>*/}
                                            {/*        ))*/}
                                            {/*        : null*/}
                                            {/*}*/}

                                        </div>


                                    </React.Fragment>
                                ))
                            }

                            <div ref={bottomRef}>

                            </div>
                        </>
                        :
                        <div className='flex flex-col justify-center items-center h-full '>
                            <span className='text-lg '>برای نمایش محتوای تیکت ، تیکتی را انتخاب کنید</span>
                        </div>
                }

            </div>

            {/* send message operator */}
            {
                ticketBoxState?.length > 0 &&
                <div className=' py-3 px-4   w-full'>
                    <form
                        className='w-full bg-[#F4F6F8] rounded-lg py-2 px-3 z-20 relative flex flex-row  justify-between gap-x-2'
                        onSubmit={handleSubmit}
                    >
                        <input type={'text'} onChange={(e) => setDescription(e.target.value)}
                               value={description}
                               className={`flex-1  bg-transparent text-xs focus:outline-none`}
                               placeholder="پیام خود را بنویسید ..."/>
                        <div className='flex gap-x-2'>
                            <span
                                onClick={addTicketBoxFile}
                                className='bg-white cursor-pointer h-[36px] w-[36px] rounded-lg border-2 border-[#005adc]/20 flex flex-row justify-center items-center'>
                               <GallerySvg/>
                             </span>
                            <button type='submit' className='cursor-pointer'>
                                <SendMessage/>
                            </button>
                        </div>

                    </form>
                    {
                        descriptionError &&
                        <p className='text-sm text-custom-red m-1'>
                            {descriptionError}
                        </p>
                    }

                    {
                        ticketBoxFiles.length > 0 &&
                        <form>
                            {
                                ticketBoxFiles?.map((item: any, i: any, arr: any) => {
                                    return (
                                        <>
                                            <div key={item?.id}
                                                 className='flex items-center justify-center gap-x-3 mt-2'>
                                                <input onChange={(e) => handleUploadImages(e, item?.id)}
                                                       className='border w-full my-2' type="file" name="file" id=""/>
                                                <BiMinus onClick={() => deleteTicketBoxFile(item?.id, i)}
                                                         className='text-custom-red cursor-pointer w-4 h-6'/>
                                                {
                                                    arr.length - 1 === i ?
                                                        <button disabled={arr.length !== imgIds.length}
                                                                className='cursor-pointer' onClick={addTicketBoxFiles}>
                                                            <PlusSvg
                                                                color={`${arr.length !== imgIds.length ? "#efefef" : "#005adc"} `}
                                                                width={16} height={16}/>
                                                        </button> : null
                                                }
                                            </div>
                                            {
                                                !endUpload ?
                                                    <div
                                                        style={{
                                                            width: `${progress}%`,
                                                            animationFillMode: 'forwards',
                                                            animationDirection: ''
                                                        }}
                                                        className='bg-primary w-full h-1'>


                                                    </div>
                                                    :
                                                    null
                                            }
                                        </>
                                    )
                                })
                            }

                            <span className='text-sm text-custom-red'>
                                {errorTicketBoxes}
                            </span>
                        </form>
                    }
                </div>
            }
        </div>
    )
}

export default TicketChatBox
