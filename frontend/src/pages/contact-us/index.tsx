import React, {useMemo, useState} from "react";

import {NextPage} from "next";

import MainLayout from "../../layouts/mainLayout";

import CallSvg from "../../components/svg/call/CallSvg";
import LocationSvg from "../../components/svg/location/LocationSvg";
import ShareSvg from "../../components/svg/share/ShareSvg";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import * as Yup from 'yup';
import {useFormik} from "formik";
import {privateAxios} from "../../services/axiosInstances/privateAxios";
import toast from "react-hot-toast";
import Button from "../../components/button/button";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";
import {useRouter} from "next/router";
import {BsTelegram, BsWhatsapp} from "react-icons/bs";

const path = [
    {
        name: 'ارتباط با ما',
        url : "/contact-us"
    },
]

const ContactUs: NextPage = () => {

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [seo, setSeo] = useState<any>('')

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })

    }, [])

    //contact us dorm submit and validation
    const formik = useFormik({
        initialValues: {
            fullname: '',
            phone: '',
            email: '',
            content: ''
        },
        validationSchema: Yup.object({
            fullname: Yup.string()
                .required('نام خود را وارد نمایید'),
            email: Yup.string()
                .email('ایمیل معتبر وارد نمایید')
                .required('ایمیل خود را وارد نمایید.'),
            phone: Yup.string()
                .required('شماره تماس را وارد نمایید'),
            content: Yup.string()
                .min(10, 'حداقل مقدار مجاز پیام 10 کاراکتر میباشد')
                .required('پیام خود را وارد نمایید')
        }),
        onSubmit: function (values, formikHelpers) {
            setLoading(true)
            privateAxios().post('/contact/', values)
                .then(() => {
                    formik.resetForm()
                    setLoading(false)
                    toast.success('پیام شما با موفقیت ارسال شد')
                })
                .catch((err) => {
                    formik.resetForm()
                    setLoading(false)
                    toast.error('خطایی در ارسال پیام رخ داده است')
                })
        }
    })


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
                            "name": "ارتباط با ما",
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
                            "name": "ویلا ارزان | ارتباط با ما",
                            "url" : "https://villaarzan.com/contact-us"
                         }
                `
        }
    }

    return (
        <MainLayout hasBanner={false}>

            <Head>
                <title>ویلا ارزان- ارتباط با ما</title>
                <meta property="og:image" content="https://villaarzan.com/img/landing-min.png"/>
                <meta property="og:type"/>
                <meta property="og:title" content="ویلا ارزان"/>
                <meta property="og:site_name" content="ویلا ارزان"/>
                <meta property="og:brand" content="ویلا ارزان"/>
                <meta name="twitter:image" content="https://villaarzan.com/img/landing-min.png"/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="https://villaarzan.com/"/>
                <meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است"/>
                <meta name="twitter:title" content="ویلا ارزان"/>
                <meta name='owner' content="villaarzan | ویلا ارزان"/>
                <meta name="author" content="villaarzan | ویلا ارزان" />
                <meta name="copyright" content="2022 © ویلاارزان"/>
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="600" />
                <meta property="og:title" content={`ویلا ارزان | تماس با ما`}/>
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

                <script type="application/ld+json" dangerouslySetInnerHTML={localBusinessJsonLd()}/>
                <script type="application/ld+json" dangerouslySetInnerHTML={breadCrumbListJsonLd()}/>

                <script type="application/ld+json" dangerouslySetInnerHTML={webPageJsonLd()}/>

            </Head>

            <Breadcrumb title="ارتباط با ما" subtitle=" با ما در ارتباط باشید" path={path}/>

            <div className="container mx-auto lg:max-w-screen-xl">
                <div className="grid grid-cols-12 gap-x-7 pb-10 gap-y-7">
                    {/* contact form */}
                    <div
                        className="md:col-span-4 col-span-12 bg-white rounded-2xl md:p-8 p-4 space-y-6 md:order-1 order-2"
                        style={{boxShadow: "0px 4px 30px rgba(0, 38, 84, 0.11)"}}
                    >
                        {/* title */}
                        <div className="text-right text-xl font-bold text-text">
                            فرم ارتباط با ما
                        </div>

                        {/* form */}
                        <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
                            <div className="flex flex-col gap-y-3">
                                <label className="text-base font-medium flex items-center">
                                    <span> نام و نام خانوادگی</span>
                                    <span className='text-custom-red'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formik.values.fullname}
                                    name='fullname'
                                    onChange={formik.handleChange}
                                    className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-sm font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                                    placeholder="نام نام خانوادگی خود را وارد کنید"
                                />
                                <span className='text-red-400'>{formik.errors.fullname}</span>
                            </div>
                            <div className="flex flex-col gap-y-3">
                                <label className="text-base font-medium">
                                    <span>ایمیل</span>
                                    <span className='text-custom-red'>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formik.values.email}
                                    name='email'
                                    onChange={formik.handleChange}
                                    className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-sm font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                                    placeholder="ایمیل خود را وارد کنید"
                                />
                                <span className='text-red-400'>{formik.errors.email}</span>
                            </div>
                            <div className="flex flex-col gap-y-3 pb-3">
                                <label className="text-base font-medium">شماره تماس</label>
                                <input
                                    value={formik.values.phone}
                                    name='phone'
                                    onChange={formik.handleChange}
                                    type="text"
                                    className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-sm font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                                    placeholder="شماره تماس خود را وارد کنید"
                                />
                                <span className='text-red-400'>{formik.errors.phone}</span>
                            </div>
                            <div className="flex flex-col gap-y-3">
                                <label className="text-base font-medium">
                                    <span>پیام</span>
                                    <span className='text-custom-red'>*</span>
                                </label>
                                <textarea
                                    value={formik.values.content}
                                    name='content'
                                    onChange={formik.handleChange}
                                    className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-sm font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                                    placeholder=" پیام خود را وارد کنید"
                                    rows={7}
                                />
                                <span className='text-red-400'>{formik.errors.content}</span>
                            </div>
                            <div className="  gap-y-3">
                                <Button loading={loading} title="ارسال" width='w-full' bgcolor='bg-primary'
                                        buttonClassName=' w-full hover:bg-blue-800 transition-all duration-300'/>
                            </div>
                        </form>
                    </div>

                    {/* contact info card */}
                    <div
                        className="md:col-span-8 col-span-12 bg-white rounded-xl md:order-2 order-1"
                        style={{boxShadow: "0px 4px 30px rgba(0, 38, 84, 0.11)"}}
                    >
                        {/* image */}
                        <div className="px-6 py-4">
                            <img
                                src="images/header-banner.png"
                                className="w-full h-[320px] rounded-3xl"
                            />
                        </div>

                        {/* address */}
                        <div className="p-6 border-b-[0.8px] border-b-custom-gray-200/10 ">
                            <div className="text-justify break-words leading-10">
                                <h4 className="flex mb-3">
                                    <LocationSvg width={23} height={23}/>
                                    <span className="mr-4  text-xl font-bold">آدرس دفتر</span>
                                </h4>
                                تهران
                            </div>
                        </div>

                        {/* support */}
                        <div
                            className="p-6 flex flex-row flex-wrap items-center border-b-[0.8px] border-b-custom-gray-200/10 gap-y-6">
                            <CallSvg color="#005ADC"/>
                            <span className="mr-4  text-xl font-bold ml-6">پشتیبانی</span>
                            <div className="flex flex-row flex-wrap items-center gap-x-8 gap-y-6  pt-2">
                                <span className="text-xl font-medium"><a href="tel:09372484823">09199575689</a></span>

                            </div>
                        </div>

                        {/* social media */}
                        <div
                            className="p-6 flex flex-row flex-wrap items-center border-b-[0.8px] border-b-custom-gray-200/10 gap-y-6">
                            <ShareSvg/>
                            <span className="mr-4  text-xl font-bold ml-6">
                شبکه اجتماعی
              </span>
                            <div className="flex flex-row items-center gap-x-6">
                                <a  href="https://wa.me/qr/X6WQUX2N4MOEM1">
                                    <BsWhatsapp className='w-5 h-5 text-green-500 cursor-pointer'/>
                                </a>
                                {/*<a href="https://linkedin.com">*/}
                                {/*    <LinkedinSvg/>*/}
                                {/*</a>*/}
                                {/*<a href="https://twitter.com">*/}
                                {/*    <TwitterSvg/>*/}
                                {/*</a>*/}
                                <a className='flex items-center gap-x-2' href="https://t.me/villaa_arzan">
                                    <BsTelegram color="#005adc" className='w-5 h-5 cursor-pointer'/>
                                    {/*<span>villaa_arzan@</span>*/}
                                </a>
                            </div>
                        </div>

                        {/* email */}
                        <div className="p-6 flex flex-row flex-wrap items-center  gap-y-6">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                                    stroke="blue"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M7 8H17"
                                    stroke="blue"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M7 13H13"
                                    stroke="blue"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                            <span className="mr-4  text-xl font-bold ml-6">ایمیل</span>
                            <div className="flex flex-row items-center gap-x-8">
                                <span className="text-xl font-medium"> Villaarzan.mazandaran@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContactUs;
