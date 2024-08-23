import {ErrorMessage, Form} from 'formik'
import React, {useEffect, useState} from 'react'
import Input from '../../form/input'
import CustomSelect from '../../select/CustomSelect'
import {postThumbnail} from "../../../services/api/property";
import toast from "react-hot-toast";
import {BiMinus} from "react-icons/bi";
import PlusSvg from "../../svg/plus/PlusSvg";
import {useAppSelector} from "../../../hooks/useRedux";
import {addTicketLoading} from "../../../redux/slices/ticketSlice";
import LoadingSvg from "../../svg/loading/LoadingSvg";
import GallerySvg from "../../svg/gallery/gallerySvg";

const departmentOptions = [
    {
        name: 'پشتیبانی',
        slug: 0
    },
    {
        name: 'فروش',
        slug: 1
    },
    {
        name: 'فنی',
        slug: 2
    },
]

const urgencyOptions = [
    {
        name: 'کم',
        slug: 0
    },
    {
        name: 'متوسط',
        slug: 1
    },
    {
        name: 'زیاد',
        slug: 2
    },
]

const InnerAddTicketForm = (props: any) => {
    const addTicketLoadingState = useAppSelector(addTicketLoading)

    const [progress, setProgress] = useState(0)
    const [endUpload, setEndUpload] = useState(false)


    const [imgFiles, setImgFiles] = useState<any>([])
    const [imgIds, setImgIds] = useState<number[]>([])
    const [ticketBoxFiles, setTicketBoxFiles] = useState<any>([{id: Math.random()}])

    const [errorTicketBoxes, setErrorTicketBoxes] = useState('')

    useEffect(() => {
        props.setFieldValue("file", imgIds)
    }, [imgIds])

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

    // const addTicketBoxFile = () => {
    //     if (ticketBoxFiles?.length < 1) {
    //         setTicketBoxFiles([{id: Math.random()}])
    //         setErrorTicketBoxes('')
    //     }
    // }

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

    const addTicketBoxFile = () => {
        if (ticketBoxFiles?.length < 1) {
            setTicketBoxFiles([{id: Math.random()}])
            setErrorTicketBoxes('')
        }
    }

    return (
        <Form className='w-full space-y-6'>
            <div className='flex flex-col w-full gap-y-3'>
                <label className='text-sm font-semibold' htmlFor='department'>موضوع تیکت</label>
                <CustomSelect name='title' handleChange={value => props.setFieldValue('department', value?.slug)}
                              options={departmentOptions} placeholder="عنوان تیکت را انتخاب کنید ..."/>
                <ErrorMessage name='title' component={'div'} className={`text-xs text-custom-red `}/>
            </div>
            <div className='flex flex-col w-full gap-y-3'>
                <label className='text-sm font-semibold' htmlFor='urgency'>ضرورت تیکت</label>
                <CustomSelect name='urgency' handleChange={value => props.setFieldValue('urgency', value?.slug)}
                              options={urgencyOptions} placeholder="ضرورت تیکت را انتخاب کنید ..."/>
                <ErrorMessage name='urgency' component={'div'} className={`text-xs text-custom-red `}/>
            </div>
            {/*<div className='flex flex-col w-full gap-y-3'>*/}
            {/*    <label className='text-sm font-semibold' htmlFor='subject'>موضوع تیکت</label>*/}
            {/*    <CustomSelect name='subject' handleChange={value => props.setFieldValue('subject', value?.name)}*/}
            {/*                  options={titleOptions} placeholder="موضوع تیکت را انتخاب کنید ..."/>*/}
            {/*    <ErrorMessage name='subject' component={'div'} className={`text-xs text-custom-red `}/>*/}
            {/*</div>*/}
            <div className='flex flex-col w-full gap-y-3'>
                <label className='text-sm font-semibold' htmlFor='title'>عنوان تیکت</label>
                <Input type='text' name='title' placeHolder='عنوانی برای تیکت بنویسید..'/>
            </div>
            <div className='flex flex-col w-full gap-y-3'>
                <label className='text-sm font-semibold' htmlFor='description'>پیام تیکت</label>
                <Input type='textarea' as='textarea' rows={5} name='description'/>
            </div>

            {/*upload image*/}

            {  ticketBoxFiles.length > 0 ?
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
                :
               <p className='flex items-center gap-x-2'>
                   <span> افزودن فایل</span>
                   <span
                       onClick={addTicketBoxFile}
                       className='bg-white cursor-pointer h-[36px] w-[36px] rounded-lg border-2 border-[#005adc]/20 flex flex-row justify-center items-center'>

                               <GallerySvg/>
                   </span>
               </p>
            }
            <span className='text-sm text-custom-red'>
                {errorTicketBoxes}
            </span>


            <div className='w-full flex flex-row justify-start gap-x-6 items-center'>
                <button type='submit'
                        className={`basis-3/4 bg-primary-lin py-4 rounded-md text-white font-semibold flex justify-center`}>
                    {
                        addTicketLoadingState ?
                            <span className='animate-spin'> <LoadingSvg width={20} height={20} color1={'#fff'}
                                                                        color2={"#fff"}/></span>
                            :
                            <span>
                                  ثبت
                                  تیکت
                            </span>

                    }
                </button>
                <button type='button'
                        className='basis-1/4 bg-custom-gray-200/10 py-4 text-custom-gray-200 rounded-md font-semibold'
                        onClick={(e) => props.setOpenAddTicketModal(false)}
                >لغو
                </button>
            </div>
        </Form>
    )
}

export default InnerAddTicketForm
