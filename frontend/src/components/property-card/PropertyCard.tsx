import React, {FC, useEffect, useState} from "react";

import LocationSvg from "../svg/location/LocationSvg";
import HomeSvg from "../svg/home/HomeSvg";
import DateSvg from "../svg/date/DateSvg";
import ShowMore from "../show-more/ShowMore.component";
import Link from "next/link";
import {numberWithCommas} from "../../utils/numberWithCommas";
import BookmarkSvg from "../svg/bookmark/BookmarkSvg";
import TrashSquareSvg from "../svg/trash-square/TrashSquareSvg";
import ViewEye from "../svg/eyes/viewEye";
import {useRouter} from "next/router";
import {deleteMyProperties, putBookmark} from "../../services/api/property";
import toast from "react-hot-toast";
import {useAuth} from "../../hooks/useAuth";
import EditSvg from "../svg/edit/editSvg";
import Image from "next/image";

interface SimilarSinglePropertyProps {
    wide?: boolean,
    ref?: React.Ref<any>,
    data?: any,
    inMyFavorites?: boolean,
    inMyAds?: boolean,
    handleDeleteMyFavourites?: any,
    setPropertyId?: any,
    setOpenModal?: any
    // handleDeleteMyProperties?: any
}


// eslint-disable-next-line react/display-name
const PropertyCard: FC<SimilarSinglePropertyProps> = React.forwardRef(({
                                                                           wide = false,
                                                                           data,
                                                                           inMyFavorites = false,
                                                                           inMyAds = false,
                                                                           setPropertyId,
                                                                           setOpenModal,
                                                                           handleDeleteMyFavourites,
                                                                           //    handleDeleteMyProperties
                                                                       }, ref) => {

        const [newThumbNail, setNewThumbNail] = useState<any>([])


        const router = useRouter()

        const {user} = useAuth()

        const handlePutBookmark = async (id: number) => {
            await putBookmark(id)
                .then(() => {
                    toast.success('آگهی از علاقه مندی ها حذف شد')
                    handleDeleteMyFavourites(id)
                })
        }

        const handleDeleteMyProperty = (id: number) => {
            deleteMyProperties(id)
                .then((data) => {
                    toast.success(data.detail)
                    // handleDeleteMyProperties(id)
                })
        }

        useEffect(() => {
            //check we have thumbnail on post gallery or not.and based on is_default set a thumbnail on post
            if (data?.media?.thumbnail[0]?.is_default && data?.media?.gallery[0]?.is_default) {
                setNewThumbNail(data?.media?.thumbnail[0]?.file)
            } else if (data?.media?.thumbnail[0]?.is_default && !data?.media?.gallery[0]?.is_default) {
                setNewThumbNail(data?.media?.gallery[0]?.file)
            }
                // else if(data?.media?.thumbnail.find((item:any)=> item?.subject_type === 5)){
                //     setNewThumbNail(data?.media?.thumbnail.find((item:any)=> item?.subject_type === 5).file)
            // }
            else {
                setNewThumbNail(data?.media?.thumbnail.find((item: any) => item?.subject_type === 2)?.file)
            }
        }, [data])


        const postBody = (
            <>
                {/* similar single property */}
                <Link
                    target="_blank"
                    href={data.status === 0 ? `/dashboard/my-properties/${data?.id}` : `/single-property/${data?.id}/${data?.slug}`}
                    className={`bg-white relative box-shadow-2 ${
                        wide ? "rounded-3xl" : "rounded-2xl"
                    } overflow-y-hidden grid grid-cols-12`}
                >
                    {wide && data?.is_fori && (
                        <div
                            className="absolute top-0 left-0 hidden md:block bg-primary px-4 py-3 rounded-br-3xl"
                        >

                            <span className="text-sm font-bold text-white">فوری</span>
                        </div>
                    )}

                    {/* image wrapper */}

                    <div
                        className={`p-4 relative   ${
                            wide
                                ? "md:col-span-5 lg:col-span-4 xl:col-span-3 col-span-12"
                                : "col-span-12"
                        }`}
                    >
                        {/*<div className="absolute top-6 left-6 bg-white rounded-lg p-1">*/}
                        {/*    <img src={'/images/logo-blue.svg'} className="w-8 h-8"/>*/}
                        {/*</div>*/}

                        {
                            inMyFavorites &&
                            <div className="absolute bottom-6 left-6 cursor-pointer z-10"
                                 onClick={(e) => {
                                     e.preventDefault()
                                     handlePutBookmark(data?.id)
                                 }
                                 }>
                                <div className="bg-primary p-1 rounded-md">
                                    <BookmarkSvg/>
                                </div>
                            </div>
                        }
                        {
                            inMyAds &&
                            <div className="absolute bottom-6 left-6 cursor-pointer flex items-center gap-x-1 z-20"
                            >
                                <Link href={`/dashboard/my-properties/${data?.id}?status=${data?.status}`}
                                      className='bg-primary p-[3px] rounded-md'>
                                    <EditSvg color={'#fff'} width={17} height={17}/>
                                </Link>
                                <span onClick={(e) => {
                                    e.preventDefault()
                                    setPropertyId(data?.id)
                                    setOpenModal(true)
                                }}>
                                   <TrashSquareSvg width={30} height={30}/>

                                </span>
                            </div>
                        }
                        {
                            inMyAds &&
                            <div
                                className="flex z-10 flex-row justify-center items-center rounded-md gap-x-1 absolute top-6 right-6 bg-primary px-2 py-1">
                                <ViewEye/>
                                <span className="text-xs text-white">{data?.view}</span>
                            </div>
                        }

                        {/*<figure className={`block relative ${wide ? 'h-[230px] md:h-[153px]' : 'h-[230px]'}`}>*/}
                        {/*<img*/}
                        {/*    className='w-full h-full'*/}
                        {/*    src='/images/ratio.jpg'*/}

                        {/*/>*/}
                        <div className={`relative ${wide ? "aspect-w-3 aspect-h-3" : "aspect-w-3 aspect-h-3"}`}>
                            {/*<img src="..." alt="..."*/}
                            {/*     className="w-full h-full object-center object-cover lg:w-full lg:h-full"/>*/}
                            {
                                !wide && data?.is_fori &&
                                <span
                                    className='absolute p-3 w-1/6 h-1/6 text-white rounded-bl-2xl left-0 bottom-0 z-30 flex justify-center items-center  bg-primary'>
                                       فوری
                                    </span>
                            }
                            <img
                                className='w-full h-full absolute inset-0 rounded-xl object-cover object-center'
                                src={newThumbNail}
                            />

                            {
                                wide ?
                                    <div className='absolute right-2 top-[85%]'>
                                        <img src="/images/watermark.png" alt=""/>
                                    </div>
                                    :
                                    <div className='absolute right-2 top-[90%]'>
                                        <img src="/images/watermark.png" alt=""/>
                                    </div>
                            }
                        </div>
                        {/*<Image alt=''*/}
                        {/*       className={`h-full w-full object-cover w-full rounded-xl border-[1px] border-black/15`}*/}
                        {/*       fill={true} quality={100}*/}
                        {/*       src={newThumbNail}*/}
                        {/*       priority/>*/}

                        {/*</figure>*/}
                    </div>
                    {/*<Link href={`/single-property/${data?.id}/${data?.slug}`} className="col-span-12">*/}


                    {/*<div className="col-span-12 grid grid-cols-12 gap-y-4">*/}
                    {/* property info wrapper */}
                    <div
                        className={`${
                            wide
                                ? "md:col-span-7 lg:col-span-8 xl:col-span-9 col-span-12 py-4"
                                : "col-span-12 "
                        }`}
                    >
                        {/* property title */}

                        <div
                            className={`text-lg font-bold px-4 pb-5 ${
                                wide && "md:px-0 md:pb-5"
                            }`}
                        >
                            <div>
                                {data.title}
                            </div>


                        </div>

                        {wide && (
                            <div className="h-20  pl-40 md:block hidden">
                                <p className="text-custom-gray-200 text-justify truncate">
                                    {data.description}
                                </p>
                            </div>
                        )}

                        {/* property info */}

                        <div className={`px-4 pb-1 ${wide && "md:px-0 md:pb-0 "}`}>
                            <div
                                className={`flex ${wide ? 'flex-row' : 'flex-col'} flex-wrap justify-start items-start gap-y-3 gap-x-6`}>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="ml-2">
                                        <LocationSvg/>
                                    </div>
                                    <h3 className="ml-2"> شهر : </h3>
                                    <span className="font-bold text-sm">{data.section.city}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="ml-2">
                                        <HomeSvg/>
                                    </div>
                                    <h3 className="ml-2"> نوع ملک :</h3>
                                    <span className="font-bold text-sm">{data.category.display_name}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="ml-2">
                                        <DateSvg color='#005ADC'/>
                                    </div>
                                    <h3 className="ml-2"> تاریخ :</h3>
                                    <span
                                        className="font-bold text-sm">{`${new Date(+data.date * 1000).toLocaleDateString('fa')}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* property price */}
                    <div

                        className={` ${
                            wide ? "bg-primary-100/10 p-4" : "bg-primary-100/40 p-6"
                        } col-span-12 mt-2`}
                    >
                        <div className="flex flex-row justify-between items-center w-full">
                            {wide ? (
                                <div
                                    className="flex flex-row md:justify-start flex-wrap justify-between items-center gap-x-3 md:w-auto w-full ">
                                    <span className="text-base font-bold text-text">قیمت</span>
                                    <div className="flex flex-row justify-start gap-x-2">
                                        {
                                            data.price !== 0 ?
                                                <>
                                                                    <span className=" text-xl font-bold text-primary">
                                                                    {numberWithCommas(data.price)}
                                                                    </span>
                                                    <span className="text-lg text-primary">تومان</span>
                                                </>

                                                :
                                                <>

                                                                    <span className=" text-xl font-bold text-primary">
                                                                    توافقی
                                                                    </span>
                                                </>
                                        }
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="text-base font-bold text-text">قیمت</span>
                                    <div className="flex flex-row justify-start gap-x-2">
                                        {
                                            data.price !== 0 ?
                                                <>
                                                                    <span className=" text-xl font-bold text-primary">
                                                                    {numberWithCommas(data.price)}
                                                                    </span>
                                                    <span className="text-lg text-primary">تومان</span>
                                                </>

                                                :
                                                <>

                                                                    <span className=" text-xl font-bold text-primary">
                                                                    توافقی
                                                                    </span>
                                                </>
                                        }
                                    </div>
                                </>
                            )}
                            {wide && (
                                <div className="md:block hidden">
                                    {/* show more has optional path (default = # for test in dev) */}
                                    <ShowMore path={`/single-property/${data?.id}/${data?.slug}`}/>
                                </div>
                            )}
                        </div>
                    </div>
                    {/*</div>*/}
                    {/*</Link>*/}

                </Link>
            </>
        )


        const content = ref
            ? <article ref={ref}>{postBody}</article>
            : <article>{postBody}</article>


        return content
    }
);

export default PropertyCard;
