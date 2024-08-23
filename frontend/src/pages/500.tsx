
import Head from "next/head";
import MainLayout from "../layouts/mainLayout";

const Custom500 = () => {


    return (
        <MainLayout hasBanner={false}>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <div className='py-20 min-h-screen flex items-center'>
                <div className='h-full w-full flex justify-center flex-col items-center px-4 md:p-0'>
                    <div className='flex justify-center items-center text-primary text-[#86D5EB] flex-col gap-y-4 w-full'>
                        {/*<p>صبر کن {second} ثانیه دیگه میریـــم صفحه اصلی</p>*/}
                    </div>

                    <div className='flex flex-col justify-center items-center gap-y-8 pb-24'>
                        <figure className='mt-10'>
                            <img src="/images/500.svg" alt=""/>
                        </figure>

                        <h1 className='text-2xl md:text-xl'>متاسفانه مشکلی رخ داده است دوباره امتحان کنید</h1>
                    </div>

                    {/*<Link href='/'*/}
                    {/*      className='text-white mt-16 flex items-center gap-x-1 text-text bg-white rounded p-2 hover:bg-sky-200 transition-colors'>*/}
                    {/*    <span className='text-sm'>بازگشت به خانه</span>*/}
                    {/*    <ArrowLeftSvg color='#051429' width={18} height={18}/>*/}
                    {/*</Link>*/}
                </div>
            </div>
        </MainLayout>
    );
};

export default Custom500;