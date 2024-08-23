import React, {useState, useEffect} from 'react'
import AddTicketModal from '../../../components/add-ticket/modal/addTicketModal'
import CustomSelect from '../../../components/select/CustomSelect'
import CircleCloseSvg from '../../../components/svg/circle-close/CircleCloseSvg'
import SearchIcon from '../../../components/svg/search/searchSvg'
import TicketSvg from '../../../components/svg/ticket/TicketSvg'
import TicketCard from '../../../components/ticket-card/ticketCard'
import TicketChatBox from '../../../components/ticket-chat-box/ticketChatBox'
import DashboardLayout from '../../../layouts/dashboardLayout'
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import { get_tickets_user, tickets} from "../../../redux/slices/ticketSlice";
import queryString from "querystring";
import Head from "next/head";
import {useRouter} from "next/router";


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


const Tickets = () => {

    const dispatch = useAppDispatch()
    const ticketsState = useAppSelector(tickets)

    const [query, setQuery] = useState<any>()

    const router = useRouter()


    const [ticketId, setTicketId] = useState<number | string | string[] | null | undefined>(+router?.query?.id!)
    const [openChatModal, setOpenChatModal] = useState<boolean>(false)
    const [openAddTicketModal, setOpenAddTicketModal] = useState<boolean>(false)


    const handleClick = (value: any) => {
        setTicketId(value)

        if (innerWidth < 768) {
            setOpenChatModal(true)

        }
    }

    useEffect(() => {
        //get user tickets every time query change
        dispatch(get_tickets_user(queryString.stringify(query)))
    }, [query])


    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            if (window.innerWidth > 768) {
                setOpenChatModal(false)
            }
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        // handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [])


    useEffect(() => {
        openChatModal ? document?.querySelector('body')!.classList.add('overflow-hidden') : document?.querySelector('body')!.classList.remove('overflow-hidden')
        openAddTicketModal ? document?.querySelector('body')!.classList.add('overflow-hidden') : document?.querySelector('body')!.classList.remove('overflow-hidden')

    }, [openChatModal, openAddTicketModal])


    return (
        <DashboardLayout>
            <Head>
                <title>داشبورد-تیکت</title>

            </Head>
            <div
                className='md:bg-white py-4 md:px-7 md:shadow-xl shadow-none md:rounded-2xl md:my-5 flex md:flex-row flex-col md:justify-between items-center gap-y-5 gap-x-5'>

                {/* open add ticket modal */}

                {
                    openAddTicketModal &&
                    <div
                        className='backdrop-blur-md w-full h-full fixed top-0 pt-3 left-0 z-50 flex flex-col items-center justify-start'
                        // onClick={(e)=>setOpenAddTicketModal(false)}
                        style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                    >
                        <AddTicketModal setOpenAddTicketModal={setOpenAddTicketModal}/>
                    </div>
                }

                {/* open chat box modal */}
                {
                    openChatModal &&
                    <div
                        className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-start'
                        // onClick={(e)=>setOpenChatModal(false)}
                        style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                    >
                        <span className={`flex flex-col justify-center items-center bg-custom-red rounded-full p-1 my-2`}
                      onClick={(e) => setOpenChatModal(false)}
                          >
                             <CircleCloseSvg/>
                        </span>
                        <TicketChatBox ticketId={ticketId}/>
                    </div>
                }
                <div
                    className="relative bg-white order-2 md:order-1  w-full md:w-[300px] h-[50px]  border-[0.8px] border-custom-gray-200/10 rounded-lg">
                    <input
                        type="text"
                        placeholder="جستجو"
                        className="w-4/5 z-10 text-black bg-transparent py-3 pr-10  placeholder:text-black placeholder:font-semibold focus:outline-none"
                        onChange={e => setQuery((prev:any)=>({...prev , q: e.target.value}))}
                    />
                    <span className="absolute top-3 left-2 bg-primary/20 p-2 rounded-md ">
                    <SearchIcon color="#005adc" width={12} height={12}/>
                </span>
                </div>
                <div
                    className='order-1 md:order-2 bg-primary-lin h-[50px]  md:w-[210px] w-full flex flex-row justify-center items-center gap-x-2 rounded-lg cursor-pointer '
                    onClick={(e) => setOpenAddTicketModal(true)}
                >
                    <TicketSvg color='white' width={20} height={20}/>
                    <span className='text-white text-sm '>ثبت تیکت</span>
                </div>
            </div>
            <div className='grid grid-cols-12 gap-x-2'>
                <div className='md:col-span-4 col-span-12 flex flex-col gap-y-5 '>
                    <div
                        className='bg-white py-6 md:px-7 px-3  rounded-lg  md:shadow-xl shadow-none md:rounded-2xl flex flex-col md:justify-between items-center gap-y-5 md:mt-0 mt-3'>
                        <div className=" w-full ">
                            <CustomSelect handleChange={value => setQuery((prev:any)=>({...prev , urgency: value?.slug}))} name='sort'
                                          options={urgencyOptions}
                                          placeholder='اولویت سازی بر اساس'/>
                        </div>
                        <div className=" w-full">
                            <CustomSelect handleChange={value => setQuery((prev:any)=>({...prev , department: value?.slug}))} name='sort' options={departmentOptions}
                                          placeholder='موضوع سازی بر اساس'/>
                        </div>
                        <div className=" w-full">
                            <CustomSelect handleChange={value => setQuery((prev:any)=>  ({...prev , _order: value?.slug,_sort : 'id'}))} name='sort' options={sortOptions}
                                          placeholder='مرتب سازی بر اساس'/>
                        </div>
                    </div>
                    {
                        ticketsState &&
                        ticketsState?.map((item: any) =>
                            <TicketCard isActive={item?.id === ticketId} key={item.id} data={item} handleClick={handleClick}/>
                        )
                    }
                    {/*<TicketCard isActive={true} data={ticketObject} handleClick={handleClick}/>*/}

                </div>
                <div className='md:col-span-8 md:block hidden '>
                    <TicketChatBox ticketId={ticketId}/>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Tickets
