import { NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import CustomSelect from '../../../components/select/CustomSelect'
import DocumentSvg from '../../../components/svg/document/DocumentSvg'
import HeadPhonesSvg from '../../../components/svg/headphones/HeadPhonesSvg'
import SearchIcon from '../../../components/svg/search/searchSvg'
import TicketRow from '../../../components/ticket-row/main/TicketRow'
import TicketRowMobile from '../../../components/ticket-row/mobile/TicketRowMobile'
import MainLayout from '../../../layouts/mainLayout'
import Link from "next/link";
import {useAuth} from "../../../hooks/useAuth";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import {get_tickets, tickets} from "../../../redux/slices/ticketSlice";
import queryString from "querystring";
import ReactPaginate from "react-paginate";
import Head from "next/head";
import {Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";
import {privateAxios} from "../../../services/axiosInstances/privateAxios";


const urgencyOptions = [
    {
        name: 'کم',
        slug: 0
    },
    {
        name: 'متوسط',
        slug: 1
    },
    {
        name: 'زیاد',
        slug: 2
    },
]

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

const sortOptions = [
    {
        name: 'جدیدترین',
        slug: 'desc'
    },
    {
        name: 'قدیمی ترین',
        slug: 'asc'
    }
]


const Tickets: NextPage = () => {
    const [query, setQuery] = useState<any>()
    const [page , setPage] = useState(1)
    const [chartData, setChartData] = useState<any>([])
    const dispatch = useAppDispatch()
    const ticketsState = useAppSelector(tickets)

    const {user, loading} = useAuth()


    //get chart data
    useEffect(() => {

        user && user?.status?.id !== 0 && privateAxios().get('/chart-admin')
            .then((res) => {

                Object.entries(res.data.visit).map((item: any) => {

                    setChartData((prev: any) => [
                        ...prev,
                        {
                            name: new Date(+(item[0] + "000")).toLocaleDateString('fa', {
                                month: 'long',
                                day: 'numeric'
                            }),
                            ['بازدید سایت']: item[1].count,
                        }
                    ])
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [user])


    useEffect(() => {
        dispatch(get_tickets({query :queryString.stringify(query), page}))
    }, [query , page])

    useEffect(()=>{
        setPage(1)
    } , [query])


    const router = useRouter()
    if (user?.role.id !== 1 && !loading) {
        router.push('/')
        return <></>
    } else {

        return (
            <MainLayout hasBanner={false}>

                <Head>
                    <title>داشبورد-تیکت ها</title>

                </Head>

                <div className='container md:px-10'>
                    <div
                        className='md:bg-white py-4 md:px-7 px-4 md:shadow-xl shadow-none md:rounded-2xl md:my-5 mt-5 grid grid-cols-12 gap-y-14'>
                        <div
                            className='md:col-span-9 col-span-12 flex flex-row justify-start items-center gap-x-10 relative'>
                            <Link href='/panel/ticket'
                                  className='flex flex-row justify-start items-center gap-x-3 text-primary relative  before:absolute before:-bottom-7 before:h-1  before:bg-primary before:w-full'>
                                <HeadPhonesSvg width={26} height={26} color={"#005adc"}/>
                                <span className='text-lg text-primary font-bold'>تیکت ها</span>
                            </Link>
                            <Link href='/panel/blog'
                                  className='flex flex-row justify-start items-center gap-x-3  relative '>
                                <DocumentSvg width={26} height={26} color={"#E4E8EC"}/>
                                <span className='text-lg text-custom-gray-200/30 font-medium'>بلاگ ها</span>
                            </Link>
                            <div
                                className='h-1 bg-custom-gray-200/10 absolute md:hidden block w-full -bottom-7 rounded-lg'></div>
                        </div>
                        <div className='md:col-span-3 col-span-12 text-left'>
                            <div className="flex flex-row items-center lg:justify-start justify-center w-full ">
                                <div className="relative w-full ">
                                    <input
                                        type="text"
                                        placeholder="جستجو"
                                        className="w-full text-black bg-custom-gray-100 border-[0.8px] border-custom-gray-200/10 py-3 pr-10 rounded-lg placeholder:text-black placeholder:font-semibold focus:outline-none"
                                        onChange={e => setQuery((prev:any)=>({...prev , q: e.target.value}))}
                                    />
                                    <span className="absolute top-3 left-2 bg-primary/20 p-2 rounded-md">
                                <SearchIcon color="#005adc" width={12} height={12}/>
                            </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className='md:bg-white py-4 md:px-7 px-4 md:shadow-xl shadow-none md:rounded-2xl md:my-5 flex md:flex-row flex-col md:justify-between items-center gap-y-5'>
                        <div className="lg:w-[320px] w-full">
                            <CustomSelect
                                handleChange={value => setQuery((prev: any) => ({...prev, urgency: value?.slug}))}
                                name='sort' options={urgencyOptions}
                                placeholder='اولویت سازی بر اساس'/>
                        </div>
                        <div className="lg:w-[320px] w-full">
                            <CustomSelect
                                handleChange={value => setQuery((prev: any) => ({...prev, department: value?.slug}))}
                                name='sort' options={departmentOptions}
                                placeholder='موضوع سازی بر اساس'/>
                        </div>
                        <div className="lg:w-[320px] w-full">
                            <CustomSelect
                                handleChange={value => setQuery((prev: any) => ({
                                    ...prev,
                                    _order: value?.slug,
                                    _sort: 'id'
                                }))}
                                name='sort' options={sortOptions}
                                placeholder='مرتب سازی بر اساس'/>
                        </div>

                    </div>


                    {
                        ticketsState?.results?.length > 0 ?
                            <>
                                {/* tickets titlebar */}
                                <div
                                    className='bg-primary py-4 md:px-7 px-4 md:flex flex-row justify-start items-center hidden rounded-xl'>
                                    <span className='basis-2/12 text-white text-lg'>موضوع</span>
                                    <span className='basis-2/12 text-white text-lg'>عنوان</span>
                                    <span className='basis-2/12 text-white text-lg'>اولویت</span>
                                    <span className='basis-5/12 text-white text-lg'>توضیحات</span>
                                    <span className='basis-1/12 text-white text-lg'>تاریخ</span>
                                </div>

                                {/* desktop tickets  */}
                                <div className='md:flex hidden flex-col gap-y-3 pb-10'>
                                    {ticketsState?.results?.length > 0 && ticketsState.results.map((item: any) => (
                                        <TicketRow key={item.toString()} data={item} departments={departmentOptions}
                                                   urgencies={urgencyOptions}/>
                                    ))}
                                </div>

                                {/* mobile tickets */}
                                <div className='md:hidden flex flex-col gap-y-5 pb-10'>
                                    {ticketsState?.results?.length > 0 && ticketsState?.results?.map((item: any) => (
                                        <TicketRowMobile key={item.toString()} data={item}/>
                                    ))}
                                </div>

                                <ReactPaginate pageCount={Math.ceil(ticketsState?.count / 5)}
                                               nextLabel={'>'}
                                               nextLinkClassName='text-primary'
                                               previousLinkClassName='text-primary'
                                               previousLabel={'<'}
                                               forcePage={page-1}
                                               onPageChange={selectedItem =>{
                                                   // router.push({
                                                   //         pathname: router.pathname,
                                                   //         query: `_page=${selectedItem.selected + 1}`,
                                                   //     }
                                                   // )
                                                   setPage(selectedItem.selected + 1)
                                               }
                                               }
                                               activeClassName=' text-white'
                                               activeLinkClassName='bg-primary text-white w-full h-full flex items-center justify-center'
                                               className='flex items-center gap-x-4 justify-center mb-8'
                                               pageLinkClassName=' rounded-lg flex items-center justify-center w-8 h-8'
                                               pageClassName='bg-primary/20 text-primary rounded-lg flex items-center justify-center w-8 h-8'
                                />

                            </>
                            :
                            <>
                                <p className='text-center'>
                                    تیکتی ثبت نشده است
                                </p>
                            </>
                    }

                    <h2 className='text-xl mt-4'>بازدید هفتگی سایت : </h2>
                    <div className='w-full mt-8 h-96' dir='ltr'>

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

                                <Bar dataKey="بازدید سایت" stackId='a' fill="#82ca9d">
                                    <LabelList
                                        position="middle"
                                        fill={"#fff"}
                                        valueAccessor={(entry: any) => entry['بازدید سایت']}
                                        // formatter={formatCurrencyValue}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </MainLayout>
        )
    }

}
export default Tickets


