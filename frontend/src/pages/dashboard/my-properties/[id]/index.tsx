import {NextPageWithLayout} from "../../../_app";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../hooks/useAuth";
import {privateAxios} from "../../../../services/axiosInstances/privateAxios";
import DashboardLayout from "../../../../layouts/dashboardLayout";
import InfoCircleSvg from "../../../../components/svg/info-circle/InfoCircleSvg";
import SinglePropertyDetail from "../../../../components/single-property-detail/SinglePropertyDetail";
import Link from "next/link";
import {GetServerSideProps} from "next";
import axios from "axios";
import Head from "next/head";
import BasketSvg from "../../../../components/svg/basket/basketSvg";
import {addNardeban, createOrder, getPackages, getSinglePackages} from "../../../../services/api/packages";
import {useAppSelector} from "../../../../hooks/useRedux";
import {userState} from "../../../../redux/slices/userSlice";
import toast from "react-hot-toast";
import LogoutModal from "../../../../components/logout-modal/LogoutModal";
import VipModal from "../../../../components/vip-modal/vipModal";


const path = [
    {
        name: 'ثبت ملک'
    },
]

const MyProperty: NextPageWithLayout = ({activePosts}: any) => {


    const router = useRouter()
    const user = useAppSelector(userState)
    const {query} = router;
    const [data, setData] = useState<any>([])
    const [infoAlert, setInfoAlert] = useState<boolean>(true)
    const [upgrade, setUpgrade] = useState(1)
    const [packages, setPackages] = useState<any>([])
    const [loading, setLoading] = useState(true)

    const [vipModal, setVipModal] = useState(false)

    useEffect(() => {
        setLoading(true)
        const res = getSinglePackages()
            .then((res) => {
                setPackages(res)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [])


    //TODO
    //Buy single packages
    const sendOrder = async (id: any, adId: any) => {

        createOrder({package: id, ad_id: +adId})
            .then(res => {
                router.push(res?.zp?.url)
            })
            .catch((err) => {
                if (err.response.status === 405) {
                    setVipModal(true)
                }
            })

    }

    //TODO
    //add nardeban to post if user has nardeban in his/her package
    const add_nardeban = async (adId: any) => {
        addNardeban({subject_type: 1, post_id: +adId})
            .then(res => {
                toast.success(res.detail)
            })
            .catch((err) => {
                toast.error(err.response.data.detail)
                router.reload()
            })
    }

    //TODO
    //send an sms to user when vip has a place
    const handleNotifToMe = () => {
        privateAxios().post('/vip-notif', {ad_id: data.id})
            .then(() => {
                toast.success("در لیست انتظار ثبت شده اید")
                setVipModal(false)
            })
            .catch((err) => {
                toast.error("خطایی رخ داده است")
                setVipModal(false)
            })
    }


    useEffect(() => {
        if (query.id && user) {
            if (user?.role?.id === 4 || query.status === '1' || user?.role?.id === 3) {
                try {
                    const response = privateAxios().get(`post/${query?.id}/`).then(res => setData(res?.data.ad))
                } catch (err) {

                }
            } else {
                try {
                    const response = privateAxios().get(`preview/${query?.id}`).then(res => setData(res?.data))
                        .catch((err) => {
                            if (err.response?.status === 404) {
                                // router.push('/')
                            }
                        })
                } catch (err) {

                }
            }
        }

    }, [query.id, user])

    return (
        <DashboardLayout>

            {
                vipModal &&
                <div
                    className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                    style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                >
                    <VipModal vipModal={vipModal} setVipModal={setVipModal} handleNotifToMe={handleNotifToMe}/>
                </div>
            }

            <Head>
                <title>داشبورد-آگهی من</title>

            </Head>

            <div className=" mx-auto">
                <div className="space-y-5 pb-20">
                    <div
                        className="bg-white py-3 px-4 mt-2  box-shadow-1 rounded-xl flex flex-row justify-between items-center">
                        <div className="flex flex-row justify-center items-center gap-x-10 h-full">
                            <div
                                onClick={() => setUpgrade(1)}
                                className={` h-full  text-base relative cursor-pointer ${upgrade === 1 ? 'text-primary font-bold before:absolute before:-bottom-6 before:h-1 before:rounded-t-full before:bg-primary  before:w-full ' : 'text-custom-gray-200 font-normal'}`}>پیش
                                نمایش
                            </div>
                            <div
                                onClick={() => {
                                    //TODO
                                    //it must uncommented when payment active
                                    setUpgrade(2)
                                }}
                                className={` relative cursor-pointer ${upgrade === 2 ? 'text-primary before:absolute before:-bottom-6 before:h-1 before:rounded-t-full before:bg-primary  before:w-full font-bold' : "text-custom-gray-200 font-normal"}`}>ارتقا(به
                                زودی)
                            </div>
                        </div>
                        <Link
                            href={data.status === 1 ? `/dashboard/my-properties/${query?.id}/edit?active=true` : `/dashboard/my-properties/${query?.id}/edit`}
                            className="border-[0.6px] border-black py-3 px-10 rounded-lg cursor-pointer">
                            <div className="text-black text-sm font-medium">ویرایش</div>
                        </Link>
                    </div>
                    {
                        upgrade === 1 ?
                            //preview page
                            <>
                                {
                                    (infoAlert && data.status !== 1 && data.status !== 3) &&
                                    <div
                                        className="bg-primary-100/30 p-4 mb-6  rounded-xl flex sm:flex-row flex-col justify-between sm:items-center items-end gap-y-3">
                                        <div
                                            className="flex flex-row justify-center items-center gap-x-5 h-full text-right">

                                            <span className="md:block hidden"><InfoCircleSvg/> </span>
                                            <div className="text-primary h-full font-bold text-base leading-8">پست شما
                                                پس از تایید نهایی پشتیبان های ما آپلود خواهد شد
                                            </div>
                                        </div>
                                        <div className="px-6 cursor-pointer" onClick={(e) => setInfoAlert(false)}>
                                            <span className="text-black text-sm font-medium">متوجه شدم</span>
                                        </div>
                                    </div>
                                }
                                {Object.keys(data).length > 0 &&
                                    <div className=" grid grid-cols-12 pt-3"><SinglePropertyDetail
                                        activePosts={activePosts} data={data} inDashboard={true}/></div>}
                            </>
                            :
                            //Upgrade Items
                            <>
                                <div className='grid grid-cols-12 gap-4'>

                                    {
                                        packages.length > 0 ?
                                            packages.map((item: any) => {
                                                return (
                                                    <div key={item.id} className='col-span-12 md:col-span-6'>
                                                        {/*an item*/}
                                                        {
                                                            item.id === 4 ?
                                                                user?.nardeban_count === 0 ?
                                                                    <button
                                                                        //TODO
                                                                        disabled={true}
                                                                        onClick={() => sendOrder(item?.id, query.id)}
                                                                        className='bg-white w-full box-shadow-3 flex flex-col h-full justify-between text-right rounded-2xl overflow-hidden'>
                                                                        <h3 className='p-5 text-3xl font-bold text-primary'>{item?.name}</h3>
                                                                        <p className='px-5 text-custom-gray-200 flex-1'>
                                                                            {
                                                                                item?.description
                                                                            }
                                                                        </p>

                                                                        {/*  card footer  */}

                                                                        <button
                                                                            //TODO
                                                                            disabled={true}
                                                                            className='flex justify-between p-4 bg-primary disabled:bg-custom-gray-200 text-white mt-3 w-full'>
                                                                            <p className='flex items-center gap-x-1'>
                                                                                <span>{item?.price}</span>
                                                                                <span>تومان</span>
                                                                            </p>
                                                                            <p className='flex gap-x-1 items-center'>
                                                                                <BasketSvg color='#fff' width={16}
                                                                                           height={16}/>
                                                                                <span>خرید</span>
                                                                            </p>
                                                                        </button>
                                                                    </button>
                                                                    :
                                                                    <button
                                                                        disabled={true}
                                                                        onClick={() => add_nardeban(query.id)}
                                                                        className='bg-white w-full box-shadow-3 flex flex-col h-full justify-between text-right rounded-2xl overflow-hidden'>
                                                                        <h3 className='p-5 text-3xl font-bold text-primary'>{item?.name}</h3>
                                                                        <p className='px-5 text-custom-gray-200 flex-1'>
                                                                            {
                                                                                item?.description
                                                                            }
                                                                        </p>

                                                                        {/*  card footer  */}

                                                                        <button
                                                                            //TODO
                                                                            disabled={true}
                                                                            className='flex justify-between p-4 bg-primary disabled:bg-custom-gray-200 text-white mt-3 w-full'>
                                                                            <p className='flex items-center gap-x-1'>
                                                                                <span>{item?.price}</span>
                                                                                <span>تومان</span>
                                                                            </p>
                                                                            <p className='flex gap-x-1 items-center'>
                                                                                <BasketSvg color='#fff' width={16}
                                                                                           height={16}/>
                                                                                <span>خرید</span>
                                                                            </p>
                                                                        </button>
                                                                    </button>
                                                                :
                                                                <button
                                                                    //TODO
                                                                    disabled={true}
                                                                    onClick={() => sendOrder(item?.id, query.id)}
                                                                    className='bg-white flex flex-col h-full w-full justify-between box-shadow-3 text-right rounded-2xl overflow-hidden'>
                                                                    <h3 className='p-5 text-3xl font-bold text-primary'>{item?.name}</h3>
                                                                    <p className='px-5 text-custom-gray-200 flex-1'>
                                                                        {
                                                                            item?.description
                                                                        }
                                                                    </p>

                                                                    {/*  card footer  */}

                                                                    <button
                                                                        //TODO
                                                                        disabled={true}
                                                                        className='flex w-full justify-between p-4 bg-primary disabled:bg-custom-gray-200 text-white mt-3'>
                                                                        <p className='flex items-center gap-x-1'>
                                                                            <span>{item?.price}</span>
                                                                            <span>تومان</span>
                                                                        </p>
                                                                        <p className='flex gap-x-1 items-center'>
                                                                            <BasketSvg color='#fff' width={16}
                                                                                       height={16}/>
                                                                            <span>خرید</span>
                                                                        </p>
                                                                    </button>
                                                                </button>
                                                        }
                                                    </div>
                                                )
                                            })
                                            :
                                            null

                                    }

                                </div>
                            </>
                    }
                </div>
            </div>
        </DashboardLayout>
    );
};


export default MyProperty;


export const getServerSideProps: GetServerSideProps = async (context) => {


    // const res =await privateAxios().get(`post/${id}`)
    const res = await axios.get(`https://api.villaarzan.com/my-ad/?status=1`, {
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            Cookie: context.req.headers.cookie,
        },
    })


    return {
        props: {
            activePosts: JSON.parse(JSON.stringify(res.data)),
        }
    }
}