import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import React, { useMemo, useState} from "react";
import MainLayout from "../../layouts/mainLayout";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import axios from "axios";
import ConsultantCard from "../../components/consultantCard/consultantCard";
import {useDebounce} from "../../hooks/useDebounce";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";


const path = [
    {
        name: "برترین مشاوران",
        url: "/best-advisor"
    }
];


const BestAdvisors: NextPage = ({best_advisors}: any) => {

    const router = useRouter()

    const [seo, setSeo] = useState<any>('')

    const [searchMsg, setSearchMsg] = useState('')

    const searchDebounced = useDebounce(searchMsg, 500)

    useMemo(() => {
        //fetch seo datas
        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])


    //
    //
    // const queries = queryString.stringify(router.query)


    return (
        <MainLayout hasBanner={false}>

            <Head>
                <meta name='robots' content='index,follow'/>
                <meta name='googlebot' content='index,follow'/>
                <meta property="og:image" content="https://villaarzan.com/img/landing-min.png"/>
                <meta property="og:type"/>
                {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                <meta property="og:title" content="ویلا ارزان"/>
                <meta property="og:site_name" content="ویلا ارزان"/>
                <meta property="og:locale" content="fa_IR"/>
                <meta property="og:brand" content="ویلا ارزان"/>
                <meta name="twitter:image" content="https://villaarzan.com/img/landing-min.png"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="https://villaarzan.com/"/>
                <meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است"/>
                <meta name="twitter:title" content="ویلا ارزان"/>
                <title>ویلا ارزان-بهترین مشاوران</title>

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

            </Head>

            <Breadcrumb title={"وبلاگ ها"} subtitle={""} path={path}/>
            <div className="container mx-auto lg:max-w-screen-xl">
                {/*<div className="grid grid-cols-12 gap-y-6 p-6 bg-white box-shadow-1 rounded-3xl mb-6">*/}
                {/*    <div*/}
                {/*        className="lg:col-span-6 col-span-12 flex flex-row items-center lg:justify-start justify-center ">*/}
                {/*        <div className="relative w-[320px] ">*/}
                {/*            <input*/}
                {/*                // value={searchMsg}*/}
                {/*                onChange={e => {*/}
                {/*                    router.push({*/}
                {/*                        pathname: router.pathname,*/}
                {/*                        query: `${queryString.stringify(router.query)}&q=${e.target.value}`*/}
                {/*                    })*/}
                {/*                }}*/}
                {/*                type="text"*/}
                {/*                placeholder="جستجو"*/}
                {/*                className="w-full bg-custom-gray-100 border-[0.8px] border-custom-gray-200/10 py-4 pr-10 rounded-lg placeholder:text-black placeholder:font-semibold"*/}
                {/*            />*/}
                {/*            <span className="absolute top-2 right-4">*/}
                {/*              <SearchIcon color="#000" width={19} height={39}/>*/}
                {/*            </span>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="lg:col-span-6 col-span-12 flex flex-row items-center lg:justify-end justify-center">*/}
                {/*        <div className="w-[320px] ">*/}
                {/*            <CustomSelect*/}
                {/*                handleChange={(val) => {*/}
                {/*                    router.push({*/}
                {/*                        pathname: router.pathname,*/}
                {/*                        query: `_order=id&_sort=${val?.slug}`*/}
                {/*                    })*/}
                {/*                }}*/}
                {/*                options={sortOptions} name='sort' placeholder='مرتب سازی بر اساس'/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}


                {

                    <>
                        <div className="grid grid-cols-12 gap-x-5 gap-y-6 pb-20 ">
                            {
                                best_advisors?.best_advisor.map((advisor: any) => {
                                    return <div
                                        key={advisor.id}
                                        className="lg:col-span-3 md:col-span-6 col-span-12"
                                    >
                                        <ConsultantCard data={advisor}

                                        />
                                    </div>
                                })
                            }
                        </div>
                    </>

                }

            </div>
        </MainLayout>
    );
};

export default BestAdvisors;


export const getServerSideProps: GetServerSideProps = async (context) => {

    const {query} = context

    const res = await axios.get(`https://api.villaarzan.com/best-advisor?${query}`)


    return {
        props: {
            best_advisors: JSON.parse(JSON.stringify(res?.data)),

        }
    }
}