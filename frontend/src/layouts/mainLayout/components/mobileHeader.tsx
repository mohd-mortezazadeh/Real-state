import CloseIcon from "../../../components/svg/close/closeSvg";
import MenuIcon from "../../../components/svg/menu/menuSvg";
import UserIcon from "../../../components/svg/user/userSvg";
import SearchIcon from "../../../components/svg/search/searchSvg";
import Link from "next/link";
import React, {useEffect, useState} from "react";

import {useRouter} from "next/router";
import {auth_logout} from "../../../redux/slices/authSlice";
import {useAppDispatch} from "../../../hooks/useRedux";
import toast from "react-hot-toast";

import ArrowDownSvg from "../../../components/svg/arrows/arrow-down/arrowDownSvg";

import MobileSearchHeader from "./mobileSearchHeader";


interface HeaderPropsType {
    hasBanner: boolean,
    user: any,
    userLoading: boolean,
    categories : any
}

const optionsCity = [
    {
        value: 1, label: 'آمل'
    },
    {
        value: 2, label: 'ساری'
    },
    {
        value: 3, label: 'بابل'
    },
    {
        value: 4, label: 'نور'
    },
]


const MobileHeader = ({hasBanner, user, userLoading , categories}: HeaderPropsType) => {

    const router = useRouter()
    const dispatch = useAppDispatch()

    const [open, setOpen] = useState(false)




    const [openProfile, setOpenProfile] = useState(false)

    const [openSubMenu, setOpenSubMenu] = useState(false)
    const [openSubMenu2, setOpenSubMenu2] = useState(false)
    const [openSubMenu3, setOpenSubMenu3] = useState(false)

    const [search, setSearch] = useState(false)

    useEffect(() => {
        !open && setOpenSubMenu(false)
    }, [open])





    const handleOpenMenu = () => {
        setOpen(prevState => !prevState)
    }

    const handleOpenSearch = () => {
        setSearch(true)
    }

    const handleOpenSubMenu = () => {
        setOpenSubMenu(prevState => !prevState)
    }

    const handleOpenSubMenu2 = () => {
        setOpenSubMenu2(prevState => !prevState)
    }
    const handleOpenSubMenu3 = () => {
        setOpenSubMenu3(prevState => !prevState)
    }
    const handleCloseSearch = () => {
        setSearch(false)
    }

    const handleCloseMenuSubMenu = () => {
        setOpen(false)
        setOpenSubMenu(false)
    }

    const handleCloseMenuSubMenu2 = () => {
        setOpen(false)
        setOpenSubMenu2(false)
    }

    const handleCloseMenuSubMenu3 = () => {
        setOpen(false)
        setOpenSubMenu3(false)
    }

    useEffect(() => {
        (open || search) ? document?.body?.classList?.add('overflow-hidden') : document?.body?.classList?.remove('overflow-hidden')
    }, [open, search])

    useEffect(() => {
        setOpenProfile(false)
    }, [])

    const handleLogout = () => {
        dispatch(auth_logout()).then(() => setOpenProfile(false))
    }


    return (
        <>
            {
                //layout of closing profile
                openProfile &&
                <div className='absolute md:hidden min-h-screen w-full z-30' onClick={()=>setOpenProfile(false)}>

                </div>
            }
            <header className={`lg:hidden w-full   ${open ? 'fixed top-0 z-50' : 'relative'}`}>
                <div
                    className={`relative py-6  z-30 mx-auto lg:max-w-screen-xl  ${open && !hasBanner ? 'backdrop-blur-md bg-white/50' : open && hasBanner && 'backdrop-blur-md bg-primary/50'}`}>
                    <div className='container flex justify-between items-center'>
                        {
                            open ? (
                                    <button onClick={handleOpenMenu}
                                            className={`w-12 h-12 z-10 rounded-lg flex justify-center items-center ${hasBanner ? 'bg-white' : 'bg-primary'}`}>
                                        <CloseIcon color={`${hasBanner ? '#005ADC' : '#fff'}`}/>
                                    </button>
                                ) :
                                (
                                    <button onClick={handleOpenMenu}
                                            className={`w-12 h-12 z-10 rounded-lg flex justify-center items-center ${hasBanner ? 'bg-white' : 'bg-primary'}`}>
                                        <MenuIcon color={`${hasBanner ? '#005ADC' : '#fff'}`}/>
                                    </button>
                                )
                        }

                        <Link href='/'>
                            {
                                hasBanner ?
                                    <div className='xl:w-20 xl:h-10 w-16 h-10 rounded overflow-hidden'>
                                        <img className='w-full h-full object-cover' src="/images/logo-white.svg"
                                             alt=""/>
                                    </div>
                                    :
                                    <div className='xl:w-20 xl:h-10 w-16 h-10  rounded overflow-hidden'>
                                        <img className='w-full h-full object-cover' src="/images/logo-blue.svg"
                                             alt=""/>
                                    </div>
                            }
                        </Link>


                        <div className='flex items-center gap-x-2'>

                            <div onClick={handleOpenSearch} className={`bg-white p-3 rounded`}>
                                <SearchIcon color='#005adc' width={23} height={23}/>
                            </div>

                            {
                                user ?
                                    <>
                                        <div className=' relative z-10 rounded-lg z-50'>
                                            <figure onClick={() => setOpenProfile(prevState => !prevState)}
                                                    className='w-12 h-12 rounded-full overflow-hidden'>
                                                <img className='w-full h-full object-cover' src={user?.avatar?.file} alt=""/>
                                            </figure>
                                            {
                                                openProfile &&
                                                <div
                                                    className={`flex absolute flex-col top-full z-50  font-bold left-1/2 top-[120%] items-center  justify-center rounded-lg px-2   ${hasBanner ? 'text-primary  bg-white' : ' text-white bg-primary'}`}>


                                                    {
                                                        user?.role?.id !== 1 ?
                                                            <Link href={'/dashboard'}
                                                                  className={`border-b  py-3 px-6 ${hasBanner ? 'border-primary/30' : 'border-white/30'}`}>داشبورد
                                                            </Link>
                                                            :
                                                            <>
                                                                <Link href={'/panel/ticket'}
                                                                      className='border-b py-2'><span>تیکت ها</span></Link>
                                                                <Link href={'/panel/blog'}
                                                                      className='border-b py-2'><span>افزودن بلاگ</span></Link>

                                                            </>

                                                    }

                                                    <button className=' py-3 px-6' onClick={handleLogout}>خروج</button>
                                                </div>
                                            }
                                        </div>
                                    </>
                                    :
                                    <div
                                        className={`p-3 relative z-10 bg-primary rounded-lg ${userLoading ? 'opacity-0' : 'opacity-100'}`}>
                                        <Link href={'/auth'}>
                                            <UserIcon/>
                                        </Link>
                                    </div>
                            }


                        </div>


                    </div>
                </div>

                {
                    hasBanner &&
                    <>
                        {/*dijimelk motto*/}

                        <div className='text-center mt-12 text-white text-3xl'>

                            <h2 className='font-bold'>ویلا ارزان</h2>

                            <p className='mt-4'>تخصص ما مناطق</p>

                            <p className='mt-6'>
                                <span className='font-bold'>شـمالی </span>
                                کشور اســـت
                            </p>
                        </div>

                    </>
                }


                {/*menu items*/}
                <div
                    className={`absolute z-20 font-semibold  inset-0 min-h-[100vh] transition-all duration-500  w-full  text-xl
                     ${hasBanner ? 'bg-primary text-white' : 'bg-white text-primary'}
                      ${open ? 'translate-y-0' : '-translate-y-full'}`}>
                    <div className={`w-full h-full flex flex-col items-center pt-24 overflow-auto pb-2`}>

                        {/*search box*/}

                        {/*{*/}
                        {/*    search &&*/}
                        {/*    <div className='bg-white px-8 py-4 w-full flex items-center gap-x-2'>*/}

                        {/*        <button onClick={handleCloseSearch}>*/}
                        {/*            <CloseIcon color='#005ADC'/>*/}
                        {/*        </button>*/}

                        {/*        <input onBlur={handleCloseSearch}*/}
                        {/*               className='flex-1 p-2 rounded-lg text-text text-m'*/}
                        {/*               placeholder='جستجو ...' type="search" name="" id=""/>*/}

                        {/*        <span className=' inline-block bg-primary/20 p-4 rounded-lg'>*/}
                        {/*                  <SearchIcon color='#005ADC' width={12} height={12}/>*/}
                        {/*         </span>*/}
                        {/*    </div>*/}
                        {/*}*/}


                        <div
                            className={`w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>
                            <Link href='/'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/' ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>صفحه اصلی</span>
                            </Link>
                        </div>

                        <div
                            className={` w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>

                            <div onClick={handleOpenSubMenu} className='flex items-center gap-x-2 justify-center'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/search' || router.route.includes('/single-property') ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>املاک </span>
                                {

                                    hasBanner ?
                                        <span className={`transition-all ${openSubMenu ? 'rotate-180' : 'rotate-0'}`}>
                                       <ArrowDownSvg rectFill='none' color='#fff'/>
                                     </span>
                                        :
                                        <span className={`transition-all ${openSubMenu ? 'rotate-180' : 'rotate-0'}`}>
                                       <ArrowDownSvg rectFill='none' color='#005adc'/>
                                     </span>

                                }

                            </div>


                            {/*sub menu*/}
                            <div
                                className={`flex overflow-hidden flex-col items-center ${hasBanner ? 'bg-blue-400' : 'bg-custom-gray-200/40'} w-full  h-auto ${openSubMenu ? 'py-2 ' : ' h-0 '}`}>

                                <Link onClick={handleCloseMenuSubMenu} href='/shomal'
                                      className={`py-3 border-b text-sm  ${hasBanner ? 'border-primary/10' : 'border-custom-gray-200/20'} w-full text-center`}>همه
                                    ی املاک شمال</Link>

                                {
                                    categories.length > 0 ?
                                        categories.map((c:any)=>{
                                            return  <Link key={c.id} onClick={handleCloseMenuSubMenu} href={`/shomal/${c?.name}`}
                                                          className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>{c?.display_name}</Link>

                                        })
                                        :
                                        null
                                }

                            </div>
                        </div>


                        {/*cities*/}

                        <div
                            className={` w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>

                            <div onClick={handleOpenSubMenu3} className='flex items-center gap-x-2 justify-center'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/search' || router.route.includes('/single-property') ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>شمال</span>
                                {

                                    hasBanner ?
                                        <span className={`transition-all ${openSubMenu3 ? 'rotate-180' : 'rotate-0'}`}>
                                       <ArrowDownSvg rectFill='none' color='#fff'/>
                                     </span>
                                        :
                                        <span className={`transition-all ${openSubMenu2 ? 'rotate-180' : 'rotate-0'}`}>
                                       <ArrowDownSvg rectFill='none' color='#005adc'/>
                                     </span>

                                }

                            </div>


                            {/*sub menu*/}
                            <div
                                className={`flex overflow-hidden flex-col items-center ${hasBanner ? 'bg-blue-400' : 'bg-custom-gray-200/40'} w-full  h-auto ${openSubMenu3 ? 'py-2 ' : ' h-0 '}`}>
                                <Link onClick={handleCloseMenuSubMenu3} href='/shomal'
                                      className={`py-3 border-b text-sm  ${hasBanner ? 'border-primary/10' : 'border-custom-gray-200/20'} w-full text-center`}>همه
                                    ی شهر ها</Link>
                                {/*<Link onClick={handleCloseMenuSubMenu} href='/shomal/aparteman'*/}
                                {/*      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>آپارتمان</Link>*/}
                                <Link onClick={handleCloseMenuSubMenu3} href='/nor'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>
                                    نور
                                </Link>
                                <Link onClick={handleCloseMenuSubMenu3} href='/chamestan'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>چمستان</Link>
                                <Link onClick={handleCloseMenuSubMenu3} href='/mahmodabad'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>محمود
                                    آباد</Link>
                                <Link onClick={handleCloseMenuSubMenu3} href='/amol'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>آمل</Link>
                                {/*<Link onClick={handleCloseMenuSubMenu} href='/shomal/khane-villaii'*/}
                                {/*      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>خانه*/}
                                {/*    ویلا</Link>*/}
                                <Link onClick={handleCloseMenuSubMenu3} href='/noshahr'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>
                                    نوشهر
                                </Link>

                                <Link onClick={handleCloseMenuSubMenu3} href='/sorkhrod'
                                      className='py-3 w-full text-center'>
                                    سرخرود
                                </Link>
                            </div>
                        </div>


                        {/*villa*/}


                        <div
                            className={` w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>

                            <div onClick={handleOpenSubMenu2} className='flex items-center gap-x-2 justify-center'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/search' || router.route.includes('/single-property') ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>ویلا</span>
                                {

                                    hasBanner ?
                                        <span className={`transition-all ${openSubMenu2 ? 'rotate-180' : 'rotate-0'}`}>
                                       <ArrowDownSvg rectFill='none' color='#fff'/>
                                     </span>
                                        :
                                        <span className={`transition-all ${openSubMenu2 ? 'rotate-180' : 'rotate-0'}`}>
                                       <ArrowDownSvg rectFill='none' color='#005adc'/>
                                     </span>

                                }

                            </div>


                            {/*sub menu*/}
                            <div
                                className={`flex overflow-hidden flex-col items-center ${hasBanner ? 'bg-blue-400' : 'bg-custom-gray-200/40'} w-full  h-auto ${openSubMenu2 ? 'py-2 ' : ' h-0 '}`}>
                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/villa'
                                      className={`py-3 border-b text-sm  ${hasBanner ? 'border-primary/10' : 'border-custom-gray-200/20'} w-full text-center`}>همه
                                    ی ویلاها</Link>
                                {/*<Link onClick={handleCloseMenuSubMenu} href='/shomal/aparteman'*/}
                                {/*      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>آپارتمان</Link>*/}
                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/villa-shahraki'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>ویلا
                                    شهرکی</Link>

                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/villa-saheli'
                                      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>ویلا
                                    ساحلی</Link>
                                {/*<Link onClick={handleCloseMenuSubMenu} href='/shomal/villa'*/}
                                {/*      className={`py-3 border-b  ${hasBanner ? 'border-primary/30' : 'border-custom-gray-200/40'} w-full text-center`}>ویلا*/}
                                {/*</Link>*/}
                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/villa-jangali'
                                      className='py-3 w-full text-center'>ویلا
                                    جنگلی
                                </Link>

                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/Villa-with-pool'
                                      className='py-3 w-full text-center'>ویلا
                                    استخردار
                                </Link>

                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/Luxury-villa'
                                      className='py-3 w-full text-center'>ویلا
                                    لوکس
                                </Link>

                                <Link onClick={handleCloseMenuSubMenu2} href='/shomal/Duplex-villa'
                                      className='py-3 w-full text-center'>ویلا
                                    دوبلکس
                                </Link>
                            </div>
                        </div>


                        {
                            user?.role?.id === 1 ? null :
                                user?.status?.id === 0 ?
                                    <div
                                        className={`w-full  border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>
                                        <Link href={'/'}>
                                            <button onClick={() => {
                                                toast('اکانت شما هنوز تایید نشده است.')
                                                setOpen(false)
                                            }
                                            }>
                                                <span className='py-5 inline-block'> ثبت آگهی</span>
                                            </button>
                                        </Link>
                                    </div>
                                    :
                                    <div
                                        className={`w-full  border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>
                                        <Link href='/add-property'>
                                            <span className='py-5 inline-block'> ثبت آگهی</span>
                                        </Link>
                                    </div>
                        }

                        <div
                            className={`w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>
                            <Link href='/blog-list'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/blog-list' ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>وبلاگ</span>
                            </Link>
                        </div>

                        {/*<div*/}
                        {/*    className={`w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>*/}
                        {/*    <Link href='/packages'>*/}
                        {/*        <span*/}
                        {/*            className={`py-5 inline-block ${router.route === '/packages' ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>پکیج ها</span>*/}
                        {/*    </Link>*/}
                        {/*</div>*/}


                        <div
                            className={`w-full border-b border-white/30 text-center ${hasBanner ? 'border-white/30' : 'border-primary/30'}`}>
                            <Link href='/about-us'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/about-us' ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>درباره ما</span>
                            </Link>
                        </div>
                        <div
                            className={`w-full text-center`}>
                            <Link href='/contact-us'>
                                <span
                                    className={`py-5 inline-block ${router.route === '/contact-us' ? hasBanner ? ' font-black relative text-2xl' : 'font-black relative text-primary text-2xl' : ''}`}>ارتباط با ما</span>
                            </Link>
                        </div>


                        {/*search button*/}
                        {/*{*/}
                        {/*    !search &&*/}
                        {/*    <button onClick={handleOpenSearch}*/}
                        {/*            className={`mt-2 p-2  z-10 flex items-center gap-x-2 rounded-lg ${hasBanner ? 'bg-white text-text' : 'bg-primary text-white'}`}>*/}
                        {/*                    <span*/}
                        {/*                        className={`inline-block z-10 p-3 rounded-lg ${hasBanner ? 'bg-primary/20 ' : 'bg-white/20'}`}>*/}
                        {/*                      {*/}
                        {/*                          hasBanner ? <SearchIcon color='#005ADC' width={12} height={12}/> :*/}
                        {/*                              <SearchIcon color='#fff' width={12} height={12}/>*/}
                        {/*                      }*/}
                        {/*                    </span>*/}

                        {/*        <span className='text-base'>جستجو کردن</span>*/}
                        {/*    </button>*/}
                        {/*}*/}
                    </div>
                </div>


            </header>

            {/*search timeout*/}

            {
                search &&
                <MobileSearchHeader handleCloseSearch={handleCloseSearch} setSearch={setSearch}/>
            }
        </>
    );
};

export default MobileHeader;