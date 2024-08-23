import CircleProfileSvg from "../svg/circle-profile/CircleProfileSvg";
import AddSvg from "../svg/add/addSvg";
import GlobalSvg from "../svg/global/globalSvg";
import Link from "next/link";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import {RiHome3Line} from "react-icons/ri";
import DashboardSvg from "../svg/dashboard/dashboardSvg";
import AdsSvg from "../svg/ads/adsSvg";
import MyFavSvg from "../svg/myFav/myFavSvg";
import BasketSvg from "../svg/basket/basketSvg";
import ConversationSvg from "../svg/conversation/conversationSvg";
import KeySvg from "../svg/key/keySvg";
import ChangeRole from "../svg/change-role/ChangeRole";


const LayoutNavbar = ({user}: any) => {

    const router = useRouter()

    return (
        <div className='flex rounded-lg items-center justify-between bg-white p-4 box-shadow-1'>
            <div className='flex items-center gap-x-2'>

                {
                    router.asPath === '/dashboard' ?
                        <>
                            <DashboardSvg width={27} height={27}
                                          color={'#005adc'}/>
                        </>
                        : router.asPath.includes('/my-profile') ?
                            <>
                                <CircleProfileSvg height={27} width={27}
                                                  color={'#005adc'}
                                                  strokeWidth={.9}/>
                            </>
                            : router.asPath.includes('/my-properties') ?
                                <>
                                    <AdsSvg color={'#005adc'}
                                            width={27} height={27}/>
                                </>
                                : router.asPath.includes('/my-favourites') ?
                                    <>
                                        <MyFavSvg color={'#005adc'}
                                                  width={27} height={27}/>
                                    </>
                                    :
                                    router.asPath.includes('/tickets') ?
                                        <>
                                            <ConversationSvg
                                                color={'#005adc'}
                                                width={27} height={27}/>
                                        </>
                                        :
                                        router.asPath.includes('/password')  ?
                                        <>

                                            <KeySvg color={'#005adc'}
                                                    width={27} height={27}/>
                                        </>
                                            :
                                            router.asPath.includes('/orders') ?
                                                <>
                                                    <BasketSvg color={'#005adc'}
                                                               width={27} height={27} />
                                                </>
                                                :
                                                router.asPath.includes('/change-role') &&
                                                <>
                                                    <ChangeRole color={'#005adc'}
                                                                width={27} height={27} />
                                                </>

                }
                <h1 className='text-primary font-bold md:text-xl text-sm'>
                    {
                        router.asPath === '/dashboard' ?
                            <><span>داشبورد</span>
                            </>
                            : router.asPath.includes('/my-profile') ?
                                <>پروفایل</>
                                : router.asPath.includes('/my-properties') ?
                                    <>آگهی های
                                        من</>
                                    : router.asPath.includes('/my-favourites') ?
                                        <>علاقه مندی ها</>
                                        :
                                        router.asPath.includes('/tickets') ?
                                            <>تیکت ها</>
                                            :
                                            router.asPath.includes('/password') ?
                                            <>پسوورد</>
                                                :
                                                router.asPath.includes('/orders') ?
                                                    <>سفارشات من</>
                                                    :
                                                    router.asPath.includes('/change-role') &&
                                                        <>تغییر نقش</>

                    }
                </h1>

            </div>

            <div className='flex items-center gap-x-3'>
                {/*<Link href={'/dashboard/tickets'} >*/}
                {/*    <ConversationSvg*/}
                {/*        color={`#292D32`}*/}
                {/*        width={27} height={27}/>*/}
                {/*</Link>*/}

                {/*<Link href='/'>*/}
                {/*    <GlobalSvg color={'#292D32'} width={23} height={23}/>*/}
                {/*</Link>*/}

                <Link href={'/'}
                      className=' p-1 rounded flex items-center gap-x-1 bg-amber-500 hover:bg-amber-600 transition-colors text-white'>
                    <RiHome3Line className='w-6 h-6'/>
                    <span className='hidden md:block text-sm'> بازگشت به سایت</span>

                    {/*<GlobalSvg className='hidden sm:block' color={'#292D32'} width={20} height={20}/>*/}
                </Link>

                {
                    user?.status?.id === 0 ?
                        <button
                            onClick={() => toast('اکانت شما هنوز تایید نشده است.')}
                            className='text-sm flex items-center gap-x-2 bg-primary text-white p-1 rounded-md'>
                            <span className='hidden md:block'><AddSvg color={'#fff'}/></span>
                            <span>ثبت آگهی رایگان</span>
                        </button>
                        :

                        <Link href='/add-property'
                              className='text-sm flex items-center gap-x-2 bg-primary text-white p-1 rounded-md'>
                            <span className='hidden md:block'><AddSvg color={'#fff'}/></span>
                            <span>ثبت آگهی رایگان</span>
                        </Link>
                }
                {/*<Link href={'/add-property'} className='md:hidden'>*/}
                {/*    <AddSvg color={'#292D32'}/>*/}
                {/*</Link>*/}
            </div>
        </div>
    );
};

export default LayoutNavbar;