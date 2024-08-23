import {NextPageWithLayout} from "../_app";
import DashboardLayout from "../../layouts/dashboardLayout";
import Statistics from "../../components/statistics/statistics";
import AdsSvg from "../../components/svg/ads/adsSvg";
import MyFavSvg from "../../components/svg/myFav/myFavSvg";
import ActiveAdvisorSvg from "../../components/svg/active-advisor/activeAdvisorSvg";
import RejectedAdvisorSvg from "../../components/svg/rejected-advisor/rejectedAdvisorSvg";
import PersonSvg from "../../components/svg/person/personSvg";
import {useAuth} from "../../hooks/useAuth";
import Link from 'next/link'
import axios from "axios";
import EmptyData from "../../components/empty-data/EmptyData";
import DirectSvg from "../../components/svg/direct/DirectSvg";
import React, {useEffect, useState} from "react";
import BasketSvg from "../../components/svg/basket/basketSvg";
import Head from "next/head";
import {privateAxios} from "../../services/axiosInstances/privateAxios";
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';
import CallSvg from "../../components/svg/call/CallSvg";
import LocationSvg from "../../components/svg/location/LocationSvg";
import UserSvg from "../../components/svg/user/userSvg";
import {useRouter} from "next/router";
import Loading from "../../components/loading/Loading.component";

const departmentOptions = [
    {
        name: 'پشتیبانی',
        slug: 0
    },
    {
        name: 'فروش',
        slug: 1
    },
    {
        name: 'فنی',
        slug: 2
    },
]

const statusOptions = [
    {
        name: 'بسته',
        slug: 0
    },
    {
        name: 'در انتظار پاسخ',
        slug: 2
    },
    {
        name: 'پاسخ داده شده',
        slug: 3
    },
]

const Dashboard: NextPageWithLayout = () => {

    const router = useRouter()

    const [chartData, setChartData] = useState<any>([])
    const [dashboardData, setDashboardData] = useState<any>()

    const [lastTickets, setLastTickets] = useState<any>([])

    useEffect(() => {
        privateAxios().get('/ticket/?_page=1&_limit=6')
            .then((res) => setLastTickets(res?.data?.results))
            .catch(err => console.log(err))
    }, [])

    const {user, loading, error} = useAuth()

    useEffect(() => {

        user && user?.status?.id !== 0 && axios.get('https://api.villaarzan.com/dashboard', {
                withCredentials: true,
            }
        ).then((res) => setDashboardData(res.data))

        user && user?.status?.id !== 0 && privateAxios().get('/chart')
            .then((res) => {

                Object.entries(res.data.ads).map((item: any) => {

                    setChartData((prev: any) => [
                        ...prev,
                        {
                            name: new Date(+(item[0] + "000")).toLocaleDateString('fa', {
                                month: 'long',
                                day: 'numeric'
                            }),
                            ['تعداد پست فعال']: item[1].count,
                            ['بازدید پست']: item[1].view
                        }
                    ])
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [user])


    return (

        <>
            <Head>
                <title>داشبورد</title>
            </Head>
            {
                (user) ?

                    user?.status?.id !== 0 ?
                        <>
                            <div className='bg-white rounded-lg p-4 py-6 w-full mt-4 '>
                                {/*statistics*/}
                                <div className='grid grid-cols-12 gap-6'>
                                    <Link href="/dashboard/my-properties" className='md:col-span-4 col-span-12'>
                                        <Statistics
                                            title='آگهی های فعال'
                                            titleSvg={<AdsSvg color='#005adc' width={18} height={18}/>}
                                            statisticNumber={dashboardData?.posts_count}
                                            statisticTitle='پست'/>
                                    </Link>

                                    <Link href="/dashboard/my-favourites" className='md:col-span-4 col-span-12'>
                                        <Statistics
                                            title='علاقه مندی ها'
                                            titleSvg={<MyFavSvg color='#005adc' width={18} height={18}/>}
                                            statisticNumber={dashboardData?.bookmark_count}
                                            statisticTitle='پست'/>
                                    </Link>

                                    <Link href={'/dashboard/orders'} className='md:col-span-4 col-span-12'>
                                        <Statistics
                                            title='سفارشات من'
                                            titleSvg={<BasketSvg color='#005adc' width={18} height={18}/>}
                                            statisticNumber={user?.order_count}
                                            statisticTitle='پست'/>
                                    </Link>


                                    {
                                        user?.role?.id === 4 &&
                                        <>
                                            <Link href={'/dashboard/my-advisors'} className='md:col-span-4 col-span-12'>
                                                <Statistics
                                                    title='مشاوران فعال'
                                                    titleSvg={<ActiveAdvisorSvg color='#005adc' width={18}
                                                                                height={18}/>}
                                                    statisticNumber={dashboardData?.active_advisor}
                                                    statisticTitle='مشاور'/>
                                            </Link>

                                            <Link href={'/dashboard/my-advisors?status=0'}
                                                  className='md:col-span-4 col-span-12'>
                                                <Statistics
                                                    title='مشاوران تایید نشده'
                                                    titleSvg={<RejectedAdvisorSvg color='#005adc' width={18}
                                                                                  height={18}/>}
                                                    statisticNumber={dashboardData?.pending_advisor}
                                                    statisticTitle='مشاور'/>
                                            </Link>

                                            <div className='md:col-span-4 col-span-12'>
                                                <Statistics
                                                    title='آگهی های مشاوران'
                                                    titleSvg={<PersonSvg color='#005adc' width={18} height={18}/>}
                                                    statisticNumber={dashboardData?.ad_advisor}
                                                    statisticTitle='پست'/>
                                            </div>
                                        </>
                                    }

                                    <div className='md:col-span-4 col-span-12'>
                                        <Statistics
                                            title='تعداد آگهی باقی مانده'
                                            titleSvg={<BasketSvg color='#005adc' width={18} height={18}/>}
                                            statisticNumber={user?.ad_count}
                                            statisticTitle='پست'/>
                                    </div>

                                    <div className='md:col-span-4 col-span-12'>
                                        <Statistics
                                            title='تعداد نردبان باقی مانده'
                                            titleSvg={<BasketSvg color='#005adc' width={18} height={18}/>}
                                            statisticNumber={user?.nardeban_count}
                                            statisticTitle='پست'/>
                                    </div>

                                </div>


                                {/*user information*/}
                                <div>
                                    <h3 className='text-lg my-5 mt-12'>اطلاعات فردی</h3>

                                    <div className='grid grid-cols-12 space-y-6'>

                                        <div className='col-span-12 md:col-span-6 flex items-center gap-x-2'>
                                            <figure className='w-16 h-16 rounded-full overflow-hidden '>
                                                <img className='w-full h-full object-cover' src={user?.avatar?.file}
                                                     alt=""/>
                                            </figure>
                                            <span
                                                className='text-lg font-bold break-words w-full break-all'>{user?.fullname}</span>
                                        </div>

                                        <div className='col-span-12 md:col-span-6 flex items-center gap-x-2'>
                                            <div className='flex items-center gap-x-3'>
                                                <div className='flex items-center gap-x-2'>
                                                    <CallSvg color='#005adc'/>
                                                    <span>شماره تماس</span>
                                                </div>
                                                <span>{user?.phone}</span>
                                            </div>
                                        </div>

                                        <div className='col-span-12 md:col-span-6 flex items-center gap-x-2'>
                                            <div className='flex items-center gap-x-3'>
                                                <div className='flex items-center gap-x-2'>
                                                    <UserSvg color='#005adc'/>
                                                    <span>نقش</span>
                                                </div>
                                                <span>{user?.role?.display_name}</span>
                                            </div>
                                        </div>

                                        <div className='col-span-12 md:col-span-6 flex items-center gap-x-2'>
                                            <div className='flex items-center gap-x-3'>
                                                <div className='flex items-center gap-x-2'>
                                                    <LocationSvg/>
                                                    <span>شهر</span>
                                                </div>
                                                <span>{user?.city?.name}</span>
                                            </div>
                                        </div>

                                        {
                                            (user?.role?.id === 4 || user?.role?.id === 3) &&
                                            <>
                                                <div className='col-span-12 md:col-span-6 flex items-center gap-x-2'>
                                                    <div className='flex items-center gap-x-3'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <PersonSvg color="#005adc" width={24} height={24}/>
                                                            <span>نام دفتر</span>
                                                        </div>
                                                        <span>{user?.company_name?.name}</span>
                                                    </div>
                                                </div>

                                                {
                                                    user?.role?.id !== 4 &&
                                                    <div
                                                        className='col-span-12 md:col-span-6 flex items-center gap-x-2'>
                                                        <div className='flex items-center gap-x-3'>
                                                            <div className='flex items-center gap-x-2'>
                                                                <CallSvg color='#005adc'/>
                                                                <span>شماره دفتر</span>
                                                            </div>
                                                            <span>{user?.company_name?.phone}</span>
                                                        </div>
                                                    </div>
                                                }
                                            </>


                                        }

                                    </div>

                                </div>


                                {/* chart*/}
                                <h3 className='text-lg my-5 mt-12'>نمودار تعداد و بازدید پست</h3>
                                {
                                    <div className='w-full h-96' dir='ltr'>
                                        <ResponsiveContainer className='overflow-hidden' width="100%" height="100%">
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={chartData}

                                            >
                                                <CartesianGrid strokeDasharray="3 10"/>

                                                <XAxis dataKey="name"/>
                                                <YAxis allowDecimals={false}/>

                                                <Tooltip/>
                                                <Legend/>

                                                <Bar dataKey="تعداد پست فعال" stackId='a' fill="#8884d8"
                                                     label={{position: 'middle', fill: "#fff"}}>
                                                    <LabelList
                                                        position="middle"
                                                        fill={"#fff"}
                                                        valueAccessor={(entry: any) => entry['تعداد پست فعال']}
                                                        // formatter={formatCurrencyValue}
                                                    />
                                                </Bar>
                                                <Bar dataKey="بازدید پست" stackId='a' fill="#82ca9d">
                                                    <LabelList
                                                        position="middle"
                                                        fill={"#fff"}
                                                        valueAccessor={(entry: any) => entry['بازدید پست']}
                                                        // formatter={formatCurrencyValue}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                }
                            </div>


                            {
                                lastTickets?.length > 0 &&
                                <div className='bg-white rounded-lg p-4 py-6 w-full mt-4 '>
                                    <h3 className='text-lg'>آخرین تیکت ها</h3>


                                    <div className="relative overflow-x-auto w-full mt-6">

                                        <table className="w-full border  table-auto">
                                            <thead
                                                className="border-b">
                                            <tr>
                                                <th className='text-right p-3 border' scope="col">
                                                    تاریخ ساخت
                                                </th>
                                                <th className='text-right p-3 border' scope="col">
                                                    وضعیت
                                                </th>
                                                <th className='text-right p-3 border hidden md:block' scope="col">
                                                    عنوان
                                                </th>
                                                <th className='text-right p-3 border' scope="col">
                                                    بخش
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {
                                                lastTickets.map((ticket: any) => {
                                                    return <tr
                                                        onClick={() => router.push(`/dashboard/tickets?id=${ticket.id}`)}
                                                        key={ticket?.id}
                                                        className="hover:bg-custom-gray-200/20 cursor-pointer">
                                                        <td scope="row"
                                                            className="p-3 text-sm">
                                                            {new Date(+ticket?.created_at).toLocaleDateString('fa', {
                                                                hour: "numeric",
                                                                minute: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: "numeric"
                                                            })}
                                                        </td>
                                                        <td className={`p-3 w-36 md:w-auto`}>
                                                        <span
                                                            className={` px-2 py-1 text-xs rounded text-white ${+ticket.status === 0 ? 'bg-red-500' : +ticket.status === 2 ? 'bg-yellow-600' : 'bg-green-600'}`}>
                                                            {statusOptions.find(item => item.slug === +ticket.status)?.name}
                                                        </span>
                                                        </td>
                                                        <td className="hidden md:block p-3">
                                                            {
                                                                ticket?.title
                                                            }
                                                        </td>
                                                        <td className="p-3">
                                                            {departmentOptions.find(item => item.slug === ticket.department)?.name}
                                                        </td>
                                                    </tr>
                                                })
                                            }

                                            </tbody>
                                        </table>
                                    </div>


                                </div>
                            }

                        </>
                        :
                        <>
                            <div className='mt-24'>
                                <EmptyData
                                    title={<div className='text-lg font-semibold'>حساب کاربری شما غیرفعال میباشد</div>}
                                    hasButton={false}
                                    buttonTitle="ثبت اولین آگهی "
                                    Icon={() => <DirectSvg/>}
                                    href="/add-property"
                                />
                            </div>
                        </>
                    :
                    <div className="flex flex-row justify-center pt-8">
                        <Loading/>
                    </div>

            }
        </>
    );
};


Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Dashboard;


// export const getServerSideProps: GetServerSideProps = async (context) => {
//
//
//     // const response = await axios.get('http://api.villaarzan.com/dashboard', {
//     //         withCredentials: true,
//     //         headers: {
//     //             Cookie: context.req.headers.cookie
//     //         }
//     //     }
//     // )
//
//     const response = context.req?.headers?.cookie && await privateAxios().get('/ticket/?_page=1&_limit=6', {
//         withCredentials: true,
//         headers: {
//             Cookie: context.req.headers.cookie
//         }
//     })
//
//
//     return {
//         props: {
//             lastTickets: response ? response?.data?.results : null
//         }
//     }
// }
