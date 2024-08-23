import React, {useState} from 'react';
import CloseIcon from "../../../components/svg/close/closeSvg";
import Link from "next/link";
import ArrowLeftSvg from "../../../components/svg/arrows/arrow-left/ArrowLeftSvg";
import useProperties from "../../../hooks/useProperties";
import queryString from "querystring";
import {useRouter} from "next/router";
import {useDebounce} from "../../../hooks/useDebounce";

const MobileSearchHeader = ({handleCloseSearch , setSearch} : any) => {
    const [searchMsg, setSearchMsg] = useState({
        q: ''
    })
    const router = useRouter()

    const searchDebounced = useDebounce(searchMsg, 500)
    const {results, isLoading, error} = useProperties(1, queryString.stringify(searchDebounced), 4)

    return (
        <div className='absolute w-full h-screen bg-black/90 top-0 z-50 p-5 lg:hidden'>
            <div className='flex justify-end ' onClick={handleCloseSearch}>
                <CloseIcon color='#fff' width={20} height={20}/>
            </div>

            {/*search input*/}
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    router.push(`/search?q=${searchMsg.q}`)
                    setSearchMsg({
                        q: ''
                    })
                    setSearch(false)

                }
                }
                className='flex justify-center  w-full'>
                <div className='w-4/5 border-b border-white/60 '>
                    <input
                        onChange={(e) => setSearchMsg({
                            q: e.target.value
                        })}
                        value={searchMsg.q}
                        className='w-full text-white px-2 mt-12 border-b border-white bg-transparent outline-0 border-none '
                        type="text" name="" id="" placeholder='کلید واژه مورد نظر...'/>
                </div>
            </form>

            {/*suggestions*/}

            <div className='text-white flex flex-col  justify-center mt-16 gap-y-10 px-8'>

                <>
                    {
                        (results.length > 0 && searchMsg.q) &&
                        results.map((property: any) => {
                            return (
                                <Link href={`/single-property/${property.id}/${property.slug}`}
                                      key={property.id} className='flex gap-x-1 items-center'>
                                            <span className="w-full py-2 border-b border-white/60">
                                        {property.title}
                                        </span>
                                </Link>
                            )
                        })
                    }

                    {
                        (results.length > 0 && searchMsg.q) &&
                        <button className='flex justify-center items-center gap-x-2'
                                onClick={() => {
                                    router.push(`/search?q=${searchMsg.q}`)
                                    setSearch(false)
                                }
                                }>
                            <span>نمایش بیشتر</span>
                            <ArrowLeftSvg color={"#fff"} width={16} height={16}/>
                        </button>
                    }
                </>
            </div>
        </div>
    );
};

export default MobileSearchHeader;