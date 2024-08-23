import {NextPage} from 'next'
import React, {useState, useEffect, useMemo} from 'react'
import Breadcrumb from '../../components/breadcrumb/breadcrumb'
import AddPropertyFormGallery from '../../forms/add-property/AddPropertyFormGallery'
import AddPropertyFormInfo from '../../forms/add-property/AddPropertyFormInfo'
// import { useAppSelector } from '../../hooks/useRedux'
import MainLayout from '../../layouts/mainLayout'
// import { selectFormPage } from '../../redux/slices/formSlice'
import Stepper from '../../components/stapper/Stepper';
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {handleName, handlePage, nextPage, reset, selectAddPropertyPage} from "../../redux/slices/addPropertySlice";
import useCategories from "../../hooks/useCategories";
import {useAuth} from "../../hooks/useAuth";
import {useRouter} from "next/router";
import Loading from "../../components/loading/Loading.component";
import toast from "react-hot-toast";
import {scrollToTop} from "../../utils/scrollToTop";
import Head from "next/head";
import {publicAxios} from "../../services/axiosInstances/publicAxios";


const AddProperty: NextPage = () => {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const page = useAppSelector(selectAddPropertyPage)

    const [seo, setSeo] = useState<any>('')

    const [loadingAddProperty, setLoadingAddProperty] = useState(false)

    const {user, loading} = useAuth()

    const {categories} = useCategories()

    const [userPending, setUserPending] = useState(false)
    const [steps, setSteps] = useState<any>([
        {
            id: 1,
            label: "نوع ملک",
        },
        {
            id: 2,
            label: "اطلاعات کلی",
        },
        {
            id: 3,
            label: "گالری تصاویر",
        },

    ])
    // const [activeStep, setActiveStep] = useState(1)
    const [cateogrySelected, setCategorySelected] = useState<string>("")

    useMemo(() => {
        // userPending && toast('اکانت شما هنوز تایید نشده است.')
    }, [userPending])

    useMemo(() => {

        const seo = publicAxios().get(`https://api.villaarzan.com/seo?path=https://villaarzan.com/single-property${router.asPath}`)
            .then((res) => {
                setSeo(res.data)
            })
            .catch(error => {
                console.log(error)
            })


    }, [])

    // useEffect(() => {
    //     if (localStorage.getItem('current-page') && localStorage.getItem('category-selected')) {
    //         setCategorySelected(localStorage.getItem('category-selected') ?? "")
    //         // setActiveStep(Number(localStorage.getItem('current-page')))
    //
    //     } else {
    //         // localStorage.removeItem('category-selected');
    //         // localStorage.removeItem('current-page')
    //         // setActiveStep(1);
    //         setCategorySelected("")
    //     }
    // }, [cateogrySelected])

    const handleCategorySelect = (name: string, display_name: string, id: number) => {
        dispatch(handleName({
            name,
            display_name,
            id
        }))
        // localStorage.setItem('category-selected', value);
        dispatch(handlePage(2))
        // localStorage.setItem('current-page', (page + 1).toString())
        // setActiveStep(prev => prev + 1)
    }

    useEffect(() => {

        return () => {
            dispatch(reset())
        }
    }, [])

    // const handlePrevPage = (step: number) => {
    //     setActiveStep(prev => prev - 1)
    //     localStorage.setItem('current-page', (activeStep - 1).toString())
    //     if (step === 1) {
    //         localStorage.removeItem('category-selected')
    //     }
    // }

    const webPageJsonLd = () => {
        return {
            __html: `
                         {
                            "@context": "https://schema.org/",
                            "@type": "WebPage",
                            "name": "ویلا ارزان | ثبت آگهی",
                            "url" : "https://villaarzan.com/add-property"
                         }
                `
        }
    }


    if (!user && !loading) {

        router.push('/auth')
        return <Loading/>
    } else if (user && user.status.id === 0) {
        router.push('/').then(() => setUserPending(true))
        return <Loading/>
    } else {

        return (
            <MainLayout hasBanner={false}>
                <Head>
                    <meta name="robots" content="noindex" />

                    <meta property="og:image" content="https://villaarzan.com/img/landing-min.png"/>
                    <meta property="og:type"/>
                    {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                    <meta property="og:title" content="ویلا ارزان | افزودن آگهی"/>
                    <meta property="og:site_name" content="ویلا ارزان"/>
                    <meta property="og:locale" content="fa_IR"/>
                    <meta property="og:brand" content="ویلا ارزان"/>
                    <meta name="twitter:image" content="https://villaarzan.com/img/landing-min.png"/>
                    <meta name="twitter:card" content="summary_large_image"/>
                    <meta name="twitter:site" content="https://villaarzan.com/"/>
                    <meta name="twitter:description" content="ویلا ارزان | ثبت آگهی رایگان"/>
                    <meta name="twitter:title" content="ویلا ارزان"/>
                    <title>ویلا ارزان | ثبت آگهی</title>

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

                    <script type="application/ld+json" dangerouslySetInnerHTML={webPageJsonLd()}/>
                </Head>

                <Breadcrumb title='ثبت آگهی' subtitle='آگهی فروش ملک خود را رایگان ثبت کنید'
                            path={[{name: 'ثبت آگهی' , url : "/add-property"}]}/>

                <div className='container mx-auto xl:px-40 flex flex-col'>
                    <div className='md:w-3/5 w-full mx-auto'>
                        <Stepper steps={steps} activeStep={page} clickable={false}/>

                    </div>
                    {/* categories  */}
                    <div className='flex flex-col justify-center items-center mt-16   w-full'>
                        {page === 1 ?
                            <div
                                className='flex flex-row flex-wrap items-center justify-center gap-6  w-full  pb-10 px-2'>
                                {
                                    categories.map((category: any) => (
                                        <div
                                            key={category.id}
                                            className='hover:cursor-pointer basis-72 box-shadow-1 rounded-3xl p-5 flex flex-col justify-center items-center space-y-5'
                                            onClick={() => {
                                                handleCategorySelect(category.name, category.display_name, category.id)
                                                scrollToTop()
                                            }}
                                        >
                                            <div className='h-[170px] rounded-lg overflow-hidden'>
                                                <img src={`/images/${category?.id}.png`} className='h-full w-full'/>
                                            </div>
                                            <span className='text-xl font-bold'>{category.display_name}</span>
                                        </div>
                                    ))
                                }

                            </div> : (
                                <div className='pb-20 w-full space-y-8 xl:px-40'>
                                    {page === 2 ? <AddPropertyFormInfo dispatch={dispatch}/>
                                        : page === 3 &&
                                        <div>
                                            <AddPropertyFormGallery loadingAddProperty={loadingAddProperty}
                                                                    setLoadingAddProperty={setLoadingAddProperty}/>
                                        </div>
                                    }
                                </div>
                            )}

                    </div>
                </div>


            </MainLayout>
        )
    }
}

export default AddProperty
