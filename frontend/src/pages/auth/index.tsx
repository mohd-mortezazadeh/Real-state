import { NextPage } from "next";
import AuthFormInfo from "../../forms/auth/authFormInfo";
import AuthFormVerify from "../../forms/auth/authFormVerify";
import StepBar3Of3Svg from "../../components/svg/step-bars/stepBar3of3Svg";
import StepBar2Of2Svg from "../../components/svg/step-bars/stepBar2of2Svg";
import AuthFormPhone from "../../forms/auth/authFormPhone";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { handlePage, selectFormPage } from "../../redux/slices/formSlice";
import AuthFormPassword from "../../forms/auth/authFormPassword";
import StepBar2of3Svg from "../../components/svg/step-bars/stepBar2of3Svg";
import { forgetPass, reset, userInfo, userPhone, userToken, userTypes } from "../../redux/slices/authSlice";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import ArrowLeftSvg from "../../components/svg/arrows/arrow-left/ArrowLeftSvg";
import Head from "next/head";


const Auth: NextPage = () => {

    const router = useRouter()

    const { user, loading } = useAuth()
    const [pageChangeLoading, setPageChangeLoading] = useState(false)


    const formPage = useAppSelector(selectFormPage)

    const userTypesState = useAppSelector(userTypes)

    const phone = useAppSelector(userPhone)

    const token = useAppSelector(userToken)

    const user_info = useAppSelector(userInfo)

    const forget_pass = useAppSelector(forgetPass)


    const dispatch = useAppDispatch()


    useEffect(() => {
        //show page of login/register page based on user state(is_loggin or has_password or is_admin)
        if (userTypesState.is_loggin === null && userTypesState.is_admin === null && userTypesState.has_password === null) {
            dispatch(handlePage(1))

        } else if (userTypesState.is_loggin && userTypesState.is_admin && userTypesState.has_password) {
            dispatch(handlePage(3))

        } else if (token && !userTypesState.is_loggin && !userTypesState.is_admin && !userTypesState.has_password) {
            dispatch(handlePage(4))
        } else if (!userTypesState.is_loggin && !userTypesState.is_admin && !userTypesState.has_password) {
            dispatch(handlePage(2))
        } else if (userTypesState.is_loggin && !userTypesState.is_admin && !userTypesState.has_password) {
            dispatch(handlePage(5))
        } else if (forget_pass && userTypesState.is_loggin && !userTypesState.is_admin && userTypesState.has_password) {
            dispatch(handlePage(5))
        } else if (userTypesState.is_loggin && !userTypesState.is_admin && userTypesState.has_password) {
            dispatch(handlePage(3))
        }
    }, [userTypesState, user_info])


    useEffect(() => {
        if (user && !loading) {
            setPageChangeLoading(true)
            router.push('/')
                .then(() => setPageChangeLoading(false))
        }


    }, [user])

    return (
        <>
            <Head>
                <title>ورود | ثبت نام</title>

                <meta name="robots" content="noindex" />
            </Head>
            <div
                className={`relative min-h-screen bg-auth-bg bg-cover bg-cover bg-left-bottom bg-no-repeat md:pt-14 min-h-screen ${(loading || pageChangeLoading) ? 'opacity-0' : 'opacity-100'}`}>

                <div
                    className=' md:static bg-white p-6 flex flex-col md:rounded-xl md:w-104 w-full  min-h-screen md:min-h-full mx-auto'>
                    <div className=' flex justify-end mb-2'>
                        <>
                            <button className=' text-white bg-primary/80 px-2 py-2 rounded-lg flex items-center gap-x-1'
                                onClick={() => {
                                    router.push('/').then(() => dispatch(reset()))
                                }}>
                                <span className='text-sm'>بازگشت به سایت</span>
                                <ArrowLeftSvg color={"#fff"} width={14} height={14} />
                            </button>
                        </>
                    </div>
                    {/*<h2 className='mt-8 text-center font-semibold text-xl'>حساب کاربری</h2>*/}
                    {
                        formPage === 1 ? <h2 className=' text-center font-semibold text-xl'>حساب کاربری</h2> :
                            formPage === 2 ? <h2 className=' text-center font-semibold text-xl'> اطلاعات فردی</h2> :
                                formPage === 3 ? <h2 className=' text-center font-semibold text-xl'> رمز عبور</h2> :
                                    formPage === 4 ? <h2 className=' text-center font-semibold text-xl'> احراز هویت</h2> :
                                        <h2 className=' text-center font-semibold text-xl'> احراز هویت</h2>
                    }

                    <div className='mx-auto mt-6'>
                        {
                            formPage === 1 ? null : formPage === 2 ? <StepBar2of3Svg /> : formPage === 4 ?
                                <StepBar3Of3Svg /> : formPage === 3 ? <StepBar2Of2Svg /> : formPage === 5 ?
                                    <StepBar2Of2Svg /> : ''
                        }


                    </div>
                    {
                        formPage === 1 ? <AuthFormPhone dispatch={dispatch} /> : formPage === 2 ?
                            <AuthFormInfo dispatch={dispatch} phone={phone} /> : formPage === 4 ?
                                <AuthFormVerify user_info={user_info} token={token} dispatch={dispatch} /> : formPage === 5 ?
                                    <AuthFormVerify user_info={user_info} token={token}
                                        dispatch={dispatch} /> : formPage === 3 ?
                                        <AuthFormPassword dispatch={dispatch} phone={phone} /> : ''
                    }


                </div>
            </div>
        </>
    );
};

export default Auth;


