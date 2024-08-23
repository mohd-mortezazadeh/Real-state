import React, {useState} from 'react';
import SearchIcon from "../../../components/svg/search/searchSvg";
import CloseIcon from "../../../components/svg/close/closeSvg";
import useProperties from "../../../hooks/useProperties";
import queryString from "querystring";
import {useDebounce} from "../../../hooks/useDebounce";
import Link from "next/link";
import ArrowLeftSvg from "../../../components/svg/arrows/arrow-left/ArrowLeftSvg";
import {useRouter} from "next/router";

interface SearchHeader {
    setOpenSearch: any,
    openSearch: any
}

const SearchHeader = ({setOpenSearch, openSearch}: SearchHeader) => {
    const router = useRouter()
    const [searchMsg, setSearchMsg] = useState({
        q: ''
    })

    const debouncedSearch = useDebounce(searchMsg, 300)
    const {results, isLoading, isError} = useProperties(1, queryString.stringify(debouncedSearch), 4)

    return (
        <>
            <div onClick={() => {
                setOpenSearch(false)
                document.body.classList.remove('overflow-hidden')
            }}
                 className='min-h-screen z-30 w-full absolute bg-transparent bg-gray-300/20'>

            </div>
            <div className='relative bg-red-500  z-50 lg:flex flex-col hidden'>

                {/*search bar*/}
                <div className='bg-primary fixed top-0 left-0 w-full p-3 px-8'>
                    <form
                        className='w-full flex justify-between gap-x-2 border-b border-custom-gray-200 pb-1'
                        onSubmit={(e) => {
                            document.body.classList.remove('overflow-hidden')
                            e.preventDefault()
                            router.push(`/search?q=${searchMsg.q}`)
                            setSearchMsg({
                                q : ""
                            })
                            setOpenSearch(false)
                        }}
                    >
                        <input className='flex-1 bg-transparent border-none outline-0 text-white'
                               placeholder='کلید واژه ی مورد نظر...' type="text" name=""
                               value={searchMsg.q}
                               onChange={(e) => setSearchMsg({
                                   q: e.target.value
                               })} id=""/>

                        <div className='flex items-center gap-x-2'>
                            <button className='flex items-center gap-x-2 text-white'>
                                <SearchIcon color={'#fff'} width={14} height={14}/>
                                <span>جستجو</span>
                            </button>

                            <button onClick={() => {
                                setOpenSearch(false)
                                document.body.classList.remove('overflow-hidden')
                            }
                            }
                                    className='p-1 border-[2px] border-white rounded-lg cursor-pointer'

                            >
                                <CloseIcon color={"#fff"} width={12} height={12}/>
                            </button>
                        </div>
                    </form>
                </div>

                {/* suggestion*/}
                {
                    (results.length > 0 && searchMsg.q) &&
                    <div
                        className='bg-transparent w-4/5 absolute top-full right-1/2 translate-x-1/2 p-4'>
                        <div className='bg-primary rounded-lg p-2'>
                            {/*  single suggest  */}

                            <>
                                {
                                    results.map((property: any) => {
                                        return (
                                            <Link href={`/single-property/${property.id}/${property.slug}`}
                                                  key={property.id}
                                            >
                                                <div
                                                    className='p-3 text-white text-sm border-b border-custom-gray-200 hover:bg-white/10 rounded-lg'>
                                                    {property.title}
                                                </div>
                                            </Link>
                                        )

                                    })
                                }

                                {
                                    (results.length > 0 && searchMsg.q) &&
                                    <button className='flex justify-center items-center gap-x-2 text-white pr-3 py-2'
                                            onClick={() => {
                                                router.push(`/search?q=${searchMsg.q}`)
                                                setOpenSearch(false)
                                                document.body.classList.remove('overflow-hidden')
                                            }
                                            }>
                                        <span>نمایش بیشتر</span>
                                        <ArrowLeftSvg color={"#fff"} width={16} height={16}/>
                                    </button>
                                }
                            </>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default SearchHeader;