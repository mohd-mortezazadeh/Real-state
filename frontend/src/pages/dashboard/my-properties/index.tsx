import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import PropertyCard from '../../../components/property-card/PropertyCard'
import CustomSelect from '../../../components/select/CustomSelect'
import SearchIcon from '../../../components/svg/search/searchSvg'
import DashboardLayout from '../../../layouts/dashboardLayout'
import useMyProperties from "../../../hooks/useMyProperties";
import {useRouter} from "next/router";
import queryString from "querystring";
import {GetServerSideProps} from "next";
import EmptyData from '../../../components/empty-data/EmptyData'
import DirectSvg from '../../../components/svg/direct/DirectSvg'
import MyPropertyDeleteModal from '../../../components/my-properties-delete/myPropertyDeleteModal'
import Head from "next/head";
import _debounce from "lodash/debounce";
import PropertyCardSkeleton from "../../../components/property-card-skeleton/propertyCardSkeleton";


const options = [
    {
        slug: 'asc',
        id: 1,
        name: 'قدیمی ترین'
    },
    {
        slug: 'desc',
        id: 2,
        name: 'جدیدترین'
    },
]


const MyProperties = ({query}: any) => {

    const router = useRouter()

    const queries = queryString.stringify(query)

    const [search, setSearch] = useState<any>('')

    const [sortVal, setSortVal] = useState<any>()



    const [page, setPage] = useState(1)

    const [refresh, setRefresh] = useState(false)

    const {results, isError, isLoading, error, hasNextPage} = useMyProperties(page, queries)


    const [openModal,setOpenModal]= useState<boolean>(false)
    const [propertyId,setPropertyId] = useState(null)

    const filpRef = useRef<HTMLDivElement>(null)

    const intObserver: any = useRef()

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


    useEffect(() => {
        setPage(1)

    }, [queries])

    // useEffect(() => {
    //
    //     router?.query?.q && setSearch(router?.query?.q)
    // }, [router?.query?.q])


    useEffect(() => {
        const selectedOption = router?.query?._order && options.find(item => item.slug === router.query._order)
        setSortVal(selectedOption)
    }, [router?.query?._order])


    const handleDeleteMyProperties = (id: number) => {
        const deleteIndex = results.findIndex((post: any) => {
            return post.id === id
        })

        results.splice(deleteIndex, 1)

        setRefresh(prevState => !prevState)
    }


    //create post cards
    const content = results?.map((property: any, i: any) => {

        if (results.length === i + 1) {

            return <div key={property.id} className="lg:col-span-4  md:col-span-6 col-span-12">
                <PropertyCard setPropertyId={setPropertyId} setOpenModal={setOpenModal} inMyAds={true} data={property}
                              ref={lastPostRef}

                />
            </div>

        }

        return (
            <div key={property.id} className="lg:col-span-4 md:col-span-6 col-span-12">
                <PropertyCard  setPropertyId={setPropertyId} setOpenModal={setOpenModal} inMyAds={true} data={property}/>
            </div>
        )

    })


    const handleFilterProperties = (status: number | null) => {
        delete router?.query?.status

        if (status === null) {
            router.push({
                query: `${queryString.stringify(router?.query)}`
            })
        } else {
            router.push({
                query: `status=${status}&${queryString.stringify(router?.query)}`
            })
        }

    }

    const handleSortProperties = (value: any) => {

        delete router?.query?._sort
        delete router?.query?._order

        if (value === null) {
            router.push({
                query: `${queryString.stringify(router.query)}`
            })
        } else {
            router.push({
                query: `${queryString.stringify(router.query)}&_sort=id&_order=${value?.slug}`
            })
        }
    }


    const handleChangeSearch = (e: any) => {
        delete router.query.q
        // setSearch(e?.target?.value)
        router.push({
            query: `${queryString.stringify(router.query)}&q=${e?.target?.value}`
        })
    }

    const debounceFn = useCallback(_debounce(handleChangeSearch, 500), []);


    return (
        <DashboardLayout>

            <Head>
                <title>داشبورد-آگهی های من</title>

            </Head>

            <div className="grid grid-cols-12 gap-y-6 px-4 py-3 bg-white box-shadow-1 rounded-xl mb-6 mt-4">
            {
                openModal &&
                <div
                    className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                    style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                >
                    <MyPropertyDeleteModal PropertyId={propertyId} setOpenModal={setOpenModal} handleDeleteMyProperties={handleDeleteMyProperties}/>
                </div>
            }
                <div className="lg:col-span-5 col-span-12 flex flex-row items-center lg:justify-start justify-center ">
                    <div className="relative w-full ">
                        <input
                            type="text"
                            placeholder="جستجو"
                            onChange={debounceFn}
                            className="w-full text-black bg-custom-gray-100 border-[0.8px] border-custom-gray-200/10 py-2 pr-10 rounded-lg placeholder:text-black placeholder:font-semibold focus:outline-none"
                        />
                        <span className="absolute top-3 right-4">
                <SearchIcon color="#292D32" width={18} height={18}/>
              </span>
                    </div>
                </div>
                <div className="lg:col-span-7 col-span-12 flex flex-row items-center lg:justify-end justify-center">
                    <div className="lg:w-[320px] w-full">
                        <CustomSelect value={sortVal} handleChange={handleSortProperties} options={options} name='sort'
                                      placeholder='مرتب سازی بر اساس'/>
                    </div>
                </div>
            </div>
            <div
                className="bg-white text-custom-gray-200 p-4 mt-2  box-shadow-1 rounded-xl flex flex-row justify-start items-center flex-wrap gap-x-10 gap-y-10">
                <div
                    className={`h-full  cursor-pointer  relative ${!router?.query?.status && 'text-base font-bold text-primary  before:absolute before:-bottom-4 before:h-1 before:rounded-t-full before:bg-primary before:w-full'} `}
                    onClick={() => handleFilterProperties(null)}
                >همه
                </div>
                <div
                    className={`text-custom-gray-200 relative cursor-pointer ${router?.query?.status === '1' && 'text-base font-bold text-primary  before:absolute before:-bottom-4 before:h-1 before:rounded-t-full before:bg-primary before:w-full'} `}
                    onClick={() => handleFilterProperties(1)}>ثبت شده
                </div>
                <div
                    className={`text-custom-gray-200  relative cursor-pointer ${router?.query?.status === '0' && 'text-base font-bold text-primary  before:absolute before:-bottom-4 before:h-1 before:rounded-t-full before:bg-primary before:w-full'} `}
                    onClick={() => handleFilterProperties(0)}
                >در صف انتظار
                </div>
                <div
                    className={`text-custom-gray-200 relative cursor-pointer ${router?.query?.status === '-1' && 'text-base font-bold text-primary  before:absolute before:-bottom-4 before:h-1 before:rounded-t-full before:bg-primary before:w-full'} `}
                    onClick={() => handleFilterProperties(-1)}
                >رد شده
                </div>
                {/*<div className="text-custom-gray-200 font-normal relative cursor-pointer"*/}
                {/*    // onClick={() => handleFilterProperties(1)}*/}
                {/*>منقضی شده*/}
                {/*</div>*/}

            </div>
            {/*<div className='flex flex-row justify-start items-center gap-x-8 my-7'>*/}
            {/*    <div className='flex flex-row justify-start items-center gap-x-3 gap-y-4'>*/}
            {/*        <span className='w-[8px] h-[19px] bg-custom-gold rounded-full'></span>*/}
            {/*        <span className='font-semibold'>یک هفته باقی مانده تا انقضا</span>*/}
            {/*    </div>*/}
            {/*    <div className='flex flex-row justify-start items-center gap-x-3 gap-y-4'>*/}
            {/*        <span className='w-[8px] h-[19px] bg-custom-red rounded-full'></span>*/}
            {/*        <span className='font-semibold'>دو روز باقی مانده تا انقضا</span>*/}
            {/*    </div>*/}
            {/*</div>*/}



            {
                isError ?
                    <p>
                        <>
                            {error.message}
                        </>
                    </p>
                    :isLoading ?
                        <div className='grid grid-cols-12 gap-x-5 xl:gap-x-2 gap-y-6 pb-20 mt-5'>


                                {
                                    [1,2,3,4].map((item: any)=>{
                                        return(

                                            <div key={item} className="flex lg:col-span-4 md:col-span-6 col-span-12  items-center gap-y-2 justify-center pt-8">
                                                <PropertyCardSkeleton key={item}/>
                                            </div>
                                        )
                                    })
                                }

                        </div>
                        : results.length > 0 ?
                            <div className="grid grid-cols-12 gap-x-5 xl:gap-x-2 gap-y-6 pb-20 mt-5">

                                {content}
                            </div>
                            :
                            search || query.status ?
                                <div
                                    className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                                    <EmptyData
                                        title={<div className='text-lg font-semibold'>نتیجه ای با جستجوی شما یافت
                                            نشد </div>}
                                        hasButton={false}
                                        buttonTitle="ثبت اولین آگهی "
                                        Icon={() => <DirectSvg/>}
                                        href="/add-property"
                                    />
                                </div>
                                :
                                <div
                                    className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                                    <EmptyData
                                        title={<div className='text-lg font-semibold'>شما در حال حاضر هیچ آگهی ثبت
                                            نکردید </div>}
                                        hasButton={true}
                                        buttonTitle="ثبت اولین آگهی "
                                        Icon={() => <DirectSvg/>}
                                        href="/add-property"
                                    />
                                </div>
            }


        </DashboardLayout>
    )
}

export default MyProperties

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {query} = context


    return {
        props: {
            query: query
        }
    }

}

