import {GetServerSideProps,NextPage} from "next";
import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import Loading from "../../components/loading/Loading.component";
import PropertyCard from "../../components/property-card/PropertyCard";
import CircleCloseSvg from "../../components/svg/circle-close/CircleCloseSvg";
import FilterSvg from "../../components/svg/filter/FilterSvg";
import MainLayout from "../../layouts/mainLayout";
import useProperties from "../../hooks/useProperties";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import * as queryString from "querystring";
import {useRouter} from "next/router";
import SearchFilterBox from "../../components/searchFilterBox/SearchFilterBox";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import PropertyCardSkeleton from "../../components/property-card-skeleton/propertyCardSkeleton";


const path = [
    {
        name: "جست و جوی املاک",
        url : "/search"
    }
];

const ListProperty: NextPage = ({query} :any) => {

    const router = useRouter()
    const [seo, setSeo] = useState<any>('')

    // modal states
    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(1)

    const filpRef = useRef<HTMLDivElement>(null)


    const queries = queryString.stringify(query) || null


    const {
        isError,
        isLoading,
        results,
        hasNextPage,
        error
    } = useProperties(page, queries)

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

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])


    //after set a new query page must begin from 1
    useEffect(() => {
        setPage(1)
    }, [queries])
    // filp filter button useEffect handler


    useMemo(() => {
        // const target = document.querySelector(".filter-button-flipper ");

        filpRef?.current?.classList.toggle("rotates");
    }, [open]);


    if (isError){
        router.push('500')
    }


    //create post cards
    const content = results?.map((property: any, i: any) => {

        if (results.length === i + 1) {

            return <PropertyCard data={property} ref={lastPostRef}
                                 key={property.id}
                                 wide={true}/>

        }

        return <PropertyCard data={property} key={property.id} wide={true}/>

    })

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
                            "name": "جست و جوی املاک",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }
                `
        }
    }


    return (
        <MainLayout hasBanner={false}>

            <Head>

                <title>لیست املاک مازندران</title>

                <meta name='description' content={`لیست املاک مازندران `}/>
                <meta property="og:image" content={`${results[0]?.media?.thumbnail.file}`}/>
                <meta property="og:image:alt" content={`ویلا ارزان | خرید و فروش ملک`}/>
                <meta property="og:type"/>
                <meta name="robots" content="noindex" />


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

            <Breadcrumb title={"املاک"} subtitle={"درسریع ترین زمان ممکن املاک خود را پیدا کنید"} path={path}/>
            <div className='container  mx-auto lg:max-w-screen-xl'>
                {/* filter modal open in mobile size */}

                {
                    open && (
                        <div
                            className="fixed top-0 left-0 w-full h-full md:hidden overflow-hidden backdrop-blur-md z-30 pt-8 px-4 "
                            style={{backgroundColor: " rgba(79, 85, 251, 0.44)"}}
                        >
                            <SearchFilterBox setOpen={setOpen}/>
                        </div>
                    )}
                {/* filter button flipper */}
                <div
                    ref={filpRef}
                    className={`md:hidden block filter-button-flipper  bg-red-600 relative `}
                >
                    <div
                        className="flipFace bg-primary flex flex-col justify-center items-center"
                        onClick={(e) => setOpen(true)}
                    >
                        <FilterSvg/>
                    </div>
                    <div
                        className={`flipBack flex flex-col justify-center items-center bg-custom-red`}
                        onClick={(e) => setOpen(false)}
                    >
                        <CircleCloseSvg/>
                    </div>
                </div>


                {/* List property and filters wrapper */}
                <div className="pb-7">

                    {
                        query?.q &&
                        <div>
                            <span className='text-sm'>نتایج جست و جو برای : </span>
                            <span>{query?.q}</span>
                        </div>
                    }
                    {/*  List property & filters body */}
                    <div className="grid grid-cols-12 pt-4">
                        {/* filters */}
                        <div className="lg:col-span-3 md:col-span-4 hidden md:block ">
                            <SearchFilterBox/>
                        </div>

                        {/* Cards wrapper */}
                        <div className="lg:col-span-9 md:col-span-8 md:pr-10 col-span-12 px-4   relative">

                            {/* Properties */}

                            {

                                    results?.length > 0 ?
                                        <div className="space-y-6">
                                            {content}
                                        </div>
                                        : isLoading ?
                                            <div className="flex flex-col items-center gap-y-4 justify-center pt-8">
                                                {
                                                    [1,2,3,4].map((item: any)=>{
                                                        return(
                                                            <PropertyCardSkeleton key={item} wide={true}/>

                                                        )
                                                    })
                                                }
                                            </div>
                                            :
                                            <p>آگهی با این مشخصات یافت نشد!</p>
                            }

                            {/*Load More*/}
                            {
                                page > 1 && isLoading &&
                                <div className="flex flex-col items-center gap-y-4 justify-center pt-8">
                                    {
                                        [1,2,3,4].map((item: any)=>{
                                            return(
                                                <PropertyCardSkeleton key={item} wide={true}/>

                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};


export default ListProperty;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context
    // query._page = query._page || 1
    // const res = await publicAxios().get(`/post?_page=1&_limit=4`)


    return {
        props: {
           query : query
        }
    }
}


