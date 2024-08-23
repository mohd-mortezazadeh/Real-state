import MainLayout from "../layouts/mainLayout";
import { NextPageWithLayout } from "./_app";
import { GetStaticProps } from 'next'
import Head from "next/head";
import Divider from "../components/divider/Divider.component";
import PropertyCard from "../components/property-card/PropertyCard";
import MobileSimilarPropertiesList
    from "../components/similar-properties-list/mobile/MobileSimilarPropertiesList.component";
import React,{ useMemo,useState } from "react";
import NavigationBar from "../components/navigation-bar/navigationBar";
import CityCard from "../components/city-card/cityCard";
import { Swiper,SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay"
import AddIcon from "../components/svg/add/addSvg";
import BlogCard from "../components/blog-card/blogCard";
import { publicAxios } from "../services/axiosInstances/publicAxios";
import axios,{ AxiosResponse } from "axios";
import Link from "next/link";
import useCities from "../hooks/useCities";
import ConsultantCard from "../components/consultantCard/consultantCard";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { getVipProperties } from "../services/api/property";
import { privateAxios } from "../services/axiosInstances/privateAxios";


const Home: NextPageWithLayout = ({ properties,blogs,best_advisors,counters,best_realtors,vip }: any) => {


    const [seo,setSeo] = useState<any>('')

    const router = useRouter()

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })


    },[])


    const { user,loading,error } = useAuth()

    // if (isError) return <p>Error : {error.message}</p>
    const { cities,isLoadingCities } = useCities()

    const webPageJsonLd = () => {
        return {
            __html: `
                         {
                            "@context": "https://schema.org/",
                            "@type": "WebPage",
                            "name": "ویلا ارزان | صفحه اصلی",
                            "url" : "https://villaarzan.com"
                         }
                `
        }
    }


    return (

        <>
            <Head>
                <title>ویلا ارزان-تخصص ما مناطق شمالی کشور است</title>
                <meta name='robots' content='index,follow' />
                <meta name='googlebot' content='index,follow' />
                <meta name='title' content='ویلا ارزان' />
                <meta name='description' content='ویلا ارزان | تخصص ما مناطق شمالی کشور است' />
                <meta name='owner' content="villaarzan | ویلا ارزان" />
                <meta name="author" content="villaarzan | ویلا ارزان" />
                <meta name="copyright" content="2022 © ویلاارزان" />
                <meta property="og:image" content="https://villaarzan.com/img/landing-min.png" />
                <meta property="og:image:alt" content="villaarzan | ویلا ارزان" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="600" />
                <meta property="og:type" content="website" />
                {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                <meta property="og:title" content="ویلا ارزان" />
                <meta property="og:site_name" content="ویلا ارزان" />
                <meta property="og:locale" content="fa_IR" />
                <meta name="twitter:image" content="https://villaarzan.com/img/landing-min.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="https://villaarzan.com/" />
                {/*<meta name="twitter:description" content=""/>*/}
                {/*<meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است"/>*/}
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
                        <link rel='canonical' href='https://villaarzan.com' />

                }


                <script type="application/ld+json" dangerouslySetInnerHTML={webPageJsonLd()} />


            </Head>
            <div className='mb-4'>

                <div className='container mx-auto lg:max-w-screen-xl'>
                    {
                        vip.length > 0 ?
                            <>
                                <Divider path='vip' title={'پست های ویژه'} />

                                <div className=' grid-cols-12 gap-12 mt-8 hidden md:grid  grid-rows-auto '>
                                    {/*desktop vip posts*/}
                                    {
                                        vip.map((property: any) => (
                                            <>
                                                <div className='md:col-span-6 lg:col-span-4 ' key={property}>
                                                    <PropertyCard data={property} />
                                                </div>
                                            </>
                                        ))
                                    }
                                </div>

                                {/*mobile vip posts*/}
                                <div className='my-8 md:hidden'>
                                    <MobileSimilarPropertiesList nextClass={'.vipPostNext'} prevClass={'.vipPostPrev'}
                                        data={vip}>
                                        <PropertyCard />
                                    </MobileSimilarPropertiesList>
                                </div>

                                {/*slider navigator for vip posts*/}
                                <div className='md:hidden'>
                                    <NavigationBar path='vip' nextClass={'vipPostNext'} prevClass={'vipPostPrev'}
                                        hasShowMore={true} />
                                </div>
                            </>
                            : null
                    }


                    <div className='mt-8 mb-8'>
                        <Divider path='shomal' title='لیست آگهی ها' hasNavigation={false} />
                    </div>

                    {/*  divar foroosh*/}

                    <div className='grid-cols-12 gap-12 mt-8 hidden md:grid'>

                        {/*desktop posts*/}
                        {
                            properties?.map((property: any) => (
                                <>
                                    <div className='md:col-span-6 lg:col-span-4 ' key={property}>
                                        <PropertyCard data={property} />
                                    </div>
                                </>
                            ))
                        }
                    </div>

                    {/*mobile posts*/}
                    <div className='my-8 md:hidden'>
                        {

                            <MobileSimilarPropertiesList nextClass={'.propertiesNext'} prevClass={'.propertiesPrev'}
                                data={properties}>
                                <PropertyCard />
                            </MobileSimilarPropertiesList>
                        }
                    </div>

                    {/*slider navigator for posts*/}
                    <div className='md:hidden'>
                        <NavigationBar path='shomal' nextClass={'propertiesNext'} prevClass={'propertiesPrev'}
                            hasShowMore={true} />
                    </div>


                    <div className='mt-10 mb-8'>
                        <Divider path='' title='آگهی شهرها' hasNavigation={true} />
                    </div>

                    {/*   cities */}


                    {/*cities slider*/}
                    {
                        cities.length > 0 && <Swiper
                            slidesPerView={'auto'}
                            loop={true}
                            spaceBetween={20}
                            modules={[Navigation,Autoplay]}
                            autoplay={{ delay: 5000 }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 40,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 50,
                                },
                            }}
                            navigation={{
                                prevEl: ".prevCities",
                                nextEl: ".nextCities",
                                enabled: true,
                            }}
                            className="rounded-2xl"

                        >
                            {cities?.map((city: any) => (
                                <div key={city?.id} className='col-span-4 '>
                                    <SwiperSlide className='py-4'>
                                        {/*  city card  */}

                                        <CityCard city={city} />

                                    </SwiperSlide>
                                </div>
                            ))
                            }

                        </Swiper>
                    }
                    <div className='md:hidden my-5'>
                        <NavigationBar path='' nextClass={'nextCities'} prevClass={'prevCities'} hasShowMore={false} />
                    </div>


                </div>


                {/*statistic banner*/}
                <div className='bg-statistic-banner h-72 md:h-48 bg-cover bg-bottom mt-16 '>
                    <div className='flex flex-col  md:flex-row justify-around items-center h-full text-white'>
                        <div className='flex items-center gap-x-2'>
                            <span className='font-semibold text-xl lg:text-2xl'>تعداد دفاتر فعال </span>
                            <span className='font-bold text-3xl lg:text-5xl'>

                                {counters?.real_estate}+ </span>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <span className='font-semibold text-xl lg:text-2xl'>تعداد مشاوران فعال </span>
                            <span className='font-bold text-3xl  lg:text-5xl'>  {counters?.advisor}+</span>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <span className='font-semibold text-xl lg:text-2xl'>تعداد کاربران فعال </span>
                            <span className='font-bold text-3xl  lg:text-5xl'>  {counters?.user_count}+</span>
                        </div>
                    </div>
                </div>


                <div className='container mx-auto lg:max-w-screen-xl'>


                    <div className='mt-10 mb-8'>
                        <Divider path={'/best-realtor'} title='دفاتر املاک برتر' hasNavigation={false} />
                    </div>

                    {/*    best real estates*/}

                    <div className=' grid-cols-12 gap-12 mt-8 hidden md:grid '>

                        {/*desktop posts*/}
                        {
                            best_realtors.map((realtor: any) => (
                                <>
                                    <div className='md:col-span-6 lg:col-span-3 ' key={realtor.id}>
                                        <ConsultantCard isRealState={true} data={realtor} />
                                    </div>
                                </>
                            ))
                        }
                    </div>

                    {/*mobile best estates*/}
                    <div className='my-8'>
                        <MobileSimilarPropertiesList data={best_realtors} nextClass={'.estatesNext'}
                            prevClass={'.estatesPrev'}>
                            <ConsultantCard isRealState={true} />
                        </MobileSimilarPropertiesList>
                    </div>

                    {/*/!*slider navigator for best estates*!/*/}
                    <div className='md:hidden'>
                        <NavigationBar path='/best-realtor' nextClass={'estatesNext'} prevClass={'estatesPrev'}
                            hasShowMore={true} />
                    </div>


                    <div className='mt-10 mb-8'>
                        <Divider path='' hasShowMore={false} title='انواع ملک' hasNavigation={false} />
                    </div>

                    {/*  property types  */}

                    <div className='grid grid-cols-12 gap-x-4 gap-y-4 text-white'>

                        <Link href='/shomal/villa-saheli'
                            className='relative col-span-12 hover:shadow-2xl transition md:col-span-4 h-[198px] rounded-2xl overflow-hidden mx-auto'>
                            <img className='hover:scale-110 transition h-full' src="images/type-3.png" alt="" />
                            <span
                                className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-3xl'> ساحلی</span>
                        </Link>

                        <Link href='/shomal/villa-jangali'
                            className='relative col-span-12 hover:shadow-2xl transition md:col-span-4 h-[198px] rounded-2xl overflow-hidden mx-auto'>
                            <img className='h-full hover:scale-110 transition' src="images/type-2.png" alt="" />
                            <span
                                className='absolute left-1/2 top-1/2 -translate-x-1/2  -translate-y-1/2 font-black text-3xl'> جنگلی</span>
                        </Link>

                        <Link href='/shomal/villa-shahraki'
                            className='relative col-span-12 hover:shadow-2xl transition md:col-span-4 h-[198px] rounded-2xl overflow-hidden mx-auto'>
                            <img className='h-full hover:scale-110 transition' src="images/type-1.png" alt="" />
                            <span
                                className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-3xl'> شهرکی</span>
                        </Link>
                    </div>


                    <div className='mt-10 mb-8'>
                        <Divider path='best-advisor' title='مشاوران برتر' hasNavigation={false} />
                    </div>

                    {/*  best cunsoltants  */}
                    <div className=' grid-cols-12 gap-12 mt-8 hidden md:grid '>

                        {/*desktop best cunsoltants*/}
                        {
                            best_advisors?.best_advisor.slice(0,6).map((advisor: any) => (
                                <>
                                    <div className='md:col-span-6 lg:col-span-3 ' key={advisor.id}>
                                        <ConsultantCard data={advisor} />
                                    </div>
                                </>
                            ))
                        }
                    </div>

                    {/*mobile best advisor*/}
                    <div className='my-8'>
                        <MobileSimilarPropertiesList data={best_advisors?.best_advisor.slice(0,6)}
                            nextClass={'.consultantsVipNext'}
                            prevClass={'.consultantsVipPrev'}>
                            <ConsultantCard />
                        </MobileSimilarPropertiesList>
                    </div>

                    {/*slider navigator for best advisor*/}
                    <div className='md:hidden'>
                        <NavigationBar path='best-advisor' nextClass={'consultantsVipNext'}
                            prevClass={'consultantsVipPrev'}
                            hasShowMore={true} />
                    </div>


                    {
                        blogs.length > 0 &&
                        <>
                            <div className='mt-10 mb-8'>
                                <Divider path='blog-list' title='وبلاگ' hasNavigation={false} />
                            </div>


                            <div className=' grid-cols-12 gap-12 mt-8 hidden md:grid '>

                                {/*desktop blogs*/}
                                {
                                    blogs.map((item: any) => (
                                        <>
                                            <div className='md:col-span-6 lg:col-span-4 ' key={item}>
                                                <BlogCard data={item} />
                                            </div>
                                        </>
                                    ))
                                }
                            </div>

                            {/*mobile blogs*/}
                            <div className='my-8'>
                                <MobileSimilarPropertiesList data={blogs} nextClass={'.blogsNext'}
                                    prevClass={'.blogsPrev'}>
                                    <BlogCard />
                                </MobileSimilarPropertiesList>
                            </div>

                            {/*slider navigator for blogs*/}
                            <div className='md:hidden'>
                                <NavigationBar path='blog-list' nextClass={'blogsNext'} prevClass={'blogsPrev'}
                                    hasShowMore={true} />
                            </div>
                        </>

                    }

                    {/*  advertise banner  */}

                    <div className=' mt-16 lg:mt-44'>
                        <div
                            className='relative bg-primary rounded-xl w-full min-h-72 flex flex-col gap-y-8 lg:flex-row bg-no-repeat bg-contain justify-between lg:py-16 lg:px-12'>
                            {/*  right side  */}
                            <div
                                className='h-full flex flex-col pt-10 lg:pt-0 items-center lg:items-start gap-y-8 text-white justify-center '>
                                <h2 className='font-extrabold text-3xl lg:text-4xl'>
                                    در ســــــریع تــــــرین زمان
                                </h2>
                                <h2 className='font-bold text-2xl lg:text-3xl'>
                                    خونتو بفروش
                                </h2>

                                {
                                    user?.status?.id === 0 ?
                                        <button
                                            onClick={() => toast('اکانت شما هنوز تایید نشده است.')}
                                            className='border border-white flex items-center justify-center py-3 px-2 gap-x-1 rounded-xl'>
                                            <AddIcon color='#fff' />
                                            <div>
                                                <span className='text-xl'>برای ثبت آگهی کلیک کنید</span>
                                            </div>
                                        </button>
                                        :
                                        <button
                                            className='border border-white flex items-center justify-center py-3 px-2 gap-x-1 rounded-xl'>
                                            <AddIcon color='#fff' />
                                            <Link href={'/add-property'}>
                                                <span className='text-xl'>برای ثبت آگهی کلیک کنید</span>
                                            </Link>
                                        </button>
                                }


                            </div>

                            {/*  left side  */}

                            <div className='lg:absolute -bottom-0 mx-auto h-60 lg:h-auto left-2'>
                                <img className='h-full' src="images/ad-banner.png" alt="" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

Home.getLayout = (page) => <MainLayout hasBanner={true}>{page}</MainLayout>

export default Home


export const getStaticProps: GetStaticProps = async (context) => {


    const posts: AxiosResponse = await axios.get('https://api.villaarzan.com/post?_page=1&_limit=6')
    const best_advisors: AxiosResponse = await axios.get('https://api.villaarzan.com/best-advisor')
    const best_realtors: AxiosResponse = await publicAxios().get('/best-realtor')
    const blogs = await axios.get(`https://api.villaarzan.com/article?_limit=3&_page=1`,{
        withCredentials: true,
    })

    const vip = await privateAxios().get('/ad-vip')

    const counters = await publicAxios().get('/counter')

    //seo

    const { data } = posts

    return {
        props: {
            properties: data?.results,
            blogs: blogs?.data?.results,
            best_advisors: best_advisors?.data,
            best_realtors: best_realtors?.data?.best_realtor,
            counters: counters?.data?.data,
            vip: vip.data
        },
        //props: {
        //    properties: null,
        //    blogs: null,
        //    best_advisors: null,
        //    best_realtors: null,
        //    counters: null,
        //    vip:null
        //},
        revalidate: 5
    }
}



