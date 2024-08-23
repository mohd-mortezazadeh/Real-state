import SearchIcon from "../../../components/svg/search/searchSvg";
import AddIcon from "../../../components/svg/add/addSvg";
import ProfileIcon from "../../../components/svg/profile/profileSvg";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import {useAppDispatch} from "../../../hooks/useRedux";
import {auth_logout} from "../../../redux/slices/authSlice";
import {textEllipsis} from '../../../utils/textEllipsis'
import toast from "react-hot-toast";
import ArrowDownSvg from "../../../components/svg/arrows/arrow-down/arrowDownSvg";
import {useDebounce} from "../../../hooks/useDebounce";

import SearchHeader from "./searchHeader";

interface HeaderPropsType {
    hasBanner: boolean,
    user: any,
    userLoading: boolean,
    categories: any
}

const Header = ({hasBanner, user, userLoading, categories}: HeaderPropsType) => {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const [openProfile, setOpenProfile] = useState(false)

    const [openSearch, setOpenSearch] = useState(false)

    const [searchMsg, setSearchMsg] = useState({
        q: ''
    })

    // const {categories,isLoadingCategories,error,isError} = useCategories()

    const debouncedSearch = useDebounce(searchMsg, 300)


    // const {results, isLoading, isError} = useProperties(1, queryString.stringify(debouncedSearch), 4)

    useEffect(() => {
        setOpenProfile(false)
    }, [])

    const handleLogout = () => {
        dispatch(auth_logout()).then(() => setOpenProfile(false))
    }


    return (
        <>
            {
                !openSearch ?
                    <header
                        className={`hidden lg:block py-6 ${hasBanner ? '' : 'relative z-10 bg-white box-shadow-1'} `}>
                        {/*container az tag paein hazf shod*/}
                        <div className='relative  z-10 hidden lg:flex lg:items-center lg:justify-around '>
                            {/*logo*/}
                            <div className={` font-bold ${hasBanner ? 'text-white' : 'text-primary'}`}>
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
                            </div>
                            {/*menu items*/}
                            <ul className={`flex items-center gap-x-4 xl:gap-x-8 ${hasBanner ? 'text-white ' : 'text-text'}`}>
                                <li className={`flex relative ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route === '/' ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/'>
                                        صفحه اصلی
                                    </Link>
                                </li>
                                <li className={`flex group relative cursor-pointer gap-x-1 items-center ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route === '/search' || router.route.includes('/single-property') ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/shomal'>
                                        املاک
                                    </Link>
                                    {
                                        hasBanner ?
                                            <ArrowDownSvg rectFill='none' color='#fff'/>
                                            :
                                            <ArrowDownSvg rectFill='none' color='#000'/>
                                    }

                                    <div
                                        className='opacity-0 invisible group-hover:visible grid translate-y-20 group-hover:translate-y-0 transition-all duration-500 group-hover:opacity-100 absolute p-2 z-50 mt-4 grid-cols-12 gap-x-4 text-black py-2 w-64 min-h-20 bg-white top-full rounded-tl-xl rounded-b-xl border border-primary/50'>
                                        {
                                            categories.length > 0 ?
                                                categories.map((c : any) => {
                                                    return <Link key={c.id} href={`/shomal/${c.name}`}
                                                                 className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>{c?.display_name}</Link>

                                                })
                                                :
                                                null
                                        }

                                    </div>
                                </li>

                                <li className={`flex group relative cursor-pointer gap-x-1 items-center ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route.includes('/villa') ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/shomal/villa'>
                                        ویلا
                                    </Link>
                                    {
                                        hasBanner ?
                                            <ArrowDownSvg rectFill='none' color='#fff'/>
                                            :
                                            <ArrowDownSvg rectFill='none' color='#000'/>
                                    }

                                    <div
                                        className='opacity-0 invisible group-hover:visible grid translate-y-20 group-hover:translate-y-0 transition-all duration-500 group-hover:opacity-100 absolute p-2 z-50 mt-4 grid-cols-12 gap-x-4 text-black py-2 w-64 min-h-20 bg-white top-full rounded-tl-xl rounded-b-xl border border-primary/50'>
                                        {/*<Link href='/shomal/aparteman'*/}
                                        {/*      className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>آپارتمان</Link>*/}

                                        {/*<Link href='/shomal/villa'*/}
                                        {/*      className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا</Link>*/}

                                        {/*<Link href='/shomal/bagh'*/}
                                        {/*      className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>باغ</Link>*/}
                                        {/*<Link*/}
                                        {/*    href='/shomal/zamin'*/}
                                        {/*    className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>زمین</Link>*/}
                                        <Link href='/shomal/villa-shahraki'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا
                                            شهرکی</Link>
                                        {/*<Link*/}
                                        {/*    href='/shomal/tejari'*/}
                                        {/*    className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>تجاری</Link>*/}
                                        <Link href='/shomal/villa-saheli'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا
                                            ساحلی</Link>
                                        {/*<Link*/}
                                        {/*    href='/shomal/khane-villaii'*/}
                                        {/*    className='villa col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>خانه*/}
                                        {/*    ویلا</Link>*/}


                                        <Link href='/shomal/villa-jangali'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا
                                            جنگلی</Link>

                                        <Link href='/shomal/Villa-with-pool'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا
                                            استخردار</Link>

                                        <Link href='/shomal/Luxury-villa'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا
                                        لوکس</Link>

                                        <Link href='/shomal/Duplex-villa'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا
                                            دوبلکس</Link>

                                    </div>
                                </li>

                                <li className={`flex group relative cursor-pointer gap-x-1 items-center ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route.includes('/villa') ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/shomal'>
                                        شمال
                                    </Link>
                                    {
                                        hasBanner ?
                                            <ArrowDownSvg rectFill='none' color='#fff'/>
                                            :
                                            <ArrowDownSvg rectFill='none' color='#000'/>
                                    }

                                    <div
                                        className='opacity-0 invisible group-hover:visible grid translate-y-20 group-hover:translate-y-0 transition-all duration-500 group-hover:opacity-100 absolute p-2 z-50 mt-4 grid-cols-12 gap-x-4 text-black py-2 w-64 min-h-20 bg-white top-full rounded-tl-xl rounded-b-xl border border-primary/50'>
                                        {/*<Link href='/shomal/aparteman'*/}
                                        {/*      className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>آپارتمان</Link>*/}

                                        {/*<Link href='/shomal/villa'*/}
                                        {/*      className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>ویلا</Link>*/}

                                        <Link href='/sorkhrod'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>سرخرود</Link>
                                        <Link
                                            href='/noshahr'
                                            className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>نوشهر</Link>
                                        <Link href='/nor'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>
                                            نور
                                        </Link>
                                        {/*<Link*/}
                                        {/*    href='/shomal/tejari'*/}
                                        {/*    className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>تجاری</Link>*/}
                                        <Link href='/chamestan'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>
                                            چمستان
                                        </Link>
                                        <Link
                                            href='/amol'
                                            className='villa col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>
                                            آمل
                                        </Link>


                                        <Link href='/mahmodabad'
                                              className='col-span-6 flex before:w-1 gap-x-2 text-sm before:rounded-full before:h-2/3 items-center before:bg-primary before:block py-2 hover:text-primary'>
                                            محمود آباد
                                        </Link>


                                    </div>
                                </li>

                                {/*<li className={`flex relative ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route === '/packages' ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>*/}
                                {/*    <Link href='/packages'>*/}
                                {/*        پکیج ها*/}
                                {/*    </Link>*/}
                                {/*</li>*/}

                                <li className={`flex relative ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route === '/blog-list' ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/blog-list'>
                                        وبلاگ
                                    </Link>
                                </li>

                                <li className={`flex relative ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route === '/contact-us' ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/contact-us'>
                                        ارتباط با ما
                                    </Link>
                                </li>
                                <li className={`flex relative ${hasBanner ? "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-white hover:before:w-2/3" : "hover:before:absolute hover:before:-bottom-1 hover:before:h-1 hover:before:rounded-full hover:before:bg-primary hover:before:w-2/3"} ${router.route === '/about-us' ? hasBanner ? ' font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-white before:w-2/3' : 'font-bold relative before:absolute before:-bottom-1 before:h-1 before:rounded-full before:bg-primary text-primary before:w-2/3' : ''}`}>
                                    <Link href='/about-us'>
                                        درباره ما
                                    </Link>
                                </li>

                                {/*<li>*/}
                                {/*    <Link href='/'>*/}
                                {/*        مشاهده پکیج*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                            </ul>

                            {/*left side*/}
                            <div className={`flex gap-x-2 ${userLoading ? 'opacity-0' : 'opacity-100'}`}>
                                <button onClick={() => {
                                    setOpenSearch(true)
                                    document.body.classList.add('overflow-hidden')
                                }
                                }
                                        className='flex self-start items-center justify-center  bg-primary hover:bg-blue-800 p-3 rounded-lg '>
                                    <SearchIcon color='#fff' width={16} height={16}/>
                                </button>
                                {
                                    user?.role?.id === 1 ? null :
                                        user?.status?.id === 0 ?
                                            <Link href='/'>
                                                <button
                                                    onClick={() => toast('اکانت شما هنوز تایید نشده است.')}
                                                    className={`flex self-start items-center box-shadow-1 bg-white text-primary p-2 rounded-lg gap-x-1`}
                                                >
                                                  <span>
                                                 <AddIcon color='#005ADC'/>
                                                    </span>
                                                    <span>ثبت آگهی رایگان</span>
                                                </button>
                                            </Link>
                                            :
                                            <Link href='/add-property'>
                                                <button
                                                    className={`flex self-start items-center box-shadow-1  bg-white hover:bg-custom-gray-100/80   text-primary    transition-all duration-300 p-2 rounded-lg gap-x-1`}
                                                >
                                                    <span>
                                                    <AddIcon color='#005ADC'/>
                                                    </span>
                                                    <span>ثبت آگهی رایگان</span>
                                                </button>
                                            </Link>
                                }

                                {
                                    user ?
                                        <>
                                            <button
                                                className={`flex flex-col relative items-center bg-primary hover:bg-blue-800 transition-all duration- ${user.fullname.trim().length > 6 ? 'w-36' : 'w-32'}  text-white ${openProfile ? ' rounded-t-lg' : ' rounded-lg'} gap-x-1`}>
                                                <button onClick={() => setOpenProfile(prevState => !prevState)}
                                                        className='flex p-2 items-center gap-x-3 w-full'>
                                                    <div className='flex items-center gap-x-3 w-full'>
                                                        <figure className='w-6 h-6'>
                                                            <img src={user?.avatar?.file}
                                                                 className='w-full h-full rounded-full object-cover'
                                                                 alt=""/>
                                                        </figure>
                                                        <span className=''>
                                                    {
                                                        textEllipsis(user?.fullname, 6)
                                                    }
                                                </span>
                                                    </div>

                                                    {
                                                        openProfile ?
                                                            <BiChevronUp className='w-6 h-6'/>
                                                            :
                                                            <BiChevronDown className='w-6 h-6'/>
                                                    }

                                                </button>

                                                {
                                                    openProfile &&
                                                    <div
                                                        className='flex flex-col top-full absolute rounded-b-lg   w-full bg-blue-500'>
                                                        {
                                                            user?.role?.id !== 1 ?
                                                                <Link href={'/dashboard'}
                                                                      className='border-b py-2 hover:bg-blue-800/60'><span>داشبورد</span></Link>
                                                                :
                                                                <>
                                                                    <Link href={'/panel/ticket'}
                                                                          className='border-b py-2'><span>تیکت ها</span></Link>
                                                                    <Link href={'/panel/blog'}
                                                                          className='border-b py-2'><span>افزودن بلاگ</span></Link>

                                                                </>

                                                        }

                                                        <span className='py-2 hover:bg-blue-800/60'
                                                              onClick={handleLogout}>خروج</span>
                                                    </div>
                                                }
                                            </button>
                                        </>
                                        :
                                        <Link href={'/auth'}>
                                            <button
                                                className='flex items-center bg-primary text-white p-2 rounded-lg gap-x-1'>
                                              <span>
                                                <ProfileIcon/>
                                              </span>
                                                <span>ورود | ثبت نام</span>
                                            </button>
                                        </Link>
                                }

                            </div>
                        </div>
                    </header>
                    :
                    openSearch &&
                    <SearchHeader openSearch={openSearch} setOpenSearch={setOpenSearch}/>

            }

        </>
    );
};

export default Header;