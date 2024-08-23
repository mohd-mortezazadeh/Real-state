import {NextPageWithLayout} from "../../../_app";
import Router, {useRouter} from "next/router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useCategories from "../../../../hooks/useCategories";
import queryString from "querystring";
import useProperties from "../../../../hooks/useProperties";
import PropertyCard from "../../../../components/property-card/PropertyCard";
import MainLayout from "../../../../layouts/mainLayout";
import Breadcrumb from "../../../../components/breadcrumb/breadcrumb";
import ListPropertyFilterBox from "../../../../components/list-property-filterbox/ListPropertyFilterBox.components";
import FilterSvg from "../../../../components/svg/filter/FilterSvg";
import CircleCloseSvg from "../../../../components/svg/circle-close/CircleCloseSvg";
import Loading from "../../../../components/loading/Loading.component";
import {GetServerSideProps} from "next";
import useSections from "../../../../hooks/useSections";
import {publicAxios} from "../../../../services/axiosInstances/publicAxios";
import useCities from "../../../../hooks/useCities";
import AccordionFilter from "../../../../components/accordion-filter/accordionFilter";
import Head from "next/head";

const path = [
    {
        name: "املاک",
    }
];

const CategoryPage: NextPageWithLayout = ({query, sections, categoriesByCity}: any) => {

        const router = useRouter()

        // const {category} = router.query

        // modal states
        const [open, setOpen] = useState(false);

        const [path, setPath] = useState<any>()

        const [page, setPage] = useState(1)

        const [sectionData, setSectionData] = useState([])

        const {cities, isLoadingCities} = useCities()

        // const {categories, isLoadingCategories} = useCategories()


        const filpRef = useRef<HTMLDivElement>(null)


        const queries = queryString.stringify(query)


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

        //after set a new query page must begin from 1
        useEffect(() => {
            setPage(1)
        }, [queries])
        // filp filter button useEffect handler


        useMemo(() => {
            // const target = document.querySelector(".filter-button-flipper ");

            filpRef?.current?.classList.toggle("rotates");
        }, [open]);

        useEffect(() => {
            const response = publicAxios().get(`/section`).then((res) => {
                setSectionData(res.data)
            })
        }, [])


        //for breadcrumb path
        useEffect(() => {

            setPath([
                {
                    name: query.city === 'shomal' ? 'شمال' : cities.find((c: any) => c.slug === query?.city)?.name,
                    url: query.city === 'shomal' ? 'shomal' : cities.find((c: any) => c.slug === query?.city)?.slug
                },
                {
                    name: query.category === 'villa' ? 'ویلا' : categoriesByCity.find((c: any) => c.name === query?.category)?.display_name,
                    url: `${query.city === 'shomal' ? 'shomal' : cities.find((c: any) => c.slug === query?.city)?.slug}/${query.category === 'villa' ? 'villa' : categoriesByCity.find((c: any) => c.name === query?.category)?.name}`
                },
                {
                    name: sections.find((c: any) => c.slug === query?.section)?.name,
                    url: `${query.city === 'shomal' ? 'shomal' : cities.find((c: any) => c.slug === query?.city)?.slug}/${query.category === 'villa' ? 'villa' : categoriesByCity.find((c: any) => c.name === query?.category)?.name}/${sections.find((c: any) => c.slug === query?.section)?.slug}`
                }
            ])
        }, [cities, categoriesByCity])


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
                            "item": "https://villaarzan.com/${results[0]?.category?.city_slug}"  
                          },
                          {
                            "@type": "ListItem", 
                            "position": 3, 
                            "name": "${results[0]?.category?.display_name}",
                            "item": "https://villaarzan.com/${results[0]?.category?.city_slug}/${results[0]?.category?.name}"  
                          },
                          {
                            "@type": "ListItem", 
                            "position": 4, 
                            "name": "${results[0]?.section?.name}",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }
                          ]
                        }
                `
            }
        }


        // if (isError) return <p>Error : {error.message}</p>

        if (isError) {
            router.push('/500')
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

        if (sectionData.length > 0 && !sectionData.find((item: any) => item.slug === query.section)) {
            Router.replace('/')
            return <></>
        } else {
            return (
                <MainLayout hasBanner={false}>
                    <Head>

                        <meta name='robots' content='index,follow'/>
                        <meta name='googlebot' content='index,follow'/>
                        {
                            query.city === 'shomal' ?
                                <meta name='description' content={`لیست ${results[0]?.category?.display_name} مازندران `}/>
                                :
                                <meta name='description'
                                      content={`لیست ${results[0]?.category?.display_name} شهر ${results[0]?.category.city}`}/>
                        }
                        <meta property="og:image" content={`${results[0]?.media?.thumbnail.file}`}/>
                        <meta property="og:image:alt" content={`ویلا ارزان | خرید و فروش ملک`}/>
                        <meta property="og:type"/>
                        <meta property="og:type"/>
                        <meta name='owner' content="villaarzan | ویلا ارزان"/>
                        <meta name="author" content="villaarzan | ویلا ارزان"/>
                        <meta name="copyright" content="2022 © ویلاارزان"/>
                        <meta property="og:image:width" content="800"/>
                        <meta property="og:image:height" content="600"/>
                        <meta property="og:title" content={`ویلا ارزان | ${results[0]?.category?.display_name}`}/>
                        {
                            query.city === 'shomal' ?
                                <title>لیست {results[0]?.category?.display_name} مازندران</title>
                                :
                                <title>لیست {results[0]?.category?.display_name} شهر {results[0]?.category.city}</title>
                        }

                        <script type="application/ld+json" dangerouslySetInnerHTML={breadCrumbListJsonLd()}/>

                    </Head>

                    <Breadcrumb title={"املاک"} subtitle={"درسریع ترین زمان ممکن املاک خود را پیدا کنید"} path={path}/>

                    <div className="md:hidden grid grid-cols-12 md:p-0 px-4 space-y-3">

                        <div className="md:col-span-4 col-span-12">
                            <AccordionFilter active={query.city} name='city' title='شهر' data={cities}/>
                        </div>

                        <div className="md:col-span-4 col-span-12">
                            <AccordionFilter name='category' active={query.category} title='دسته بندی ملک'
                                             data={categoriesByCity}/>
                        </div>

                        <div className="md:col-span-4 col-span-12">
                            <AccordionFilter active={query.section} name='sections' title='محله' data={sections}/>
                        </div>
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
                                <div className="lg:col-span-3 md:col-span-4 hidden md:block space-y-5">
                                    <div
                                        className='space-y-5 sticky top-10 p-3 filter-box  overflow-auto h-[600px]  overflow-auto'>
                                        <AccordionFilter name='city' active={query.city} title='شهر' data={cities}/>

                                        <AccordionFilter name='category' active={query?.category} title='دسته بندی ملک'
                                                         data={categoriesByCity}/>

                                        <AccordionFilter active={query.section} name='sections' title='محله'
                                                         data={sections}/>

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
                                                <div className="flex flex-row justify-center pt-8">
                                                    <Loading/>
                                                </div>
                                                :
                                                <p>آگهی با این مشخصات یافت نشد</p>
                                    }

                                    {/*Load More*/}
                                    {
                                        page > 1 && isLoading &&
                                        <div className="flex flex-row justify-center pt-8">
                                            <Loading/>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            );
        }

    }


;


export default CategoryPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context


    const response = await publicAxios().get(`/section?city-name=${query.city}`)

    const categoriesByCity = await publicAxios().get(`/category?city=${query.city}`)

    return {
        props: {
            sections: response.data,
            query: query,
            categoriesByCity: categoriesByCity.data
        }
    }
}


