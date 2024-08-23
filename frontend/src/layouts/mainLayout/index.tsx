import React, {ReactNode} from "react";
import Header from "./components/header";
import MobileHeader from "./components/mobileHeader";
import Footer from "./components/footer";
import {useRouter} from "next/router";
import {useAuth} from "../../hooks/useAuth";
import FilterBox from "./components/filterBox";
import useCategories from "../../hooks/useCategories";


interface MainLayoutPropsTypes {
    children: ReactNode,
    hasBanner: boolean
}

const MainLayout = ({children, hasBanner}: MainLayoutPropsTypes) => {

    const router = useRouter()

    const {user, loading} = useAuth()

    const {categories, isLoadingCategories, error, isError} = useCategories()


    return (
        <div className='flex flex-col min-h-screen'>
            <div className='h-full'>

                {/*background image of header*/}
                <div
                    className={`relative  h-full ${hasBanner ? 'h-full bg-cover h-[500px] bg-no-repeat bg-header-banner bg-bottom bg-left  mb-44 lg:mb-16' : 'h-full'}`}>

                    {
                        hasBanner &&
                        <div className='absolute w-full h-full  bg-gradient-to-l from-primary/70 to-primary/0'>

                            {/*curve image */}
                            <div className=' w-full flex justify-center'>
                                <img src="images/curve.png" className='w-full absolute -bottom-1 lg:-bottom-5 left-0'
                                     alt=""/>

                            </div>
                        </div>
                    }


                    {/*mobile header*/}
                    <MobileHeader userLoading={loading} user={user} hasBanner={hasBanner} categories={categories}/>


                    {/*desktop header*/}
                    <Header userLoading={loading} user={user} hasBanner={hasBanner} categories={categories}/>


                    {
                        hasBanner &&
                        <FilterBox/>
                    }


                </div>

            </div>


            <div className='flex-1'>
                {children}
            </div>


            {/*footer*/}
            <Footer/>

        </div>
    )
}

export default MainLayout