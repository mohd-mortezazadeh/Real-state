import {NextPage} from "next";
import React, {useCallback, useEffect, useRef, useState} from 'react'
import EstateCard from "../../../components/estate-card/estateCard";
import DashboardLayout from "../../../layouts/dashboardLayout";
import queryString from "querystring";
import {useRouter} from "next/router";
import useAdvisorsByStatus from "../../../hooks/useAdvisorsByStatus";
import MyAdvisorModal from "../../../components/my-adviros-modal/myAdvisorModal";
import Loading from "../../../components/loading/Loading.component";
import DirectSvg from "../../../components/svg/direct/DirectSvg";
import EmptyData from "../../../components/empty-data/EmptyData";
import Head from "next/head";


const MyAdvisors: NextPage = () => {

    const router = useRouter()

    const [page, setPage] = useState(1)

    const [status, setStatus] = useState<any>(1)

    const [advisorId, setAdvisorId] = useState<number | null>(null)

    const [refresh, setRefresh] = useState(true)

    const filpRef = useRef<HTMLDivElement>(null)


    const queries = queryString.stringify(router.query)

    useEffect(() => {
        setPage(1)
    }, [queries, status])


    const {
        isError,
        isLoading,
        results,
        hasNextPage,
        error
    } = useAdvisorsByStatus(page, queries, status, refresh)

    const intObserver: any = useRef()

    useEffect(() => {
        router.query?.status === '0' && setStatus(0)
    }, [router.query])


    const lastPostRef = useCallback((property: { isIntersecting: any; }[]) => {

        if (isLoading) return
        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(properties => {

            if (properties[0]?.isIntersecting && hasNextPage) {
                setPage(prev => prev + 1)
            }
        })

        if (property) intObserver.current.observe(property)
    }, [hasNextPage, isLoading])

    const [openModal, setOpenModal] = useState<any>({value: false, type: ''})

    //after set a new query page must begin from 1

    // filp filter button useEffect handler

    //create post cards
    const content = results?.map((property: any, i: any) => {

        if (results.length === i + 1) {
            return <div key={property.id} className="lg:col-span-4 md:col-span-6 col-span-12">
                <EstateCard setAdvisorId={setAdvisorId} setOpenModal={setOpenModal} status={property?.status}
                            ref={lastPostRef} data={property}/>
            </div>


        }

        return <div key={property.id} className="lg:col-span-4 md:col-span-6 col-span-12">
            <EstateCard setAdvisorId={setAdvisorId} setOpenModal={setOpenModal} status={property?.status}
                        data={property}/>
        </div>

    })

    const handleAdvisorStatus = (value: boolean | number) => {
        setStatus(value)
    }

    useEffect(() => {
        //overflow of screen hidden when modal open
        openModal?.value ? document?.querySelector('body')!.classList.add('overflow-hidden') : document?.querySelector('body')!.classList.remove('overflow-hidden')
    }, [openModal])


    return (
        <DashboardLayout>

            <Head>
                <title>داشبورد-مشاوران من</title>
            </Head>

            {
                openModal?.value &&
                <div
                    className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                    style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                >
                    <MyAdvisorModal setRefresh={setRefresh} advisorId={advisorId} openModal={openModal}
                                    setOpenModal={setOpenModal}/>
                </div>
            }
            <div className='flex flex-row justify-start items-center gap-x-10 relative bg-white rounded-md p-4 my-4'>
                <button
                    onClick={() => handleAdvisorStatus(1)}
                    className={`flex flex-row justify-start items-center gap-x-3 text-primary relative ${status === 1 && ' before:rounded-t-md before:absolute before:-bottom-4 before:h-1  before:bg-primary before:w-full'}`}>
                    <span
                        className={`sm:text-lg text-sm text-primary  ${status === 1 ? 'text-primary  font-bold' : 'text-custom-gray-200/30 font-medium'}`}>مشاوران فعال</span>
                </button>
                <button
                    className={`flex flex-row justify-start items-center gap-x-3  relative ${status === 0 && ' before:rounded-t-md before:absolute before:-bottom-4 before:h-1  before:bg-primary before:w-full'} `}
                    onClick={() => handleAdvisorStatus(0)}>
                    <span
                        className={`sm:text-lg  text-sm ${status === 0 ? 'text-primary  font-bold' : 'text-custom-gray-200/30 font-medium'}`}>مشاوران در انتظار تایید</span>
                </button>
            </div>
            <div className="grid grid-cols-12 gap-x-5 gap-y-6 pb-20 mt-5">
                {
                    isLoading ?
                        <div className="col-span-12 flex flex-row justify-center items-center my-20">
                            <Loading/>
                        </div>
                        :
                        results.length > 0 ?
                            content
                            :
                            <div
                                className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                                {
                                    status === 1 ?
                                        <EmptyData
                                            title={<div className='sm:text-lg text-sm font-semibold'>شما در حال حاضر مشاور فعالی ندارید
                                            </div>}
                                            hasButton={false}
                                            buttonTitle="ثبت اولین آگهی "
                                            Icon={() => <DirectSvg/>}
                                            href="/add-property"
                                        /> :
                                        <EmptyData
                                            title={<div className='sm:text-lg text-sm font-semibold'>شما در حال حاضر مشاور در انتظار تایید ندارید
                                            </div>}
                                            hasButton={false}
                                            buttonTitle="ثبت اولین آگهی "
                                            Icon={() => <DirectSvg/>}
                                            href="/add-property"
                                        />
                                }
                            </div>
                }
            </div>

        </DashboardLayout>
    );
};

export default MyAdvisors;