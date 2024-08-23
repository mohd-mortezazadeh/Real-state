import {NextPage} from "next";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import BlogCard from "../../components/blog-card/blogCard";
import Loading from "../../components/loading/Loading.component";
import SearchIcon from "../../components/svg/search/searchSvg";
import MainLayout from "../../layouts/mainLayout";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import CustomSelect from "../../components/select/CustomSelect";
import useArticles from "../../hooks/useArticles";
import {useRouter} from "next/router";
import queryString from "querystring";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import EmptyData from "../../components/empty-data/EmptyData";
import DirectSvg from "../../components/svg/direct/DirectSvg";

const path = [
    {
        name: "وبلاگ",
        url : "/blog-list"
    }
];


const sortOptions = [
    {
        name: 'جدیدترین',
        slug: 'desc'
    },
    {
        name: 'قدیمی ترین',
        slug: 'asc'
    }
]

const BlogList: NextPage = () => {

    const router = useRouter()
    const [page, setPage] = useState(1)

    const [seo, setSeo] = useState<any>('')

    const queries = queryString.stringify(router.query)

    const {
        isError,
        isLoading,
        results,
        hasNextPage,
        error
    } = useArticles(page, queries)


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

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])


    const content = results?.map((article: any, i: any) => {

        if (results.length === i + 1) {

            return (
                <div
                    key={article.id}
                    className="lg:col-span-4 md:col-span-6 col-span-12"
                >
                    <BlogCard data={article} ref={lastPostRef}

                    />
                </div>
            )

        }

        return <div
            key={article.id}
            className="lg:col-span-4 md:col-span-6 col-span-12"
        >
            <BlogCard data={article}

            />
        </div>

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
                            "name": "بلاگ ها",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }]
                        }
                `
        }
    }

    return (
        <MainLayout hasBanner={false}>

            <Head>

                <title> ویلا ارزان-بلاگ</title>
                <meta name='robots' content='index,follow'/>
                <meta name='googlebot' content='index,follow'/>
                <meta property="og:image" content={results[0]?.media[0].file}/>
                <meta property="og:type"/>
                {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                <meta property="og:title" content="ویلا ارزان"/>
                <meta property="og:site_name" content="ویلا ارزان"/>
                <meta property="og:locale" content="fa_IR"/>
                <meta property="og:brand" content="ویلا ارزان"/>
                <meta name="twitter:image" content={results[0]?.media[0].file}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="https://villaarzan.com/"/>
                <meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است"/>
                <meta name="twitter:title" content="ویلا ارزان"/>


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

            <Breadcrumb title={"وبلاگ ها"} subtitle={""} path={path}/>
            <div className="container mx-auto lg:max-w-screen-xl">
                <div className="grid grid-cols-12 gap-y-6 p-6 bg-white box-shadow-1 rounded-3xl mb-6">
                    <div
                        className="lg:col-span-6 col-span-12 flex flex-row items-center lg:justify-start justify-center ">
                        <div className="relative w-[320px] ">
                            <input
                                type="text"
                                placeholder="جستجو"
                                className="w-full bg-custom-gray-100 border-[0.8px] border-custom-gray-200/10 py-4 pr-10 rounded-lg placeholder:text-black placeholder:font-semibold"
                            />
                            <span className="absolute top-2 right-4">
                              <SearchIcon color="#000" width={19} height={39}/>
                            </span>
                        </div>
                    </div>
                    <div className="lg:col-span-6 col-span-12 flex flex-row items-center lg:justify-end justify-center">
                        <div className="w-[320px] ">
                            <CustomSelect options={sortOptions} name='sort' placeholder='مرتب سازی بر اساس'/>
                        </div>
                    </div>
                </div>


                {
                    isError ?
                        <p>
                            <>
                                {error.message}
                            </>
                        </p>
                        :
                        isLoading && page === 1 ?
                            <>
                                <div className="flex flex-row justify-center pt-8 ">
                                    <Loading/>
                                </div>
                            </>
                            :
                            results?.length > 0 ?
                                <>
                                    <div className="grid grid-cols-12 gap-x-5 gap-y-6 pb-20 ">
                                        {content}
                                    </div>
                                </>
                                :
                                <>
                                    <div
                                        className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                                        <EmptyData
                                            title={<div className='text-lg font-semibold'>بلاگی یافت نشد.</div>}
                                            hasButton={false}
                                            Icon={() => <DirectSvg/>
                                            }

                                        />
                                    </div>
                                </>

                }


                {
                    page > 1 && isLoading &&
                    <div className="flex flex-row justify-center pt-8">
                        <Loading/>
                    </div>
                }
                {/*<div className="pt-16">*/}
                {/*    <Loading />*/}
                {/*</div>*/}
            </div>
        </MainLayout>
    );
};

export default BlogList;
