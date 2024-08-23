import {GetServerSideProps} from "next";
import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import ListPropertyFilterBox from "../../components/list-property-filterbox/ListPropertyFilterBox.components";
import PropertyCard from "../../components/property-card/PropertyCard";
import CircleCloseSvg from "../../components/svg/circle-close/CircleCloseSvg";
import FilterSvg from "../../components/svg/filter/FilterSvg";
import MainLayout from "../../layouts/mainLayout";
import useProperties from "../../hooks/useProperties";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import * as queryString from "querystring";
import {useRouter} from "next/router";
import {NextPageWithLayout} from "../_app";
import useCities from "../../hooks/useCities";
import AccordionFilter from "../../components/accordion-filter/accordionFilter";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import Head from "next/head";
import PropertyCardSkeleton from "../../components/property-card-skeleton/propertyCardSkeleton";
import ArrowUpSvg from "../../components/svg/arrows/arrow-up/arrowUpSvg";
import {BiChevronDown, BiChevronUp} from "react-icons/bi";


const CityPage: NextPageWithLayout = ({query, sections, categoriesByCity}: any) => {

        const router = useRouter()

        // modal states
        const [open, setOpen] = useState(false);

        const [page, setPage] = useState(1)

        const [seo, setSeo] = useState<any>('')

        const [isShowMore, setIsShowMore] = useState(false)

        const [pageLoad, setPageLoad] = useState(true)

        const {cities, isLoadingCities} = useCities()


        const filpRef = useRef<HTMLDivElement>(null!)

        const [path, setPath] = useState<any>([])


        useEffect(() => {
            //create url path for breadcrumb
            setPath([
                {
                    name: query.city === 'shomal' ? 'شمال' : cities.find((c: any) => c.slug === query?.city)?.name,
                    url: query.city === 'shomal' ? 'shomal' : cities.find((c: any) => c.slug === query?.city)?.slug
                }
            ])
        }, [cities, router])


        const queries = query.city === 'shomal' ? queryString.stringify(router.query!) : queryString.stringify(router.query!)


        const {
            isError,
            isLoading,
            results,
            hasNextPage,
            error
        } = useProperties(page, queries)

        const intObserver: any = useRef()


        //refrence of the last post that fetch in a request
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

        //after set a new query page must begin from 1
        useEffect(() => {
            setPage(1)
        }, [queries])
        // filp filter button useEffect handler


        useMemo(() => {

            //fetch seo data s
            const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.asPath}`)
                .then((res) => {
                    setSeo(res.data)
                })
                .catch(error => {
                    console.log(error)
                })


        }, [])

        useMemo(() => {
            // const target = document.querySelector(".filter-button-flipper ");

            filpRef?.current?.classList.toggle("rotates");
        }, [open]);


        if (isError) {
            console.log(error)
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
                            "name": "${results[0]?.category?.city}",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }]
                        }
                `
            }
        }


        //cities.length > 0 && !cities.find((item: any) => item.slug === query.city)
        if (false) {
            router.push('/')
            return <></>
        } else {
            return (
                <MainLayout hasBanner={false}>
                    <Head>
                        <meta name='robots' content='index,follow'/>
                        <meta name='googlebot' content='index,follow'/>
                        <meta name='owner' content="villaarzan | ویلا ارزان"/>
                        <meta name="author" content="villaarzan | ویلا ارزان"/>
                        <meta name="copyright" content="2022 © ویلاارزان"/>
                        <meta property="og:image:width" content="800"/>
                        <meta property="og:image:height" content="600"/>

                        <meta property="og:title" content={`ویلا ارزان | ${results[0]?.category?.city}`}/>
                        <meta property="og:site_name" content="ویلا ارزان"/>
                        <meta property="og:locale" content="fa_IR"/>
                        <meta name="twitter:image" content={`${results[0]?.media?.thumbnail.file}`}/>
                        <meta name="twitter:card" content="summary_large_image"/>
                        <meta name="twitter:site" content="https://villaarzan.com/"/>
                        {
                            query.city === 'shomal' ?
                                <meta name='description' content={`لیست املاک مازندران `}/>
                                :
                                <meta name='description' content={`لیست املاک شهر ${results[0]?.category.city}`}/>
                        }
                        <meta property="og:image" content={`${results[0]?.media?.thumbnail.file}`}/>
                        <meta property="og:image:alt" content={`ویلا ارزان | خرید و فروش ملک`}/>
                        <meta property="og:type"/>

                        {
                            query.city === 'shomal' ?
                                <title>لیست املاک مازندران</title>
                                :
                                <title>لیست املاک شهر {results[0]?.category.city}</title>
                        }


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
                    {
                        path.length > 0 &&
                        <Breadcrumb title={path[0]?.name} subtitle={"درسریع ترین زمان ممکن املاک خود را پیدا کنید"}
                                    path={path}/>
                    }

                    <div className="md:hidden grid grid-cols-12 md:p-0 px-4 space-y-3">

                        <div className="md:col-span-4 col-span-12">
                            <AccordionFilter active={query.city} name='city' title='شهر' data={cities}/>
                        </div>

                        <div className="md:col-span-4 col-span-12">
                            <AccordionFilter name='category' active={query.category} title='دسته بندی ملک'
                                             data={categoriesByCity}/>
                        </div>

                        {sections.length > 0 &&
                            <div className="md:col-span-4 col-span-12">
                                <AccordionFilter name='sections' title='محله' data={sections}/>
                            </div>
                        }
                    </div>

                    <div className='container  mx-auto lg:max-w-screen-xl'>
                        {/* filter modal open in mobile size */}

                        {open && (
                            <div
                                className="fixed top-0 left-0 w-full h-full md:hidden overflow-hidden backdrop-blur-md z-30 pt-8 px-4 "
                                style={{backgroundColor: " rgba(79, 85, 251, 0.44)"}}
                            >
                                <ListPropertyFilterBox setOpen={setOpen}/>
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
                            {/*  List property & filters body */}
                            <div className="grid grid-cols-12 pt-4">
                                {/* filters */}
                                <div className="lg:col-span-3  md:col-span-4 hidden md:block space-y-5">
                                   <div className='space-y-5 sticky top-10 p-3 filter-box  overflow-auto h-[600px]  overflow-auto'>
                                       <AccordionFilter name='city' active={query.city} title='شهر' data={cities}/>
                                       {/*cityBox & category Box */}
                                       <AccordionFilter name='category' active={query?.category} title='دسته بندی ملک'
                                                        data={categoriesByCity}/>

                                       {
                                           sections.length > 0 &&
                                           <AccordionFilter name='sections' title='محله' data={sections}/>
                                       }

                                       <ListPropertyFilterBox/>
                                   </div>
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
                                                        [1, 2, 3, 4].map((item: any) => {
                                                            return (
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
                                                [1, 2, 3, 4].map((item: any) => {
                                                    return (
                                                        <PropertyCardSkeleton key={item} wide={true}/>

                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </div>

                            </div>

                            {
                                seo?.content?.length > 0 ?
                                    isShowMore ?
                                        <>
                                            <div
                                                className='prose mt-16 lg:prose-lg prose-h1:text-2xl prose-h2:text-xl prose-img:!w-full lg:prose-img:!w-64 prose-img:rounded-md prose-img:!h-64 prose-img:object-cover prose-h1:font-bold prose-h2:font-bold mx-auto max-w-2xl'
                                                dangerouslySetInnerHTML={{__html: seo?.content[0].body}}
                                            />
                                            <div className='text-center flex items-center justify-center'>
                                                <button className='' onClick={() => setIsShowMore(false)}>نمایش
                                                    کمتر
                                                </button>
                                                <BiChevronUp className='w-6 h-6'/>
                                            </div>
                                        </>

                                        :
                                        <div className='relative'>
                                            <div
                                                className='prose mt-16 lg:prose-lg prose-h1:text-2xl prose-h2:text-xl prose-img:!w-full lg:prose-img:!w-64 prose-img:rounded-md prose-img:!h-64 prose-img:object-cover prose-h1:font-bold prose-h2:font-bold mx-auto max-w-2xl
                                                 gradient'
                                                dangerouslySetInnerHTML={{__html: seo?.content[0].body.substring(0, 600)}}
                                            />

                                            <div className='relative text-center flex items-center justify-center -mt-4'>
                                                <button className='' onClick={() => setIsShowMore(true)}>نمایش
                                                    بیشتر
                                                </button>
                                                <BiChevronDown className='w-6 h-6'/>
                                            </div>
                                        </div>
                                    :
                                    null
                            }


                        </div>
                    </div>
                </MainLayout>
            );
        }
    }


;


export default CityPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context

    let response
    let categoriesByCity
    if (query?.city === 'shomal') {
        response = await publicAxios().get(`/section?city-name=${query.city}`)
        categoriesByCity = await publicAxios().get(`/category`)
    } else {

        response = await publicAxios().get(`/section?city-name=${query.city}`)
        categoriesByCity = await publicAxios().get(`/category?city=${query.city}`)
    }


    return {
        props: {
            query: query,
            sections: response.data,
            categoriesByCity: categoriesByCity?.data
        }
    }
}


