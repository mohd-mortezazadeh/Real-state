import React, {ReactNode, useEffect, useState} from "react";
import CloseIcon from "../../components/svg/close/closeSvg";
import MenuIcon from "../../components/svg/menu/menuSvg";
import Link from "next/link";
import CircleProfileSvg from "../../components/svg/circle-profile/CircleProfileSvg";
import DashboardSvg from "../../components/svg/dashboard/dashboardSvg";
import AdsSvg from "../../components/svg/ads/adsSvg";
import MyFavSvg from "../../components/svg/myFav/myFavSvg";
import ConversationSvg from "../../components/svg/conversation/conversationSvg";
import KeySvg from "../../components/svg/key/keySvg";
import LayoutNavbar from "../../components/layout-navbar/layoutNavbar";
import ExitSvg from "../../components/svg/exit/exitSvg";
import EditSvg from "../../components/svg/edit/editSvg";
import {useAuth} from "../../hooks/useAuth";
import Loading from "../../components/loading/Loading.component";
import {useRouter} from "next/router";
import PersonSvg from "../../components/svg/person/personSvg";
import {auth_logout} from "../../redux/slices/authSlice";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import BasketSvg from "../../components/svg/basket/basketSvg";
import {postThumbnail} from "../../services/api/property";
import Head from "next/head";
import LogoutModal from "../../components/logout-modal/LogoutModal";
import ArrowDownSvg from "../../components/svg/arrows/arrow-down/arrowDownSvg";
import toast from "react-hot-toast";
import {userState} from "../../redux/slices/userSlice";
import ChangeRole from "../../components/svg/change-role/ChangeRole";

interface DashboardLayoutProps {
    children: ReactNode
}

const DashboardLayout = ({children}: DashboardLayoutProps) => {
        const [progress, setProgress] = useState<number | null>()
        const [endUpload, setEndUpload] = useState(true)

        const [avatarFile, setAvatarFile] = useState<any>()
        const [updateUi, setUpdateUi] = useState(false)
        const router = useRouter()
        const { user , loading} = useAuth()

        const users = useAppSelector(userState)
        const dispatch = useAppDispatch()

        const [open, setOpen] = useState(false)
        const [logoutModal, setLogoutModal] = useState(false)

        const [uploadTab, setUploadTab] = useState(false)

        // useEffect(()=>{
        //     setUpdateUi(prevState => !prevState)
        //
        // } , [user?.role?.id])

        const handleUploadTab = () => {
            setUploadTab(prevState => !prevState)
        }

        const hasBanner = false
        const handleOpenMenu = () => {
            setOpen(prevState => !prevState)
        }

        const handleLogout = async () => {
            await dispatch(auth_logout())
                .then(() => router.push('/'))
            setLogoutModal(false)

        }

        useEffect(() => {
            open ? document?.querySelector('body')!.classList.add('overflow-hidden') : document?.querySelector('body')!.classList.remove('overflow-hidden')
        }, [open])


        const options = {
            onUploadProgress: (progressEvent: ProgressEvent) => {
                const {loaded, total} = progressEvent;
                let precentage = Math.floor((loaded * 100) / total);

                if (precentage <= 100) {
                    setProgress(precentage)
                }
            },
            headers: {
                "Content-Type": "multipart/form-data"
            },
        };
        const handleUploadAvatar = async (e: any) => {

            setEndUpload(false)

            if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/HEIC') {
                if(e.target.files[0].name.length < 80){
                    setAvatarFile({
                        preview: Object.assign(e.target.files[0], {
                            preview: URL?.createObjectURL(e.target.files[0])
                        })
                    });

                    let avatar = new FormData()
                    avatar.append('file', e.target.files[0])
                    avatar.append('subject_type', '1')

                    const res = await postThumbnail(avatar, options)

                    setEndUpload(true)
                    // setAvatarId(res)
                    setProgress(0)
                }else{
                    toast.error("حداکثر اندازه مجاز برای نام فایل 80 کاراکتر میباشد")
                    setEndUpload(true)
                    // setAvatarId(res)
                    setProgress(0)
                    setAvatarFile(null)
                }
            } else {

                toast.error("فرمت فایل ارسالی مجاز نمیباشد")
                setEndUpload(true)
                // setAvatarId(res)
                setProgress(0)
                setAvatarFile(null)

            }


        }


        if (!user && !loading) {
            router.push('/')
            return <Loading/>
        } else {
            return (
                <div className='min-h-screen bg-second-layout'>
                    <Head>
                        <meta name='robots' content='index,follow'/>
                        <meta name='googlebot' content='index,follow'/>
                        <meta property="og:image" content="https://villaarzan.com/img/landing-min.png"/>
                        <meta property="og:type"/>
                        {/*<meta property="og:url" content={`https://villaarzan.com${router.asPath}`}/>*/}
                        <meta property="og:title" content="ویلا ارزان"/>
                        <meta property="og:site_name" content="ویلا ارزان"/>
                        <meta property="og:locale" content="fa_IR"/>
                        <meta property="og:brand" content="ویلا ارزان"/>
                        <meta name="twitter:image" content="https://villaarzan.com/img/landing-min.png"/>
                        <meta name="twitter:card" content="summary_large_image"/>
                        <meta name="twitter:site" content="https://villaarzan.com/"/>
                        <meta name="twitter:description" content="تخصص ما مناطق شمالی کشور است"/>
                        <meta name="twitter:title" content="ویلا ارزان"/>

                    </Head>
                    {/*mobile layout*/}

                    {
                        logoutModal &&
                        <div
                            className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                            style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                        >
                            <LogoutModal logoutModal={logoutModal} setLogoutModal={setLogoutModal}
                                         handleLogout={handleLogout}/>
                        </div>
                    }

                    <div className='md:hidden'>
                        {
                           uploadTab &&
                            <div className='absolute min-h-screen w-screen' onClick={()=>setUploadTab(false)}>

                            </div>
                        }
                        {/*mobile header*/}

                        <header className='bg-white shadow mb-4'>
                            <div
                                className={`relative py-6  z-30 mx-auto lg:max-w-screen-xl`}>
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
                                       <span
                                           className={`font-bold z-10 text-2xl  ${hasBanner ? 'text-white' : 'text-primary'} `}>
                                         ویـــلا ارزان
                                       </span>
                                    </Link>


                                    {
                                        <>
                                            <div className=' relative z-10 rounded-lg'>
                                                <figure
                                                    className='w-16 h-16 overflow-hidden rounded-full bg-custom-gray-200'>
                                                    {
                                                        avatarFile?.preview ?
                                                            <img className='w-full h-full object-cover'
                                                                 src={`${avatarFile?.preview?.preview}`}
                                                                 alt=""/>
                                                            :
                                                            <img className='w-full h-full object-cover'
                                                                 src={`${users?.avatar?.file}`} alt=""/>
                                                    }

                                                    {/*upload progress overlay*/}
                                                    {
                                                        !endUpload && <div
                                                            className='absolute flex justify-center items-center w-full h-full bg-custom-gray-200/60 top-0 bottom-0 left-0 rounded-full'>
                                                            <div className='w-3/4  h-1 rounded-full overflow-hidden'>
                                                                <div className='w-full h-full bg-primary' style={{
                                                                    width: `${progress}%`,
                                                                    animationFillMode: 'forwards',
                                                                    animationDirection: ''
                                                                }}>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </figure>

                                                {/*upload button*/}

                                                {
                                                    endUpload && <label className="absolute -right-2 top-9 cursor-pointer"
                                                                        onClick={handleUploadTab}>
                                                        <div
                                                            className=' bg-primary p-1 rounded-full text-white ring-2 ring-white left-1 bottom-1'>
                                                            {/*<EditSvg color={'#fff'} width={14} height={14}/>*/}
                                                            {
                                                                uploadTab ?
                                                                    <p className=' rotate-180'>
                                                                        <ArrowDownSvg rectFill='#005adc' color='#fff'/>
                                                                    </p>
                                                                    : <ArrowDownSvg rectFill='#005adc' color='#fff'/>
                                                            }
                                                            {/*<span>ویرایش</span>*/}
                                                            {/*<input onChange={handleUploadAvatar} type='file' className="hidden"/>*/}
                                                        </div>
                                                    </label>
                                                }

                                                {
                                                    uploadTab &&
                                                    <div
                                                        className='absolute flex flex-col bg-white box-shadow-3 text-lg p-2 px-4 left-1/2'>
                                                        <label className="">
                                                            <div
                                                                className='text-primary'>
                                                                {/*<EditSvg color={'#fff'} width={14} height={14}/>*/}
                                                                {/*<ArrowDownSvg rectFill='#005adc' color='#fff'/>*/}
                                                                <span>ویرایش</span>
                                                                <input accept="image/png, image/jpeg, image/HEIC"
                                                                       onChange={handleUploadAvatar} type='file'
                                                                       className="hidden"/>
                                                            </div>
                                                        </label>
                                                        {/*<span>خروج</span>*/}
                                                    </div>
                                                }
                                            </div>
                                        </>
                                    }


                                </div>
                            </div>


                            {/*menu items*/}
                            <div
                                className={`container absolute z-20 font-semibold bg-white overflow-auto inset-0 h-screen transition-all duration-500  w-screen  text-xl
                      ${open ? 'translate-y-0' : '-translate-y-full'}`}>
                                {
                                    users?.status?.id === 0 &&
                                    <div className='absolute bg-custom-gray-200/20 w-full h-full top-0 left-0'>

                                    </div>
                                }
                                <div
                                    className={`w-full h-full pb-10 flex flex-col items-center pt-24  text-custom-gray-200 font-light`}>

                                    <Link href='/dashboard' onClick={() => setOpen(false)}
                                          className={`w-full flex items-center gap-x-4 px-3 ${router.route === '/dashboard' && 'bg-primary rounded-lg text-white'}`}>
                                        <DashboardSvg width={27} height={27}
                                                      color={`${router.route === '/dashboard' ? '#fff' : '#737373'} `}/>
                                        <div>
                                          <span
                                              className={`py-6 inline-block`}>داشبورد</span>

                                        </div>

                                    </Link>

                                    <Link href='/dashboard/my-profile' onClick={() => setOpen(false)}
                                          className={`w-full flex items-center gap-x-4 px-3 ${router.route === '/dashboard/my-profile' && 'bg-primary rounded-lg text-white'}`}>
                                        <CircleProfileSvg height={27} width={27}
                                                          color={`${router.route === '/dashboard/my-profile' ? '#fff' : '#737373'} `}
                                                          strokeWidth={.9}/>
                                        <div>
                                         <span
                                             className={`py-6 inline-block`}>پروفایل</span>
                                        </div>
                                    </Link>

                                    <Link href='/dashboard/my-properties' onClick={() => setOpen(false)}
                                          className={`w-full flex items-center gap-x-4 px-3 ${(router.pathname === '/dashboard/my-properties' || router.asPath.includes('my-properties')) && 'bg-primary rounded-lg text-white'}`}>
                                        <AdsSvg
                                            color={`${(router.route === '/dashboard/my-properties' || router.asPath.includes('my-properties')) ? '#fff' : '#737373'} `}
                                            width={27} height={27}/>
                                        <div>
                                            <span className='py-6 inline-block'>آگهی های من</span>
                                        </div>
                                    </Link>

                                    <Link href='/dashboard/my-favourites' onClick={() => setOpen(false)}
                                          className={`w-full  flex items-center gap-x-4 px-3 ${router.route === '/dashboard/my-favourites' && 'bg-primary rounded-lg text-white'}`}>
                                        <MyFavSvg
                                            color={`${router.route === '/dashboard/my-favourites' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                        <div>
                                            <span className={`py-6 inline-block `}>علاقه مندی ها</span>
                                        </div>
                                    </Link>

                                    <Link href='/dashboard/orders' onClick={() => setOpen(false)}
                                          className={`w-full  flex items-center gap-x-4 px-3 ${router.route === '/dashboard/orders' && 'bg-primary rounded-lg text-white'}`}>
                                        <BasketSvg
                                            color={`${router.route === '/dashboard/orders' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                        <div>
                                            <span className={`py-6 inline-block `}>سفارشات من</span>
                                        </div>
                                    </Link>
                                    {
                                        users?.role?.id === 4 &&
                                        <Link href='/dashboard/my-advisors' onClick={() => setOpen(false)}
                                              className={`w-full flex items-center  gap-x-4 px-3`}>
                                            <PersonSvg
                                                color={`${router.route === '/dashboard/my-advisors' ? '#fff' : '#737373'}`}
                                                width={27} height={27}/>
                                            <div>
                                                <span className='py-6 inline-block'>مشاوران</span>
                                            </div>
                                        </Link>
                                    }

                                    <Link href='/dashboard/tickets' onClick={() => setOpen(false)}
                                          className={`w-full flex items-center  gap-x-4 px-3 ${router.route === '/dashboard/tickets' && 'bg-primary rounded-lg text-white'}`}>
                                        <ConversationSvg
                                            color={`${router.route === '/dashboard/tickets' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                        <div>
                                            <span className='py-6 inline-block'>ثبت تیکت</span>
                                        </div>
                                    </Link>

                                    <Link href='/dashboard/change-role' onClick={() => setOpen(false)}
                                          className={`w-full flex items-center  gap-x-4 px-3  ${router.route === '/dashboard/change-role' && 'bg-primary rounded-lg text-white'}`}>
                                        <ChangeRole color={`${router.route === '/dashboard/change-role' ? '#fff' : '#737373'}`}
                                                width={27} height={27}/>
                                        <div>
                                            <span className='py-6 inline-block'> تغییر نقش</span>
                                        </div>
                                    </Link>

                                    <Link href='/dashboard/password' onClick={() => setOpen(false)}
                                          className={`w-full flex items-center  gap-x-4 px-3  ${router.route === '/dashboard/password' && 'bg-primary rounded-lg text-white'}`}>
                                        <KeySvg color={`${router.route === '/dashboard/password' ? '#fff' : '#737373'}`}
                                                width={27} height={27}/>
                                        <div>
                                            <span className='py-6 inline-block'> رمز عبور</span>
                                        </div>
                                    </Link>

                                    <div
                                        onClick={() => setLogoutModal(true)}
                                        className={`w-full flex items-center  gap-x-4 bg-custom-red/20 rounded-lg px-2 `}>
                                        <ExitSvg width={28} height={28} color={'#FA3737'}/>
                                        <button>
                                            <span className='py-4 mt-2 inline-block text-custom-red'>خروج</span>
                                        </button>
                                    </div>

                                    <div
                                        // onClick={() => setLogoutModal(true)}
                                        className={`w-full flex items-center  gap-x-4 invisible bg-custom-red/20 rounded-lg px-2 `}>
                                        <ExitSvg width={28} height={28} color={'#FA3737'}/>
                                        <button>
                                            <span className='py-4 mt-2 inline-block text-custom-red'>خروج</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </header>

                        {/* mobile profile */}

                        {/*<div className='container'>*/}
                        {/*    <LayoutNavbar />*/}

                        {/*    {children}*/}
                        {/*</div>*/}

                    </div>


                    {/* desktop header */}

                    <div className='grid container mx-auto lg:max-w-screen-xl md:grid-cols-12  grid-flow-col pt-4 gap-x-2'>

                        {/*sidebar*/}
                        <div className='col-span-3 hidden md:block sticky top-5  '>

                            {/*user Profile*/}
                            <div className='bg-white rounded-lg p-2 mb-2'>
                                {/*<div>*/}
                                {/*    <button className='bg-primary rounded-lg p-1'>*/}
                                {/*        <EditSvg color={'#fff'} width={20} height={20}/>*/}
                                {/*    </button>*/}
                                {/*</div>*/}

                                <div className='flex flex-col gap-y-3 flex items-center justify-center'>
                                    <div className='col-span-12 xl:col-span-2'>
                                        <div className='relative w-32 h-32 '>
                                            <figure className='w-32 h-32 overflow-hidden rounded-full bg-custom-gray-200'>
                                                {
                                                    avatarFile?.preview ?
                                                        <img className='w-full h-full object-cover'
                                                             src={`${avatarFile?.preview?.preview}`}
                                                             alt=""/>
                                                        :
                                                        <img className='w-full h-full object-cover'
                                                             src={`${users?.avatar?.file}`} alt=""/>
                                                }

                                                {/*upload progress overlay*/}
                                                {
                                                    !endUpload && <div
                                                        className='absolute flex justify-center items-center w-full h-full bg-custom-gray-200/60 top-0 bottom-0 left-0 rounded-full'>
                                                        <div className='w-3/4  h-1 rounded-full overflow-hidden'>
                                                            <div className='w-full h-full bg-primary' style={{
                                                                width: `${progress}%`,
                                                                animationFillMode: 'forwards',
                                                                animationDirection: ''
                                                            }}>

                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </figure>

                                            {/*upload button*/}
                                            {
                                                endUpload && <label className=" cursor-pointer">
                                                    <div
                                                        className='absolute bg-primary p-2 rounded-full ring-2 ring-white left-1 bottom-1'>
                                                        <EditSvg color={'#fff'} width={16} height={16}/>
                                                        <input onChange={handleUploadAvatar}
                                                               accept="image/png, image/jpeg, image/HEIC" type='file'
                                                               className="hidden"/>
                                                    </div>
                                                </label>
                                            }
                                        </div>
                                    </div>
                                    <h2 className='text-xl font-bold w-full break-words text-center'>{users?.fullname}</h2>

                                    <span className='text-primary'>{users?.role?.display_name}</span>

                                    <p className='font-bold text-lg text-primary'>{user?.phone}</p>
                                </div>
                            </div>


                            {/*menu items*/}
                            <aside
                                className={`w-full relative rounded-lg px-3 py-2 bg-white flex flex-col items-center overflow-auto pb-2 gap-y-2 text-custom-gray-200 font-light`}>

                                {
                                    users?.status?.id === 0 &&
                                    <div className='absolute bg-custom-gray-200/20 w-full h-full top-0 left-0'>

                                    </div>
                                }

                                <Link href='/dashboard'
                                      className={`w-full flex items-center gap-x-4 px-3 ${router.route === '/dashboard' && 'bg-primary rounded-lg text-white'}`}>
                                    <DashboardSvg width={27} height={27}
                                                  color={`${router.route === '/dashboard' ? '#fff' : '#737373'}`}/>
                                    <div>
                                    <span
                                        className={`py-4 inline-block`}>داشبورد</span>

                                    </div>

                                </Link>

                                <Link href='/dashboard/my-profile'
                                      className={`w-full flex items-center gap-x-4 px-3 ${router.route === '/dashboard/my-profile' && 'bg-primary rounded-lg text-white'}`}>
                                    <CircleProfileSvg height={27} width={27}
                                                      color={`${router.route === '/dashboard/my-profile' ? '#fff' : '#737373'}`}
                                                      strokeWidth={.9}/>
                                    <div>
                                <span
                                    className={`py-4 inline-block`}>پروفایل</span>
                                    </div>
                                </Link>

                                <Link href='/dashboard/my-properties'
                                      className={`w-full flex items-center gap-x-4 px-3 ${(router.route === '/dashboard/my-properties' || router.asPath.includes('my-properties')) && 'bg-primary rounded-lg text-white'}`}>
                                    <AdsSvg color={`${(router.route === '/dashboard/my-properties' || router.asPath.includes('my-properties')) ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                    <div>
                                        <span className='py-4 inline-block'>آگهی های من</span>
                                    </div>
                                </Link>

                                <Link href='/dashboard/my-favourites'
                                      className={`w-full  flex items-center gap-x-4 px-3 ${router.route === '/dashboard/my-favourites' && 'bg-primary rounded-lg text-white'}`}>
                                    <MyFavSvg color={`${router.route === '/dashboard/my-favourites' ? '#fff' : '#737373'}`}
                                              width={27} height={27}/>
                                    <div>
                                  <span
                                      className={`py-4 inline-block `}>علاقه مندی ها</span>
                                    </div>
                                </Link>

                                {
                                    // user?.role?.id !== 4 &&
                                    <Link href='/dashboard/orders'
                                          className={`w-full flex items-center  gap-x-4 px-3  ${router.route === '/dashboard/orders' && 'bg-primary rounded-lg text-white'}`}>
                                        <BasketSvg
                                            color={`${router.route === '/dashboard/orders' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                        <div>
                                            <span className='py-4 inline-block'>سفارشات من</span>
                                        </div>
                                    </Link>
                                }

                                {
                                    // user?.role?.id !== 4 &&
                                    <Link href='/dashboard/tickets'
                                          className={`w-full flex items-center  gap-x-4 px-3  ${router.route === '/dashboard/tickets' && 'bg-primary rounded-lg text-white'}`}>
                                        <ConversationSvg
                                            color={`${router.route === '/dashboard/tickets' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                        <div>
                                            <span className='py-4 inline-block'>ثبت تیکت</span>
                                        </div>
                                    </Link>
                                }


                                {
                                    users?.role?.id === 4 &&
                                    <Link href='/dashboard/my-advisors'
                                          className={`w-full flex items-center  gap-x-4 px-3 ${router.route === '/dashboard/my-advisors' && 'bg-primary rounded-lg text-white'}`}>
                                        <PersonSvg
                                            color={`${router.route === '/dashboard/my-advisors' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                        <div>
                                            <span className='py-4 inline-block'>مشاوران</span>
                                        </div>
                                    </Link>
                                }

                                <Link href='/dashboard/change-role'
                                      className={`w-full flex items-center  gap-x-4 px-3 ${router.route === '/dashboard/change-role' && 'bg-primary rounded-lg text-white'}`}>
                                    <ChangeRole color={`${router.route === '/dashboard/change-role' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                    <div>
                                        <span className='py-4 inline-block'>تغییر نقش</span>
                                    </div>
                                </Link>

                                <Link href='/dashboard/password'
                                      className={`w-full flex items-center  gap-x-4 px-3 ${router.route === '/dashboard/password' && 'bg-primary rounded-lg text-white'}`}>
                                    <KeySvg color={`${router.route === '/dashboard/password' ? '#fff' : '#737373'}`}
                                            width={27} height={27}/>
                                    <div>
                                        <span className='py-4 inline-block'> رمز عبور</span>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => setLogoutModal(true)}
                                    className={`w-full flex items-center  gap-x-4 bg-custom-red/20 rounded-lg px-3 `}>
                                    <div className='flex items-center gap-x-2'>
                                        <ExitSvg width={28} height={28} color={'#FA3737'}/>
                                        <span className='py-4 inline-block text-custom-red'>خروج</span>
                                    </div>
                                </button>

                            </aside>
                        </div>

                        {/*left side*/}
                        <div className='col-span-9 	'>
                            <LayoutNavbar user={users}/>

                            <div className='my-2'>
                                {children}
                            </div>
                        </div>
                    </div>


                </div>
            );
        }
    }
;

export default DashboardLayout;