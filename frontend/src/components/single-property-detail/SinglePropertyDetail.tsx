import React, {FC, useState, useEffect, useMemo} from "react";

import {NextPage} from "next";

const PropertyMap = dynamic(() => import("../property-map/PropertyMap.component"), {ssr: false});

import LocationSvg from "../svg/location/LocationSvg";
import HomeSvg from "../svg/home/HomeSvg";
import DateSvg from "../svg/date/DateSvg";
import ShareSvg from "../svg/share/ShareSvg";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Autoplay} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay"
import CallSvg from "../svg/call/CallSvg";
import CircleProfileSvg from "../svg/circle-profile/CircleProfileSvg";
import UnBookmarkSvg from "../svg/unbookmark/UnBookmarkSvg";
import {numberWithCommas} from "../../utils/numberWithCommas";
import {metaTranslate} from "../../configs/metaTranslate";
import BookmarkSvg from "../svg/bookmark/BookmarkSvg";
import {putBookmark} from "../../services/api/property";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import Link from "next/link";
import {textEllipsis} from "../../utils/textEllipsis";
import CloseIcon from "../svg/close/closeSvg";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import dynamic from "next/dynamic";


interface SinglePropertyDetailProps {
    data: any,
    inDashboard?: boolean,
    activePosts?: any
}

const SinglePropertyDetail = ({data, inDashboard = false, activePosts}: SinglePropertyDetailProps) => {

    const router = useRouter()

    const [seo, setSeo] = useState<any>('')
    const [shareModal, setShareModal] = useState(false)
    const [copied, setCopied] = useState(false)
    const [newGallery , setNewGalley] = useState<any>([])
    const handleCopy = () => {
        setCopied(true)
        navigator.clipboard.writeText(`https://villaarzan.com${router.asPath}`)
    }
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 5000)
        }
    }, [copied])


    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com/single-property${router.asPath}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })


    }, [])

    const handlePutBookmark = async (id: number) => {
        await putBookmark(id)
            .then((data) => {


                router.push({
                    pathname: router.pathname,
                    query: router.query,

                }, undefined, {scroll: false}).then(() => {

                    toast(data?.detail)
                })
            })
            .catch((err) => {
                toast(err?.response?.data?.detail)
            })
    }


    const addProductJsonLd = () => {
        return {
            __html: `
                  {
                    "@context": "https://schema.org/", 
                    "@type": "Product", 
                    "name": "${data?.title}",
                    "image": "${data?.media?.thumbnail?.file}",
                      "offers": {
                    "@type": "Offer",
                    "url": "https://villaarzan.com${router.asPath}",
                    "priceCurrency": "IRR",
                    "price": "${data.price}"
  }
                } `
        }
    }

    const reviewProductJsonLd = () => {
        return {
            __html: `
                
                 {
                     "@context": "https://schema.org/",
                     "@type": "Review",
                     "itemReviewed": {
                          "@type": "Product",
                          "image": "${data?.media?.thumbnail?.file}",
                          "name": "${data?.title}",
                          "offers": {
                               "@type": "Offer",
                               "price": "${data?.price}",
                               "priceCurrency": "IRR"
                          }
                     },
                     "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": "5",
                          "bestRating": "5",
                          "worstRating": "0"
                     },
                    
                     "publisher": {
                          "@type": "Organization",
                          "name": "${data?.user?.fullname}"
                     },
                     "datePublished": "${new Date(+data?.update_at).toLocaleDateString('fa')}"
                    
                }
            
            `
        }
    }

    const breadCrumbListJsonLd = () => {
        return {
            __html: `
                         {
                          "@context": "https://schema.org/", 
                          "@type": "BreadcrumbList", 
                          "itemListElement": [{
                            "@type": "ListItem", 
                            "position": 1, 
                            "name": "ویلا ارزان | خرید و فروش ملک",
                            "item": "https://villaarzan.com/"  
                          },{
                            "@type": "ListItem", 
                            "position": 2, 
                            "name": "${data?.category?.city}",
                            "item": "https://villaarzan.com/${data?.category?.city_slug}"  
                          },
                          {
                            "@type": "ListItem", 
                            "position": 3, 
                            "name": "${data?.category?.display_name}",
                            "item": "https://villaarzan.com/${data?.category?.city_slug}/${data?.category?.name}"  
                          },
                          {
                            "@type": "ListItem", 
                            "position": 3, 
                            "name": "${data?.section?.name}",
                            "item": "https://villaarzan.com/${data?.category?.city_slug}/${data?.category?.name}/${data?.section?.slug}"  
                          },
                          {
                            "@type": "ListItem", 
                            "position": 4, 
                            "name": "${data?.title}",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }
                          ]
                        }
                `
        }
    }

    useEffect(()=>{

        const {thumbnail , gallery} = data?.media

        if(thumbnail[0]?.is_default && gallery[0]?.is_default){

            setNewGalley([thumbnail[0]])
        }else if(thumbnail[0]?.is_default || gallery[0]?.is_default){

         setNewGalley([...thumbnail , ...gallery].filter(item=> item?.is_default !== true).filter(item=>item?.subject_type !==5))
        }else{

            setNewGalley([...thumbnail , ...gallery].filter(item=>item?.subject_type !==5))
        }

    } , [data])


    return (
        <>
            <Head>

                <title>{data?.title}</title>
                <meta name='robots' content='index,follow'/>
                <meta name='googlebot' content='index,follow'/>
                <meta name='description' content={data?.description}/>
                <meta property="og:image" content={`${data?.media?.thumbnail?.file}`}/>
                <meta property="og:image:alt" content={`ویلا ارزان | خرید و فروش ملک`}/>
                <meta property="og:type" content='product'/>
                <meta property="og:url" content={router.asPath}/>
                <meta name='owner' content="villaarzan | ویلا ارزان"/>
                <meta name="author" content="villaarzan | ویلا ارزان"/>
                <meta name="copyright" content="2022 © ویلاارزان"/>
                <meta property="og:image:width" content="800"/>
                <meta property="og:image:height" content="600"/>
                <meta property="og:title" content={`ویلا ارزان | ${data?.title}`}/>

                {
                    seo?.meta?.map((item: any, index: any) => {
                        if (item.name && !item.property_type) {
                            return <meta key={item.id} name={item.name} content={item.content}/>
                        } else if (!item.name && item.property_type) {
                            return <meta key={item.id} property={item.property_type} content={item.content}/>
                        }
                    })
                }

                {
                    seo?.schima?.map((item: any, index: any) => {
                        return <script key={item.id} type="application/ld+json" dangerouslySetInnerHTML={
                            {
                                __html: item.content
                            }
                        }/>
                    })
                }

                {
                    seo?.canonical?.length > 0 && seo?.canonical[0].url ?
                        <link rel='canonical' href={seo?.canonical[0].url}/>
                        :
                        <link rel='canonical' href={`https://villaarzan.com${router.asPath}`}/>

                }

                <script type="application/ld+json" dangerouslySetInnerHTML={addProductJsonLd()}/>
                <script type="application/ld+json" dangerouslySetInnerHTML={reviewProductJsonLd()}/>
                <script type="application/ld+json" dangerouslySetInnerHTML={breadCrumbListJsonLd()}/>


            </Head>
            {
                shareModal &&
                <div
                    className='backdrop-blur-sm w-full h-full fixed top-0 left-0 z-40 flex flex-col items-center justify-center'
                    style={{backgroundColor: 'rgba(0,0,0,0.3)'}}

                >
                    <div
                        className="absolute bg-white z-50 box-shadow-1 py-3 px-4 rounded-lg xl:w-1/5 lg:w-2/5 md:w-3/5 w-full transition-all ease-in-out duration-500">
                        <div className="flex flex-row justify-between items-center">
                            <span className="text-text font-semibold">اشتراک گذاری</span>
                            <span className="cursor-pointer"
                                  onClick={() => setShareModal(false)}
                            ><CloseIcon/></span>
                        </div>
                        <div className="my-8">
                            <span className="text-custom-gray-200">این ملک رو با دوستان به اشتراک بذارین</span>
                            <div className="flex flex-row justify-center items-center pt-5">
                                <img className='w-[100px] h-[100px] object-fill' src="/images/logo-blue.svg"
                                     alt=""/>
                            </div>
                        </div>
                        <div
                            className="border-[0.8px] border-custom-gray-200/10 bg-custom-gray-100/90 rounded-md px-3 py-2 mt-7 flex flex-row justify-between items-center ">
                            <span
                                className={`text-white text-sm cursor-pointer px-3 py-1 rounded-md ${copied ? 'bg-custom-green' : 'bg-primary'}`}
                                onClick={handleCopy}
                            >
                                {copied ? 'کپی شد' : 'کپی لینک'}
                            </span>
                            <Link href={`https://villaarzan.com${router.asPath}`} style={{direction: 'ltr'}}
                                  className={`text-sm`}
                                  onClick={() => setShareModal(false)}
                            >{textEllipsis(`https://villaarzan.com${router.asPath}`, 20)}</Link>
                        </div>
                    </div>
                </div>
            }
            {/* property wrapper */}
            <div
                className={`col-span-12   space-y-6 ${inDashboard ? 'lg:pl-4 lg:col-span-7' : 'lg:pl-10 md:pl-5 lg:col-span-8 md:col-span-7'} `}>

                {/*  property box */}

                <div
                    className={` px-4  relative pb-4 py-3 ${inDashboard ? 'bg-white rounded-3xl ' : 'sm:bg-white sm:rounded-3xl sm:shadow-xl'}`}
                    // style={{ boxShadow: " 0px 4px 30px rgba(0, 38, 84, 0.11)" }}
                >
                    {/* slider and image overlay */}

                    <div className="relative rounded-lg overflow-y-hidden border  border-custom-gray-200/10">
                        <div className="absolute h-full w-full flex flex-col z-10">
                            {/*<div className="flex flex-row justify-between">*/}
                            {/*    <div*/}
                            {/*        className="bg-primary rounded-bl-3xl px-5 flex flex-col items-center justify-center text-sm font-bold text-white">*/}
                            {/*        فوری*/}
                            {/*    </div>*/}
                            {/*    <img*/}
                            {/*        src="/images/real-estate-profile.png"*/}
                            {/*        className="h-11 w-11 ml-2 mt-2"*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="flex flex-row justify-between h-full items-center">
                                <div className="bg-custom-gray-100/40 p-4 rounded-l-lg nextclass cursor-pointer">
                                    <img src="/images/arrow-right-gray.svg"/>
                                </div>
                                <div className="bg-custom-gray-100/40 p-4  rounded-r-lg prevclass cursor-pointer">
                                    <img src="/images/arrow-left-gray.svg"/>
                                </div>
                            </div>
                        </div>
                        <Swiper
                            // install Swiper modules
                            slidesPerView={1}
                            loop={true}
                            modules={[Navigation, Autoplay]}
                            autoplay={{delay: 5000}}
                            navigation={{
                                prevEl: ".prevclass",
                                nextEl: ".nextclass",
                                enabled: true,
                            }}
                        >
                            {
                             newGallery.length > 0 &&   [...newGallery].map((img: any) => {
                                    return <SwiperSlide key={img?.id}>
                                        <div
                                            className="h-[324px]  w-full aspect-w-14  aspect-h-9 ">
                                            <img src={img?.file} alt="..."
                                                 className="w-full h-full object-fill md:object-cover lg:w-full lg:h-full"/>
                                        </div>
                                    </SwiperSlide>
                                })
                            }

                            {/*        :*/}
                            {/*        [...data?.media?.thumbnail*/}
                            {/*            , ...data?.media?.gallery].some(item => item?.is_default !== true) && [...data?.media?.gallery, ...data?.media?.thumbnail].filter(item => item.is_default !== true).filter(item=>  item.subject_type ===2).map((img: any) => {*/}
                            {/*            return <SwiperSlide key={img?.id}>*/}
                            {/*                <div*/}
                            {/*                    className="h-[324px]  w-full object-fill aspect-w-16 aspect-h-9 lg:aspect-none">*/}
                            {/*                    <img src={img?.file} alt="..."*/}
                            {/*                         className="w-full h-full object-center object-cover lg:w-full lg:h-full"/>*/}
                            {/*                </div>*/}
                            {/*            </SwiperSlide>*/}
                            {/*        })*/}
                            {/*}*/}
                        </Swiper>
                    </div>

                    {/* title - user actions */}
                    <div className="grid grid-cols-12 py-3">
                        <div className="col-span-7 ">
                            <h1 className="font-bold text-lg leading-8 text-text">{data?.title}</h1>
                        </div>
                        <div className="col-span-5 ">
                            <div className="flex flex-row justify-end items-center md:p-0 py-1">
                                <div className="font-semibold  text-text md:flex hidden items-center gap-x-1">
                                     <span className="text-xs">
                                         کد آگهی :
                                     </span>
                                    <span>
                                        {data?.code}
                                   </span>
                                </div>

                                {/* before bookmark*/}
                                {
                                    data?.status !== 0 &&
                                    <div
                                        className="px-2 flex flex-col items-center justify-center rounded-md md:mr-3 py-1">
                                        {
                                            data?.is_bookmarked ?
                                                <div onClick={() => handlePutBookmark(data?.id)}
                                                     className="bg-primary p-1 rounded-md cursor-pointer">
                                                    <BookmarkSvg/>
                                                </div>
                                                :
                                                <div onClick={() => handlePutBookmark(data?.id)}
                                                     className="p-1 rounded-md cursor-pointer">
                                                    <UnBookmarkSvg/>
                                                </div>
                                        }
                                    </div>
                                }

                                {/* after bookmark*/}

                                {/* <div className="px-2 flex flex-col items-center justify-center rounded-md mr-3 bg-primary py-1">
                                 <BookmarkSvg />
                                  </div> */}

                                {
                                    router.pathname.includes('/single-property') &&
                                    <div className="md:mr-3 relative cursor-pointer"

                                         onClick={() => setShareModal(prev => !prev)}
                                    >
                                        <ShareSvg/>

                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    {/* property info */}
                    <div className="font-semibold  text-text flex md:hidden items-center gap-x-1 py-1">
                            <span>
                                کد آگهی :
                            </span>
                        <span>
                            {data?.code}
                        </span>
                    </div>
                    <div className="py-3">
                        <div className="flex flex-row flex-wrap justify-start items-center gap-y-6 gap-x-8">

                            <div className="flex flex-row justify-between items-center">
                                <LocationSvg/>
                                <h3 className="ml-2"> شهر : </h3>
                                <Link href={`/${data?.section?.city_slug}`}
                                      className="font-bold text-sm">{data?.section?.city}</Link>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <LocationSvg/>
                                <h3 className="ml-2"> منطقه : </h3>
                                <span className="font-bold text-sm">{data?.section?.name}</span>
                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <div className="ml-2">
                                    <HomeSvg/>
                                </div>
                                <h3 className="ml-2"> نوع ملک :</h3>
                                <Link href={`/shomal/${data?.category?.name}`}
                                      className="font-bold text-sm ml-1">{data?.category?.display_name} </Link>

                            </div>
                            <div className="flex flex-row justify-between items-center">
                                <div className="ml-2">
                                    <DateSvg color='#005ADC'/>
                                </div>
                                <h3 className="ml-2"> تاریخ :</h3>
                                <span className="font-bold text-sm">
                                    {`${new Date(+data?.created_at).toLocaleDateString('fa')}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {
                        data?.meta?.length > 0 &&
                        <div className='bg-primary-100/30 rounded-lg p-4 my-1'>
                            <div className='flex items-center gap-6 flex-wrap'>
                                {
                                    data?.meta.map((item: any) => (

                                        item?.key === 'category' ? null :
                                            <div key={item.id} className='flex items-center gap-x-2'>
                                                <span
                                                    className='text-sm'>{metaTranslate[item.key]} : {item.value}</span>
                                                {
                                                    (item.key === 'zamin_area' || item.key === 'area' || item.key === 'tejari_area') &&
                                                    <span>متر مربع</span>
                                                }
                                                {
                                                    (item.key === 'height') &&
                                                    <span>متر</span>
                                                }
                                                {
                                                    (item.key === 'age') &&
                                                    <span>سال</span>
                                                }
                                            </div>


                                    ))
                                }

                            </div>
                        </div>
                    }

                    {/* property description */}

                    <div className="py-3">
                        <p className="leading-8 text-justify text-sm font-[yekanbakh] font-base text-custom-gray-200 "
                           style={{wordBreak: "break-all", whiteSpace: "pre-line"}}
                        >
                            {
                                data?.description
                            }
                        </p>
                    </div>

                    {/*  property options */}
                    <div className="py-3">
                        <h3 className="text-text font-bold text-base pb-4">امکانات رفاهی</h3>
                        <ul className="flex flex-row flex-wrap gap-y-6 gap-x-6 ">
                            {
                                data?.options?.map((item: any) => (
                                    <li key={item?.id}
                                        className="text-text font-semibold text-base  before:content-['\2022'] before:text-primary before:ml-1">
                                        {item?.display_name}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                {
                    data?.lat_path &&  <PropertyMap lng={data?.lng_path} lat={data?.lat_path}/>
                }
            </div>

            {/* real estate info and property price */}
            <div
                className={`col-span-12  ${inDashboard ? 'pr-0 lg:col-span-5' : 'lg:pr-3 lg:col-span-4 md:col-span-5'}`}>
                <div className="sm:sticky sm:top-4 md:space-y-6">
                    <div
                        className={`mt-5 md:mt-0 py-4 px-5 md:rounded-2xl box-shadow-4 bg-white`}
                    >
                        <div className="grid grid-cols-12">
                            <div className="col-span-3 pl-3  overflow-hidden flex items-center justify-center">
                                <figure className='h-[63px] w-[63px] rounded-full overflow-hidden'>
                                    <img
                                        src={data?.user?.avatar?.file}
                                        className='w-full h-full object-cover'
                                    />
                                </figure>
                            </div>
                            <div className="col-span-9 space-y-1">
                                <div className="text-lg font-bold text-text break-words">
                                    {data?.user?.fullname}
                                </div>
                                <div className="font-medium text-text ">
                                    {data?.user?.role.display_name}
                                </div>
                                {
                                    data?.user?.company_name &&
                                    <div className="text-text text-sm">دفتر {data.user.company_name.name}</div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-row py-6">
                            <span className=" font-medium">شماره تماس : </span>
                            <span className="font-bold px-2">{data?.user?.phone}</span>
                        </div>
                        <div className="grid grid-cols-12 h-[49px]  gap-x-3">
                            <div className="col-span-5">
                                <a
                                    href={`tel:${data?.user?.phone}`}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-800 hover:to-cyan-800 w-full h-full rounded-lg flex flex-row justify-center items-center">
                                    <span className="text-white text-sm px-1">
                                        <span>
                                            تماس
                                        </span>
                                    </span>
                                    <CallSvg color={'#fff'}/>
                                </a>
                            </div>
                            {
                                (activePosts === undefined || activePosts?.length > 0) &&
                                <div className="col-span-7">
                                    <Link
                                        href={`/consultant/${data?.user?.id}`}
                                        className="border-2 w-full h-full border-primary bg-white hover:bg-custom-gray-200/5  flex flex-row justify-center items-center  rounded-lg">
                                    <span className="text-primary font-bold text-sm px-1">
                                        مشاهده پروفایل
                                    </span>
                                        <CircleProfileSvg/>
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>

                    {/* single property price */}
                    <div
                        className=" md:bg-[#E6F5EA] bg-primary  fixed bottom-0 right-0 w-full md:static  md:rounded-2xl z-30 box-shadow-1"
                    >
                        <div className="relative w-full h-full md:p-6 px-4 py-5">
                            {/*<div*/}
                            {/*    className="absolute top-2 left-2 bg-white w-14 h-9 flex flex-col items-center justify-center text-primary text-sm font-bold"*/}
                            {/*    style={{borderRadius: "15px 4px"}}*/}
                            {/*>*/}
                            {/*    فوری*/}
                            {/*</div>*/}
                            <div className={` ${+data.price !== 0 ? 'flex justify-between' : 'flex justify-between'}`}>
                                <h2 className="text-xl md:text-custom-green text-white">قیمت</h2>
                                <div className="flex flex-row gap-x-4 md:text-custom-green text-white">
                                    {
                                        +data.price !== 0 ?
                                            <>
                                               <span className="text-2xl font-bold">
                                                 {numberWithCommas(data?.price)}
                                               </span>
                                                <span className="text-lg">تومان</span>
                                            </>
                                            :
                                            <span className="text-xl font-bold ">
                                                    توافقی
                                                </span>

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SinglePropertyDetail;
