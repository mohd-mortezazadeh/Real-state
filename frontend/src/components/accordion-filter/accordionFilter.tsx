import React, { FC, useEffect, useState} from 'react'
import ArrowDownSvg from '../svg/arrows/arrow-down/arrowDownSvg'
import ArrowLeftSvg from '../svg/arrows/arrow-left/ArrowLeftSvg'
import CategoriesSvg from '../svg/categories/categoriesSvg'
import Link from "next/link";
import {useRouter} from "next/router";
import * as queryString from "querystring";

interface AccordionFilterProps {
    name?: string,
    title?: string,
    // Icon: React.ReactNode | React.ReactNode[],
    isDefaultOpen?: boolean,
    data: [],
    active?: string

}

const AccordionFilter: FC<AccordionFilterProps> = ({
                                                       name,
                                                       title = "عنوان پیش فرض",
                                                       active,
                                                       isDefaultOpen = true,
                                                       data
                                                   }) => {
    const [accordionOpen, setAccordionOpen] = useState<boolean>(isDefaultOpen)
    const [activeData, setActiveData] = useState<any>()

    const router = useRouter()



    const handleClick = (item: any) => {

    }
    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            if (window.innerWidth > 768) {
                setAccordionOpen(false)
            } else {
                setAccordionOpen(false)
            }
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    useEffect(() => {
        if (name === 'category') {
            const finded = data.find((item: any) => item.name === active)
            setActiveData(finded)
        } else {
            const finded = data.find((item: any) => item.slug === active)
            setActiveData(finded)
        }
    }, [data, router.query])

    return (
        <div
            className={`bg-white box-shadow-1  rounded-lg w-full py-5 ${accordionOpen ? 'h-auto' : 'max-h-[62px] overflow-hidden'}  cursor-pointer`}

        >
            <div className='px-4' onClick={(e) => setAccordionOpen(!accordionOpen)}>
                <div className=' border-b-[0.8px]  '>
                    <div className={`flex flex-row justify-between items-center ${!accordionOpen && 'mb-6'}`}>
                        <div className={`flex flex-row items-center justify-start gap-x-4 `}>
                            <CategoriesSvg width="28" height="28" color="#005adc"/>
                            <div className='font-bold'>{title}</div>
                        </div>
                        <span className={`${accordionOpen ? 'rotate-180' : 'rotate-0'} transition-all duration-300 `}>
                        <ArrowDownSvg/>
                     </span>
                    </div>

                    {active && accordionOpen && <span
                        className='inline-block bg-primary/70 text-sm text-white rounded-xl my-2 px-2 py-1'>{name === 'category' ? activeData?.display_name : activeData?.name}</span>}
                </div>
            </div>
            <div className='flex flex-col justify-start px-3 py-2'>
                <div className='max-h-[210px] overflow-y-auto'>
                    {
                        name === 'city' ?
                            data?.map((item: any) => (
                                <Link key={item?.id ? item?.id : item?.toString()}
                                      href={router?.query?.category ? `/${item.slug}/${router?.query?.category}` : `/${item.slug}`}>
                                    <div onClick={(e) => handleClick(item)}
                                         className={` ${item.slug === active ? 'bg-primary/10' : ''} mx-2 mb-2 p-5  rounded-lg flex flex-row justify-between items-center`}>
                                        <span className=''>{item.name}</span>
                                        <span>
                                            <ArrowLeftSvg width={18} height={18} color="#005adc"/>
                                        </span>
                                    </div>
                                </Link>
                            ))

                            :

                            name === 'category' ?
                                data?.map((item: any) => (

                                    <>
                                        <Link key={item?.id ? item?.id : item?.toString()}
                                              href={`/${router.query.city}/${item.name}`}>
                                            <div onClick={(e) => handleClick(item)}
                                                 className={` ${item.name === active ? 'bg-primary/10' : ''} mx-2 mb-2 p-5  rounded-lg flex flex-row justify-between items-center`}>
                                                <span className=''>{item.display_name}</span>
                                                <span>
                                        <ArrowLeftSvg width={18} height={18} color="#005adc"/>
                                        </span>
                                            </div>
                                        </Link>
                                    </>
                                ))


                                :
                                (name === 'sections' && !router.query.category)
                                    ?
                                    data?.map((item: any) => (
                                        <Link key={item?.id ? item?.id : item?.toString()}
                                              href={`/search?${queryString.stringify(router.query)}&section=${item.slug}`}>
                                            <div onClick={(e) => handleClick(item)}
                                                 className={` ${item.slug === active ? 'bg-primary/10' : ''} mx-2 mb-2 p-5  rounded-lg flex flex-row justify-between items-center`}>
                                                <span className=''>{item.name}</span>
                                                <span>
                                            <ArrowLeftSvg width={18} height={18} color="#005adc"/>
                                        </span>
                                            </div>
                                        </Link>
                                    ))
                                    :
                                    data?.map((item: any) => (
                                        <Link key={item?.id ? item?.id : item?.toString()}
                                              href={`/${router.query.city}/${router.query.category}/${item.slug}`}>
                                            <div onClick={(e) => handleClick(item)}
                                                 className={` ${item.slug === active ? 'bg-primary/10' : ''} mx-2 mb-2 p-5  rounded-lg flex flex-row justify-between items-center`}>
                                                <span className=''>{item.name}</span>
                                                <span>
                                            <ArrowLeftSvg width={18} height={18} color="#005adc"/>
                                        </span>
                                            </div>
                                        </Link>
                                    ))
                    }

                </div>

            </div>
        </div>
    )
}

export default AccordionFilter
