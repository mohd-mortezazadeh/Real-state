import {useRouter} from "next/router";
import MainLayout from "../../layouts/mainLayout";
import Link from "next/link";

const Verify = () => {

    const {query} = useRouter()

    return (
        <MainLayout hasBanner={false}>

            <>
                <div className='flex flex-col gap-y-10 items-center justify-center my-16'>
                    <div className='bg-white box-shadow-3 py-20 px-32'>
                        {
                            query.Status === "OK" ?
                                <>

                                    <p>پرداخت موفقیت آمیز بود</p>
                                </>
                                :
                                query.Status === "NOK" &&

                                <p>پرداخت موفقیت آمیز نبود</p>
                        }
                    </div>

                    <button className='bg-primary p-3 text-white rounded-lg hover:bg-blue-700'>
                        <Link href='/'>
                            بازگشت به صفحه اصلی
                        </Link>
                    </button>
                </div>
            </>
        </MainLayout>
    );
};

export default Verify;
