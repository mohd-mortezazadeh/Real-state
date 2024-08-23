import { NextPage } from "next";
import React,{ useMemo,useState } from "react";
import CallSvg from "../../components/svg/call/CallSvg";
import MainLayout from "../../layouts/mainLayout";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import Head from "next/head";
import { publicAxios } from "../../services/axiosInstances/publicAxios";
import { useRouter } from "next/router";
import Link from "next/link";

const path = [
    {
        name: 'درباره ما',
        url: 'about-us'
    }
]

const AboutUs: NextPage = () => {

    const router = useRouter()

    const [seo,setSeo] = useState<any>('')

    useMemo(() => {

        publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                if(res)
                    setSeo(res?.data)
            })
            .catch(error => {
                console.log("error 2222 : ",error)
            })

    },[])

    const localBusinessJsonLd = () => {
        return {
            __html: `
                               {
                      "@context": "https://schema.org",
                      "@type": "LocalBusiness",
                      "name": "ویلا ارزان",
                      "image": "https://villaarzan.com/img/landing-min.png",
                      "@id": "",
                      "url": "https://villaarzan.com/contact-us",
                      "telephone": "09199575689",
                      "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "",
                        "addressLocality": "تهران",
                        "postalCode": "",
                        "addressCountry": "IR"
                      } ,
                      "sameAs": "https://villaarzan.com" 
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
                            "name": "درباره ما",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }]
                        }
                `
        }
    }

    const webPageJsonLd = () => {
        return {
            __html: `
                         {
                            "@context": "https://schema.org/",
                            "@type": "WebPage",
                            "name": "ویلا ارزان | درباره ما",
                            "url" : "https://villaarzan.com/about-us"
                         }
                `
        }
    }

    return (
        <MainLayout hasBanner={false}>

            <Head>

                <meta property="og:image" content="https://villaarzan.com/img/landing-min.png" />
                <meta property="og:type" />
                <meta property="og:title" content="ویلا ارزان" />
                <meta property="og:site_name" content="ویلا ارزان" />
                <meta property="og:brand" content="ویلا ارزان" />
                <meta name="twitter:image" content="https://villaarzan.com/img/landing-min.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="https://villaarzan.com/" />
                <meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است" />
                <meta name="twitter:title" content="ویلا ارزان" />
                <meta property="og:image:alt" content={`ویلا ارزان | خرید و فروش ملک`} />
                <meta property="og:type" />
                <meta name='owner' content="villaarzan | ویلا ارزان" />
                <meta name="author" content="villaarzan | ویلا ارزان" />
                <meta name="copyright" content="2022 © ویلاارزان" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="600" />
                <meta property="og:title" content={`ویلا ارزان | درباره ما`} />
                <title>ویلا ارزان- درباره ما</title>

                {
                    seo?.meta?.map((item: any,index: any) => {
                        if(item.name && !item.property_type) {
                            return <meta key={item.id} name={item.name} content={item.content} />
                        } else if(!item.name && item.property_type) {
                            return <meta key={item.id} property={item.property_type} content={item.content} />
                        }
                    })
                }

                {
                    seo?.schima?.map((item: any,index: any) => {
                        return <script key={item.id} type="application/ld+json" dangerouslySetInnerHTML={
                            {
                                __html: item.content
                            }
                        } />
                    })
                }

                {
                    seo?.canonical?.length > 0 && seo?.canonical[0].url ?
                        <link rel='canonical' href={seo?.canonical[0].url} />
                        :
                        <link rel='canonical' href={`https://villaarzan.com${router.asPath}`} />

                }

                <script type="application/ld+json" dangerouslySetInnerHTML={localBusinessJsonLd()} />

            </Head>

            {/* wrapper */}
            <Breadcrumb title={"درباره ما"} subtitle={"درباره ویلا ارزان بیشتر بدونید"} path={path} />
            <div className="container mx-auto lg:max-w-screen-xl">
                <div className="grid grid-cols-12  gap-x-5 gap-y-10 pb-8">
                    {/* about us card */}
                    <div
                        className="md:col-span-7 order-2 md:order-1 col-span-12 py-11 md:pr-11 md:pl-20 px-7 bg-white rounded-3xl space-y-4"
                        style={{ boxShadow: "0px 4px 30px rgba(0, 38, 84, 0.11)" }}
                    >
                        {/* title */}
                        <div className="md:text-right text-center font-bold text-2xl text-text">
                            درباره ویلا ارزان
                        </div>

                        {/* description */}
                        <p className="text-justify flex flex-col text-lg text-custom-gray-200 leading-[46px]">

                            <span> با توجه به اینکه صنعت و حرفه مشاورین املاک از دیرباز در کشورمان سابقه دارد، با عنایت به رشد جمعیت و گسترش شهرها، نیاز به ایجاد ساختاری حرفه‌ای و مدرن و امروزی در این راستا به چشم می‌خورد که متاسفانه غالبا امروزه ارائه چنین خدمات حرفه‌ای در این صنعت کمتر مشاهده می‎‌گردد.</span>
                            <span>
                                لذا اهداف اصلی این مجموعه بر اساس اصول زیر طراحی و تبیین شده است:

                                ارائه سرویس‌های لازم به مشتریان محترم جهت هر گونه معاملات ملکی با روش‌های نوین امروزی و با عنایت به حفظ کرامات انسانی مشتریان محترم بر پایه رعایت اصول مشتری مداری.
                                ارائه خدمات مشاوره‌ای فنی به مشتریان محترم.
                            </span>
                            <span>
                                شعار سازمانی:
                                ما به جزئیات خواسته های مشتریانمان اهمیت ویژه ای می دهیم .
                            </span>
                        </p>

                        {/* connect us bottom */}
                        <div className="flex flex-row justify-center items-center">
                            <Link href='./contact-us'
                                className="bg-primary hover:bg-blue-800 transition-all duration-200 px-4 py-3 relative flex flex-row justify-center items-center gap-x-2 rounded-lg md:w-auto w-full">
                                <CallSvg color="#fff" />
                                <span className="text-base font-semibold text-white">
                                    ارتباط با ما
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* image wrapper */}
                    <div className="md:col-span-5 col-span-12 order-1 md:order-2">
                        {/* image body (sticky) */}
                        <div className="w-full sticky top-3 ">
                            {/* image */}
                            <img
                                src="images/header-banner.png"
                                className="rounded-3xl h-[342px] w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AboutUs;
