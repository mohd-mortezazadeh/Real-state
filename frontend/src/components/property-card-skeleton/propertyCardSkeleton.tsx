
import React, {FC, useEffect, useState} from 'react'
import Skeleton from 'react-loading-skeleton'

interface ListPropertySkeletonProps{
    wide?:boolean
}

const PropertyCardSkeleton:FC<ListPropertySkeletonProps> = ({wide=false}) => {
    const [windowSize,setWindowSize]=useState<any>(null)
    useEffect(() => {
        setWindowSize(window.innerWidth)

        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state

            setWindowSize(window.innerWidth)
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        // handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [])
    return (
        <div
            className={`bg-white relative w-full box-shadow-2 ${
                wide ? "rounded-3xl" : "rounded-2xl"
            } overflow-y-hidden grid grid-cols-12 border-[0.8px]`}
        >


            {/* image wrapper */}

            <div
                className={`p-4 relative   ${
                    wide
                        ? "md:col-span-5 lg:col-span-4 xl:col-span-3 col-span-12 h-72 md:h-auto"
                        : "col-span-12  h-72"
                }`}
            >




                <Skeleton style={{borderRadius:"23px"}} height="100%"/>

            </div>

            {/* <div className={`${wide ? 'col-span-12 grid grid-cols-12 gap-y-4' : 'hidden'}`}> */}
            {/* property info wrapper */}
            <div
                className={`${
                    wide
                        ? "md:col-span-7 lg:col-span-8 xl:col-span-9 col-span-12 py-4"
                        : "col-span-12 "
                }`}
            >
                {/* property title */}

                <div
                    className={`text-lg font-bold px-4 pb-5 ${
                        wide && "md:px-0 md:pb-5"
                    }`}
                >
                    <Skeleton count={1} width="200px" />

                </div>

                {wide && (
                    <div className="h-20  pl-40 md:block hidden">
                        <Skeleton count={2} width="400px" />
                    </div>
                )}

                {/* property info */}

                <div className={`px-4 pb-1 ${wide && "md:px-0 md:pb-0 "}`}>
                    <div className="flex flex-row flex-wrap justify-start items-center gap-y-2 gap-x-6">
                        <div className="flex flex-row justify-between items-center">
                            <Skeleton count={1} width="70px" />
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Skeleton count={1} width="70px" />
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <Skeleton count={1} width="70px" />
                        </div>
                    </div>
                </div>
            </div>

            {/* property price */}
            <div
                className={` ${
                    wide ? "bg-primary-100/10 " :  "bg-primary-100/40 mt-5"
                } col-span-12`}
            >
                <div className="flex flex-row justify-between items-center w-full bg-gray-50 p-3 ">
                    {wide ? (
                        <div
                            className="flex flex-row md:justify-start flex-wrap justify-between items-center gap-x-3 md:w-auto w-full ">
                            <div className="flex flex-row justify-start gap-x-2">
                                <Skeleton count={1} width="180px" />


                            </div>
                        </div>
                    ) : (
                        <>

                            <Skeleton count={1} width="90px"/>
                            <Skeleton count={1} width="90px"/>
                        </>
                    )}
                    {wide && (
                        <div className="md:block hidden">
                            <Skeleton count={1} width="180px" />

                        </div>
                    )}
                </div>
            </div>
            {/* </div> */}

        </div>
    )
}

export default PropertyCardSkeleton