import {GetServerSideProps, NextPage} from "next";
import MainLayout from "../../layouts/mainLayout";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import StarSvg from "../../components/svg/star/StarSvg";
import Divider from "../../components/divider/Divider.component";
import Loading from "../../components/loading/Loading.component";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/router";
import queryString from "querystring";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "../../components/property-card/PropertyCard";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import Rating from "../../components/rating/Rating";
import {getRating, putRating} from "../../services/api/rating";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'




const Consultant: NextPage = ({query} : any) => {

    const router = useRouter()



    const [page, setPage] = useState(1)

    const [seo, setSeo] = useState<any>('')

    const [rating, setRating] = useState<number | null>(null)

    const filpRef = useRef<HTMLDivElement>(null)


    const {
        isError,
        isLoading,
        results,
        hasNextPage,
        error
    } = useProperties(page , queryString.stringify(query))


    const path = [
        {
            name: `${results[0]?.user?.fullname}`,
            url: `/consultant/${results[0]?.user?.id}`
        }
    ];

    const intObserver: any = useRef()

    const lastPostRef = useCallback((property: { isIntersecting: any; }[]) => {

        if (isLoading) return
        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(properties => {
            if (properties[0]?.isIntersecting && hasNextPage) {
                setPage(prev => prev + 1)
            }
        })

        if (property) intObserver.current.observe(property)
    }, [hasNextPage, isLoading])


    // useEffect(() => {
    //     setPage(1)
    // }, [queries])

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                setSeo(res?.data)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])

    //create post cards
    const content = results?.map((property: any, i: any) => {

        if (results.length === i + 1) {

            return <div key={property.id} className="lg:col-span-4 md:col-span-8 md:pr-10 col-span-12 px-4 relative">
                <PropertyCard data={property} ref={lastPostRef}
                              wide={false}/>
            </div>

        }

        return <div key={property.id} className="lg:col-span-4 md:col-span-8 md:pr-10 col-span-12 px-4 relative">
            <PropertyCard data={property} key={property.id} wide={false}/>
        </div>

    })


    const handleRating = (rate: number) => {
        setRating(rate)
        putRating(rate, results[0]?.user?.id)
            .then((res) => {
                toast.success(res?.detail)
            })
            .catch((error) => {
                console.log(error)
                if(error.response.status === 403){
                    toast.error(error.response.data.detail)
                }
            })
    }


    useEffect(() => {

        results.length > 0 && getRating(results[0]?.user?.id)
            .then((res)=>setRating(res?.rating))
    }, [results[0]?.user?.id ,rating])


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
                            "name": "${results[0]?.user?.fullname}",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }]
                        }
                `
        }
    }

    return (
        <MainLayout hasBanner={false}>

            <Head>
                <meta name='robots' content='index,follow'/>
                <meta name='googlebot' content='index,follow'/>
                <meta property="og:image" content={results[0]?.avatar?.file}/>
                <meta property="og:type"/>
                {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                <meta property="og:title" content={`${results[0]?.user?.fullname} | ویلا ارزان`}/>
                <meta property="og:site_name" content="ویلا ارزان"/>
                <meta property="og:locale" content="fa_IR"/>
                <meta property="og:brand" content="ویلا ارزان"/>
                <meta name="twitter:image" content={results[0]?.avatar?.file}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="https://villaarzan.com/"/>
                <meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است"/>
                <meta name="twitter:title" content={`${results[0]?.user?.fullname} | ویلا ارزان`}/>
                <title> {results[0]?.user?.fullname} | ویلا ارزان</title>


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

                <script type="application/ld+json" dangerouslySetInnerHTML={breadCrumbListJsonLd()}/>

            </Head>
            <Breadcrumb title={"مشاور"} subtitle={"مشاور هایی که در ویلا ارزان فعالیت میکنند"} path={path}/>
            <div className="container mx-auto lg:max-w-screen-xl px-4">
                {/* consultant profile card */}
                {
                    isLoading && page === 1 ?
                        <SkeletonTheme baseColor="#b5b5b5" highlightColor="#efefef" borderRadius={5}  >
                           <div className='p-4 w-full flex flex-col md:flex-row gap-6 items-center justify-between bg-white box-shadow-3 rounded-lg p-16 my-12'>
                               <div className='w-24 h-24 '>
                                 <Skeleton circle={true} className='w-full h-full' />
                               </div>
                               <div className='flex flex-col gap-6'>
                                   <h2>
                                       <Skeleton width={130} height={15}/>
                                   </h2>
                                   <span>
                                        <Skeleton width={80} height={10}/>
                                   </span>
                               </div>

                               <div className='flex flex-col gap-6'>
                                   <h2>
                                       <Skeleton width={80} height={10}/>
                                   </h2>
                                   <span>
                                        <Skeleton width={100} height={10}/>
                                   </span>
                               </div>

                               <div className='flex flex-col gap-6'>
                                   <h2>
                                       <Skeleton width={80} height={10}/>
                                   </h2>
                                   <span>
                                       <Skeleton width={100} height={10}/>
                                   </span>
                               </div>

                               <div className='flex flex-col gap-6'>
                                   <h2>
                                       <Skeleton width={80} height={10}/>
                                   </h2>
                                   <span>
                                        <Skeleton width={100} height={10}/>
                                   </span>
                               </div>
                           </div>
                        </SkeletonTheme>
                        :
                        (results.length > 0) ?
                            <div
                                className="bg-white box-shadow-1 md:rounded-3xl  mb-20 w-full relative overflow-y-hidden">
                                {/* star absolute in md and more */}
                                <div className="absolute top-4 left-4">
                                    <div
                                        className="md:flex hidden flex-row  items-center gap-x-2 bg-custom-gold rounded-lg p-2 text-white">
                                        <StarSvg/>
                                        <span className="text-sm">{results[0]?.user?.rating_avg?.toFixed(1)}</span>

                                    </div>
                                </div>

                                {/* profile info wrapper */}
                                <div className="grid grid-cols-12 px-8 py-6 gap-y-9 mt-10">
                                    {/* image and title and role */}
                                    <div
                                        className="col-span-12 lg:col-span-4 md:col-span-6  flex md:flex-row flex-col md:justify-start justify-center md:items-start items-center  gap-x-4 gap-y-8 ">
                                        {/* profile image wrapper */}
                                        <div className="md:static relative ">
                                            {/* image */}
                                            <figure className='w-[100px] h-[100px] rounded-full overflow-hidden'>
                                                <img
                                                    src={results[0]?.user?.avatar?.file}
                                                    className="w-full h-full"
                                                />
                                            </figure>
                                            {/* star in profile show just in mobile */}
                                            <div className="md:hidden block absolute -bottom-3 right-[30%]">
                                                <div
                                                    className="flex md:hidden  items-center gap-x-2 bg-custom-gold rounded-lg px-1 py-2 text-white">
                                                    <StarSvg/>
                                                    <span className="text-sm">{results[0]?.user?.rating_avg?.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* title and role */}
                                        <div className="flex flex-col gap-y-5">
                                            <span className="text-2xl font-bold text-text text-center">
                                                {
                                                    results[0]?.user?.fullname
                                                }
                                            </span>
                                            <span className="text-xl font-medium text-text md:text-right text-center">
                                            {
                                                results[0]?.user?.role?.display_name
                                            }
                                            </span>
                                        </div>


                                    </div>

                                    {/* bio */}

                                    {/* contact info */}
                                    <div
                                        className="lg:col-span-8 md:col-span-8 col-span-12 w-full flex md:flex-row flex-col md:justify-start md:gap-x-40 justify-center md:items-start items-center gap-y-16 ">
                                        <div className="flex flex-col gap-y-5 ">
                                            <span className="text-xl font-medium md:text-right text-center">
                                                شماره تماس
                                            </span>
                                            <span className="text-xl font-bold">
                                                {
                                                    results[0]?.user?.phone
                                                }
                                            </span>
                                        </div>
                                        {
                                            results[0]?.user?.company_name?.name &&
                                            <div className="flex flex-col gap-y-5 ">
                                            <span className="text-xl font-medium md:text-right text-center">
                                            زیر مجموعه
                                            </span>
                                                <span className="text-xl font-bold">
                                            {
                                                results[0]?.user?.company_name?.name
                                            }
                                            </span>
                                            </div>
                                        }
                                        <div className="flex flex-col gap-y-5 ">
                                            <p className="text-xl font-medium md:text-right text-center">
                                                <span>امتیاز دادن </span>
                                                <span className='text-sm'>( {results[0]?.user?.rating_count} رأی)</span>
                                            </p>
                                            <div className="flex flex-row gap-x-2">
                                                {/*<img src="/images/static-stars.svg"/>*/}
                                                <Rating count={5} rating={rating}
                                                        color={{filled: '#FFD100', unFilled: '#737373'}}
                                                        onRating={handleRating}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className='px-12 mb-4 flex justify-center items-center gap-x-6'>

                                    {
                                        results[0]?.user?.user_meta?.length > 0 &&
                                        results[0]?.user?.user_meta?.filter((item: any) => item.key === 'telegram' || item.key === 'instagram').map((item: any) => {
                                            return <div key={item.id}>
                                                <span className='text-lg'>
                                                    {
                                                        item?.key === 'telegram' ?
                                                            <span>تگرام : </span> : item?.key === 'instagram' &&
                                                            <span>اینستاگرام : </span>
                                                    }
                                                </span>
                                                <span className='font-bold' dir='ltr'>
                                                    {item?.value}
                                                </span>
                                            </div>
                                        })
                                    }
                                </div>

                                {/* contact infor and stars rating */}

                                {
                                    results[0]?.user?.user_meta?.length > 0 && results[0]?.user?.user_meta?.find((item: any) => {
                                        return item?.key === 'description'
                                    })?.value &&
                                    <div className="grid grid-cols-12 bg-primary/10 md:p-8 p-10 w-full gap-y-16">

                                        <div className="col-span-12  flex flex-col  gap-y-4">
                                            <div className="text-2xl font-bold text-text md:text-right text-center">
                                                درباره من
                                            </div>
                                            <p className="text-xl font-medium text-text leading-[32px] text-justify">
                                                {
                                                    results[0]?.user?.user_meta.find((item: any) => {
                                                        return item?.key === 'description'
                                                    }).value
                                                }
                                            </p>
                                        </div>

                                    </div>
                                }
                            </div>
                            :
                            <p className='my-8'>
                                کاربری یافت نشد
                            </p>
                }

                {/* divider */}
                <div className="mb-8">
                    <Divider path='' hasShowMore={false} title="املاک به اشتراک گذاشته شده"/>
                </div>

                {/* consultant's properties */}
                <div className="grid grid-cols-12 gap-x-5 gap-y-6 pb-20 ">
                    {
                        isError ?
                            <p>
                                <>
                                    {error.message}
                                </>
                            </p>
                            :
                            isLoading && page === 1 ?
                                <div className="flex flex-row justify-center pt-8">
                                    <Loading/>
                                </div>
                                : results?.length > 0 ?
                                    <>
                                        {content}
                                    </>

                                    :
                                    <p>آگهی با این مشخصات یافت نشد!</p>
                    }

                </div>

                {/* loading */}
                {
                    page > 1 && isLoading &&
                    <div className="flex flex-row justify-center pt-8">
                        <Loading/>
                    </div>
                }
            </div>
        </MainLayout>
    );
};

export default Consultant;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const {query} = context

    return {
        props: {
           query : query
        }
    }
}
