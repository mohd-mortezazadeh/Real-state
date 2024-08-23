import { GetServerSideProps,NextPage } from "next";
import MainLayout from "../../../layouts/mainLayout";
import Breadcrumb from "../../../components/breadcrumb/breadcrumb";
import PodcastPlayer from "../../../components/podcast-player/PodcastPlayer/PodcastPlayer";
import StarSvg from "../../../components/svg/star/StarSvg";
import DateSvg from "../../../components/svg/date/DateSvg";
import CircleProfileSvg from "../../../components/svg/circle-profile/CircleProfileSvg";
import Divider from "../../../components/divider/Divider.component";
import BlogCard from "../../../components/blog-card/blogCard";
import MobileSimilarPropertiesList
    from "../../../components/similar-properties-list/mobile/MobileSimilarPropertiesList.component";
import NavigationBar from "../../../components/navigation-bar/navigationBar";
import React,{ useEffect,useMemo,useState } from "react";
import axios from "axios";
import Head from "next/head";
import { publicAxios } from "../../../services/axiosInstances/publicAxios";
import { useRouter } from "next/router";
import Rating from "../../../components/rating/Rating";
import { getRatingArticle,putRatingArticle } from "../../../services/api/rating";
import toast from "react-hot-toast";
import BlogComments from "../../../components/blog-comments/BlogComments";
import { addComment,comments,create_comment,reset } from "../../../redux/slices/commentSlice";
import { useAppDispatch,useAppSelector } from "../../../hooks/useRedux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../../../components/loading/Loading.component";
import TinyLoading from "../../../components/tinyLoading/TinyLoading";
import { useAuth } from "../../../hooks/useAuth";
import LogoutModal from "../../../components/logout-modal/LogoutModal";
import DeleteCommentModal from "../../../components/delete-comment-modal/DeleteCommentModal";
import { BASE_URL } from "../../../configs/commons";




const SingleBlog: NextPage = ({ data,id }: any) => {
    const dispatch = useAppDispatch()
    const commentsState = useAppSelector(comments)

    const [seo,setSeo] = useState<any>('')
    const [rating,setRating] = useState<number | null>(null)

    const router = useRouter()

    const hasPodcast: boolean = false;

    const { user } = useAuth()

    const path = [
        {
            name: "وبلاگ",
            url: "/blog-list"
        },
        {
            name: `${data?.article?.title}`,
            url: `/single-blog/${data?.article?.id}`
        },
    ];

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com${router.pathname}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })

    },[])

    useEffect(() => {
        getRatingArticle(data?.article?.id)
            .then((res) => setRating(res?.rating))
    },[data?.article?.id,rating])

    const handleRating = (rate: number) => {
        setRating(rate)
        putRatingArticle(rate,data?.article?.id)
            .then((res) => {
                toast.success(res?.detail)
            })
            .catch((error) => {
                if(error.response.status === 403) {
                    toast.error(error.response.data.detail)
                }
            })
    }

    useEffect(() => {
        return () => {
            dispatch(reset())
        }
    },[])

    const formik = useFormik({
        initialValues: {
            fullname: user?.fullname,
            content: '',
            replied_to: null,
            article: +id
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            fullname: Yup.string()
                .nullable()
                .required('نام خود را وارد نمایید'),
            content: Yup.string()
                .min(5,'حداقل مقدار مجاز پیام 5 کاراکتر میباشد')
                .required('پیام خود را وارد نمایید'),
            replied_to: Yup.number().nullable()
        }),
        onSubmit: function(values,formikHelpers) {
            dispatch(create_comment({ value: values }))

            formikHelpers.resetForm()
        }
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
                            "name": "${data?.article?.title}",
                            "item": "https://villaarzan.com${router.asPath}"  
                          }]
                        }
                `
        }
    }


    return (
        <MainLayout hasBanner={false}>

            <Head>
                <meta name='robots' content='index,follow' />
                <meta name='googlebot' content='index,follow' />
                <meta property="og:image" content={data?.article.media[0].file} />
                <meta property="og:type" />
                {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                <meta property="og:title" content={data?.article.title} />
                <meta property="og:description" content={data?.article.content} />
                <meta property="og:site_name" content="ویلا ارزان" />
                <meta property="og:locale" content="fa_IR" />
                <meta property="og:brand" content="ویلا ارزان" />
                <meta name="twitter:image" content={data?.article.media[0].file} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="https://villaarzan.com/" />
                <meta name="twitter:description" content={data?.article.content} />
                <meta name="twitter:title" content={data?.article.title} />
                <meta name='owner' content="villaarzan | ویلا ارزان" />
                <meta name="author" content="villaarzan | ویلا ارزان" />
                <meta name="copyright" content="2022 © ویلاارزان" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="600" />
                <meta property="og:title" content={`ویلا ارزان | ${data?.article?.title}`} />
                <title> ویلا ارزان-{data?.article.title}</title>


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

                <script type="application/ld+json" dangerouslySetInnerHTML={breadCrumbListJsonLd()} />

            </Head>
            {/*{*/}
            {/*    delCommentModal &&*/}
            {/*    <div*/}
            {/*        className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'*/}
            {/*        style={{backgroundColor: 'rgba(0,0,0,0.3)'}}*/}
            {/*    >*/}
            {/*        <DeleteCommentModal delCommentModal={delCommentModal} setDelCommentModal={setDelCommentModal}*/}
            {/*                            // handleDeleteComment={handleLogout}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*}*/}
            <Breadcrumb title="وبلاگ تکی" subtitle="درباره برترین ویلا ها" path={path} />
            <div className="container mx-auto lg:max-w-screen-xl px-4  pb-20">
                <div className="p-6 bg-white rounded-2xl box-shadow-1 w-full flex flex-col gap-y-7">
                    {/* image wrapper */}
                    {data?.article?.is_podcast ? (
                        <div className="w-full bg-primary h-[340px] rounded-lg overflow-hidden relative">
                            {/* image */}
                            <div className='absolute w-full h-full top-0 left-0 bg-gradient-to-t from-primary/60 to-primary/0'>

                            </div>
                            <img src={data?.article?.media[0].file} className="w-full h-full object-fill" alt={data?.article?.title} />

                            <PodcastPlayer
                                src={data?.article?.media[1].file} />
                            {/* 5 star and date  */}
                            <div className="absolute top-2 left-2 flex items-center gap-x-2">
                                {/*star*/}
                                <div className="flex  items-center gap-x-2 bg-custom-gold rounded-lg p-2 text-white">
                                    <StarSvg />
                                    <span className="text-sm">{data?.article?.rating_article?.rating_avg}</span>
                                    <span
                                        className='text-xs'>({data?.article?.rating_article?.user_rating_count} رای)</span>
                                </div>
                                {/*date*/}
                                <div className="flex items-center gap-x-2 bg-primary rounded-lg p-2 text-white">
                                    <DateSvg color="#fff" />
                                    <span
                                        className="text-sm">{new Date(+data?.article?.created_at).toLocaleDateString('fa')}</span>
                                </div>
                            </div>

                            {/* rating  */}
                            <div
                                className="absolute top-2 right-2 bg-white p-4 md:flex flex-row justify-between items-center hidden rounded-xl box-shadow-2">
                                <span className="text-lg font-bold">امتیاز دادن</span>
                                <Rating count={5} rating={rating}
                                    color={{ filled: '#FFD100',unFilled: '#737373' }}
                                    onRating={handleRating} />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-primary h-[340px] rounded-lg overflow-hidden relative">
                            {/* image */}
                            <img src={data?.article?.media[0].file} className="w-full h-full object-fill" alt={data?.article?.title} />

                            {/* 5 star and date  */}
                            <div className="absolute top-2 left-2 flex items-center gap-x-2">
                                {/*star*/}
                                <div className="flex  items-center gap-x-2 bg-custom-gold rounded-lg p-2 text-white">
                                    <StarSvg />
                                    <span className="text-sm">
                                        {data?.article?.rating_article?.rating_avg ?? 0}
                                    </span>
                                </div>
                                {/*date*/}
                                <div className="flex items-center gap-x-2 bg-primary rounded-lg p-2 text-white">
                                    <DateSvg color="#fff" />
                                    <span
                                        className="text-sm">{new Date(+data?.article?.created_at).toLocaleDateString('fa')}</span>
                                </div>
                            </div>

                            {/* rating  */}
                            <div
                                className="absolute top-2 right-2 bg-white p-4 md:flex flex-row justify-between items-center hidden rounded-xl box-shadow-2">
                                <span className="text-lg font-bold">امتیاز دادن</span>
                                <Rating count={5} rating={rating}
                                    color={{ filled: '#FFD100',unFilled: '#737373' }}
                                    onRating={handleRating} />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-y-5">
                        <div className="grid grid-cols-12 ">
                            <div className="col-span-12 md:col-span-6 lex flex-row justify-start items-center">
                                <span className="text-2xl font-bold">
                                    {data?.article?.title}
                                </span>
                            </div>
                            <div className=" md:col-span-6 hidden md:flex flex-row justify-end items-center ">
                                <div className="flex flex-row justify-between items-center gap-x-2 h-[26px]">
                                    <CircleProfileSvg />
                                    <span className="text-base font-semibold text-primary">
                                        نویسنده {data?.article?.writer}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="md:mb-7">
                            <p className="font-normal text-lg leading-[46px] text-right text-custom-gray-200 whitespace-pre-wrap	    ">
                                {
                                    data?.article?.content
                                }
                            </p>
                        </div>
                        <div className=" md:col-span-6 md:hidden flex flex-row justify-start items-center ">
                            <div className="flex flex-row justify-between items-center w-[151px] h-[26px]">
                                <CircleProfileSvg />
                                <span className="text-base font-semibold text-primary">
                                    نویسنده علی اکبری
                                </span>
                            </div>
                        </div>
                        <div className=" flex flex-row justify-start items-center md:hidden gap-x-5">
                            <span className="text-lg font-bold">امتیاز دادن</span>
                            {/*<img src="images/static-stars.svg"/>*/}
                        </div>
                    </div>
                </div>

                {/* comments wrapper*/}
                <div className="grid grid-cols-12 mt-6 mb-20">
                    <div className="col-span-12 md:col-span-8 md:order-1 order-2 px-3">
                        {/*کامنتی ثبت نشده است!*/}

                        <BlogComments
                            user={user}
                            articleId={+id}
                        />
                    </div>

                    {/* send comment */}
                    <div className="col-span-12 md:col-span-4 md:order-2 order-1">
                        <div className="w-full sticky top-2">
                            <div className="bg-white md:rounded-2xl box-shadow-1 p-6  flex flex-col gap-y-6">
                                <h2 className="text-xl font-bold">دیدگاه</h2>
                                <form onSubmit={formik.handleSubmit} className="w-full ">
                                    <div className="flex flex-col gap-y-3 mb-5">
                                        <label className="text-base font-medium">
                                            نام و نام خانوادگی
                                        </label>
                                        <input
                                            type="text"
                                            name='fullname'
                                            disabled={user?.fullname}
                                            value={user?.fullname || formik.values.fullname}
                                            onChange={formik.handleChange}
                                            className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-xs font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                                            placeholder="نام نام خانوادگی خود را وارد کنید"
                                        />
                                        <span className='text-red-400 text-sm'>
                                            <>
                                                {formik.errors.fullname}
                                            </>
                                        </span>

                                    </div>

                                    <div className="flex flex-col gap-y-3 mb-3">
                                        <label className="text-base font-medium">پیام</label>
                                        <textarea
                                            value={formik.values.content}
                                            name='content'
                                            className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-xs font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                                            onChange={formik.handleChange}
                                            placeholder="پیام خود را وارد کنید"
                                            rows={7}
                                        />
                                        <span className='text-red-400 text-sm'>{formik.errors.content}</span>

                                    </div>
                                    <div className="flex flex-col gap-y-3">
                                        <button
                                            type='submit'
                                            className="bg-primary-lin text-white w-full py-3 px-4 font-semibold text-base rounded-lg flex flex-row justify-center items-center gap-x-2">
                                            {
                                                commentsState.createLoading ?
                                                    <TinyLoading />

                                                    :
                                                    <>
                                                        <span className="text-base font-semibold">ثبت نظر</span>
                                                        <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                                                                stroke="white"
                                                                stroke-width="1.5"
                                                                stroke-miterlimit="10"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                d="M7 8H17"
                                                                stroke="white"
                                                                stroke-width="1.5"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                            <path
                                                                d="M7 13H13"
                                                                stroke="white"
                                                                stroke-width="1.5"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                    </>
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* last news wrapper*/}
                {
                    data?.last_article.length > 0 &&
                    <div className="flex flex-col gap-y-5">
                        <Divider path='blog-list' title="اخرین اخبار" />
                        <div className="md:grid grid-cols-12 gap-x-5 gap-y-6 pb-20 hidden">
                            {data?.last_article.map((item: any,index: any) => (
                                <div
                                    key={index}
                                    className="lg:col-span-4 md:col-span-6 col-span-12"
                                >
                                    <BlogCard data={item} />
                                </div>
                            ))}
                        </div>

                        {/* mobile porperties */}
                        <div className="md:hidden block">
                            <MobileSimilarPropertiesList data={data?.last_article}>
                                <BlogCard />
                            </MobileSimilarPropertiesList>
                            <div className="my-5">
                                <NavigationBar path='blog-list' hasShowMore={true} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </MainLayout>
    );
};

export default SingleBlog;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context
    const { id } = query


    // const res =await privateAxios().get(`post/${id}`)
    const res = await axios.get(`${BASE_URL}/article/${id}`,{
        withCredentials: true,
    })


    return {
        props: {
            data: JSON.parse(JSON.stringify(res.data)),
            id: id
        }
    }
}

