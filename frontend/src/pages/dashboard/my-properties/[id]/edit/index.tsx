import React, {useEffect, useMemo, useState} from 'react';
import {NextPage} from "next";
import {useAppDispatch, useAppSelector} from "../../../../../hooks/useRedux";
import {useRouter} from "next/router";
import {
    handleName,
    handlePage,
    handlePropertyInfo, handlePropertyInfoEdit,
    reset,
    selectAddPropertyPage, selectPropertyInfo
} from "../../../../../redux/slices/addPropertySlice";
import {useAuth} from "../../../../../hooks/useAuth";
import useCategories from "../../../../../hooks/useCategories";
import Loading from "../../../../../components/loading/Loading.component";
import MainLayout from "../../../../../layouts/mainLayout";
import Breadcrumb from "../../../../../components/breadcrumb/breadcrumb";
import Stepper from "../../../../../components/stapper/Stepper";
import {scrollToTop} from "../../../../../utils/scrollToTop";
import AddPropertyFormInfo from "../../../../../forms/add-property/AddPropertyFormInfo";
import AddPropertyFormGallery from "../../../../../forms/add-property/AddPropertyFormGallery";
import {privateAxios} from "../../../../../services/axiosInstances/privateAxios";
import Head from "next/head";

const EditAd: NextPage = () => {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const page = useAppSelector(selectAddPropertyPage)
    const propertyInfo = useAppSelector(selectPropertyInfo)

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

    useEffect(() => {

        router.query?.id && (router.query?.active === 'true' ?

            privateAxios().get(`/post/${router?.query?.id}`)
                .then((res) => {
                    dispatch(handlePropertyInfoEdit(res.data.ad))
                })

            :

            privateAxios().get(`/preview/${router?.query?.id}`)
            .then((res) => {
                dispatch(handlePropertyInfoEdit(res.data))
            }))
    }, [router.query.id , router.query.active])

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

    if (!user && !loading) {

        router.push('/auth')
        return <Loading/>
    } else if (user && user?.status?.id === 0) {
        router.push('/').then(() => setUserPending(true))
        return <Loading/>
    } else {

        return (
            <MainLayout hasBanner={false}>
                <Head>
                    <title>داشبورد-ویرایش آگهی</title>

                </Head>
                <Breadcrumb title='ثبت آگهی' subtitle='آگهی فروش ملک خود را رایگان ثبت کنید'
                            path={[{name: 'ثبت آگهی' , url : "/add-property"}]}/>

                <div className='container mx-auto xl:px-40 flex flex-col'>
                    {/*<div className='md:w-3/5 w-full mx-auto'>*/}
                    {/*    <Stepper steps={steps} activeStep={page} clickable={false}/>*/}

                    {/*</div>*/}
                    {/* categories  */}
                    {
                        propertyInfo.category &&   <div className='flex flex-col justify-center items-center mt-16   w-full'>
                            {(
                                <div className='pb-20 w-full space-y-8 xl:px-40'>
                                    {page === 1 ? <AddPropertyFormInfo isEdit={true} dispatch={dispatch}/>
                                        : page === 2 &&
                                        <div>
                                            <AddPropertyFormGallery id={router?.query?.id} isEdit={true} loadingAddProperty={loadingAddProperty}
                                                                    setLoadingAddProperty={setLoadingAddProperty}/>
                                        </div>
                                    }
                                </div>
                            )}

                        </div>
                    }
                </div>


            </MainLayout>
        )
    }
}

export default EditAd;