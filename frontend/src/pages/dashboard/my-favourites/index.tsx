import {useRouter} from "next/router";
import queryString from "querystring";
import React, {useCallback, useEffect, useRef, useState} from "react";
import PropertyCard from "../../../components/property-card/PropertyCard";
import DashboardLayout from "../../../layouts/dashboardLayout";
import SearchIcon from "../../../components/svg/search/searchSvg";
import CustomSelect from "../../../components/select/CustomSelect";
import {GetServerSideProps} from "next";
import useMyFavourites from "../../../hooks/useMyFavourites";
import EmptyData from "../../../components/empty-data/EmptyData";
import DirectSvg from "../../../components/svg/direct/DirectSvg";
import Head from "next/head";
import _debounce from 'lodash/debounce';
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

    // const [data, setData] = useState<any>([])

    const [search, setSearch] = useState<any>('')

    const [sortVal, setSortVal] = useState<any>()


    const [page, setPage] = useState(1)
    const [refresh, setRefresh] = useState(false)

    const [deleteId, setDeleteId] = useState<any>()

    const {results, isError, isLoading, error, hasNextPage} = useMyFavourites(page, queries)


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

    useEffect(() => {
        // router?.query?.q && setSearch(router?.query?.q)

        if (router?.query?.q === '') {

            delete router?.query?.q
        }
    }, [router?.query?.q])


    useEffect(() => {
        const selectedOption = router?.query?._order && options.find(item => item.slug === router.query._order)
        setSortVal(selectedOption)
    }, [router?.query?._order])


    //delete myfavourite posts when they are unbookmarked
    const handleDeleteMyFavourites = (id: number) => {
        const deleteIndex = results.findIndex((post: any) => {
            return post.id === id
        })

        results.splice(deleteIndex, 1)

        setRefresh(prevState => !prevState)
    }

    //create post cards
    const content = results?.map((property: any, i: any) => {

        if (results.length === i + 1) {

            return <div key={property.id} className="lg:col-span-4 md:col-span-6 col-span-12">
                <PropertyCard handleDeleteMyFavourites={handleDeleteMyFavourites} inMyFavorites={true} data={property}
                              ref={lastPostRef}/>
            </div>

        }

        return (
            <div key={property.id} className="lg:col-span-4 md:col-span-6 col-span-12">
                <PropertyCard handleDeleteMyFavourites={handleDeleteMyFavourites} inMyFavorites={true} data={property}/>
            </div>
        )

    })


    //filtering property cards base on status
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
                <title>داشبورد-علاقه مندی ها</title>
            </Head>

            <div className="grid grid-cols-12 gap-y-6 px-4 py-3 bg-white box-shadow-1 rounded-xl mb-6 mt-4">
                <div className="lg:col-span-5 col-span-12 flex flex-row items-center lg:justify-start justify-center ">
                    <div className="relative w-full ">
                        <input
                            type="text"
                            placeholder="جستجو"
                            // value={search}
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

            <div className="grid grid-cols-12 gap-x-5 gap-y-6 pb-20 mt-5">


                {
                    isLoading ?

                                [1,2,3,4].map((item: any)=>{
                                    return(

                                        <div key={item} className="flex lg:col-span-4 md:col-span-6 col-span-12  items-center gap-y-4 justify-center pt-8">
                                            <PropertyCardSkeleton key={item}/>
                                        </div>
                                    )
                                })


                        :
                        results.length > 0 ?
                            content
                            :
                            <div
                                className='col-span-12 flex flex-row justify-center items-center my-5 bg-white py-10 rounded-md'>
                                <EmptyData
                                    title={<div className='text-lg font-semibold'>علاقه مندی یافت نشد.</div>}
                                    hasButton={false}
                                    buttonTitle="ثبت اولین آگهی "
                                    Icon={() => <DirectSvg/>}
                                    href="/add-property"
                                />
                            </div>
                }


            </div>
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