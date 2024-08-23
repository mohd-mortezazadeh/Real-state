import ArrowUp from "../../../components/svg/arrows/arrow-up/arrowUpSvg";
import {scrollToTop} from "../../../utils/scrollToTop";
import Link from "next/link";
import {BsTelegram, BsWhatsapp} from "react-icons/bs";

const Footer = () => {
    return (
        <>
            <footer className="rounded-t-3xl ">
                <div className="relative h-full bg-cover pb-4 bg-no-repeat bg-footer-banner bg-bottom bg-left ">
                    {/*go to top button*/}

                    {/*<div>*/}
                    <button onClick={scrollToTop}
                            className="absolute -top-1 md:top-4 lg:top-14  z-10 text-center right-1/2 translate-x-1/2 p-4 rounded-full bg-primary ring-4 ring-white">
                        <ArrowUp/>
                    </button>
                    {/*</div>*/}

                    {/*curve*/}
                    <div className="relative">
                        <div className=" w-full flex justify-center mb-4">
                            <img
                                src="/images/curve2.png"
                                className="absolute w-full -top-1 lg:-top-0 left-0"
                                alt=""
                            />

                            {/*  footer items  */}

                            <div
                                className="container mx-auto lg:max-w-screen-xl text-white flex flex-col md:flex-row md:flex-wrap md:justify-between md:mt-36 text-center md:text-right mt-20 ">
                                {/* useful links */}
                                <div className="flex flex-col  gap-y-4 md:gap-y-5 md:order-2">
                                    <h2 className="text-xl font-bold">لینک های مفید</h2>
                                    <Link href={'/about-us'}
                                          className="relative hover:font-semibold hover:before:absolute before:w-2/3 before:h-1 before:-bottom-2 before:bg-white before:rounded-md">
                                        <span>درباره ویلا ارزان</span>
                                    </Link>
                                    {/*<Link href={'/'} className="relative hover:font-semibold  hover:before:absolute before:w-2/3 before:h-1 before:-bottom-2 before:bg-white before:rounded-md">*/}
                                    {/*    <span>سوالات متداول</span>*/}
                                    {/*</Link>*/}
                                    {/*<Link href='/' className="relative hover:font-semibold  hover:before:absolute before:w-2/3 before:h-1 before:-bottom-2 before:bg-white before:rounded-md">*/}
                                    {/*    <span>قوانین و مقررات</span>*/}
                                    {/*</Link>*/}
                                    <Link href={'/contact-us'}
                                          className="relative hover:font-semibold  hover:before:absolute before:w-2/5 before:h-1 before:-bottom-2 before:bg-white before:rounded-md">
                                        <span>ارتباط با ما</span>
                                    </Link>
                                    <a href={'https://villaarzan.com/app/base.apk'} download
                                       className="relative hover:font-semibold  hover:before:absolute before:w-2/3 before:h-1 before:-bottom-2 before:bg-white before:rounded-md">
                                        <span>دانلود اپلیکیشن</span>
                                    </a>

                                    {/*social media*/}
                                    <div
                                        className='flex gap-y-2 gap-x-4 mt-0 items-center justify-center md:items-start'>
                                        <a className='flex items-center gap-x-2' href="https://t.me/villaa_arzan">
                                            <BsTelegram className='w-8 h-8 cursor-pointer'/>
                                            {/*<span>villaa_arzan@</span>*/}
                                        </a>
                                        <a className='flex items-center gap-x-2' href="https://wa.me/qr/X6WQUX2N4MOEM1">
                                            <BsWhatsapp className='w-8 h-8 cursor-pointer'/>
                                            {/*<span>villaa_arzan@</span>*/}
                                        </a>

                                        {/*<BsInstagram className='w-8 h-8 cursor-pointer'/>*/}
                                    </div>
                                </div>

                                {/*location*/}
                                <div className="md:order-1">
                                    {/*first*/}
                                    <div className="flex flex-col gap-y-4">
                                        <h2 className="flex justify-center md:justify-start items-center md:mt-0 mt-14 gap-x-2">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 34 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M17.0001 20.0741C13.9826 20.0741 11.5176 17.6233 11.5176 14.5916C11.5176 11.56 13.9826 9.12329 17.0001 9.12329C20.0176 9.12329 22.4826 11.5741 22.4826 14.6058C22.4826 17.6375 20.0176 20.0741 17.0001 20.0741ZM17.0001 11.2483C15.1584 11.2483 13.6426 12.75 13.6426 14.6058C13.6426 16.4616 15.1442 17.9633 17.0001 17.9633C18.8559 17.9633 20.3576 16.4616 20.3576 14.6058C20.3576 12.75 18.8417 11.2483 17.0001 11.2483Z"
                                                    fill="white"
                                                />
                                                <path
                                                    d="M16.9999 32.2433C14.9032 32.2433 12.7924 31.4499 11.149 29.8774C6.96988 25.8541 2.35155 19.4366 4.09405 11.8008C5.66655 4.87325 11.7157 1.77075 16.9999 1.77075C16.9999 1.77075 16.9999 1.77075 17.0141 1.77075C22.2982 1.77075 28.3474 4.87325 29.9199 11.8149C31.6482 19.4508 27.0299 25.8541 22.8507 29.8774C21.2074 31.4499 19.0966 32.2433 16.9999 32.2433ZM16.9999 3.89575C12.8774 3.89575 7.57905 6.09158 6.17655 12.2683C4.64655 18.9408 8.83988 24.6924 12.6365 28.3333C15.0874 30.6991 18.9266 30.6991 21.3774 28.3333C25.1599 24.6924 29.3532 18.9408 27.8516 12.2683C26.4349 6.09158 21.1224 3.89575 16.9999 3.89575Z"
                                                    fill="white"
                                                />
                                            </svg>

                                            <span className="text-xl font-bold">آدرس دفتر</span>
                                        </h2>
                                        <p className="leading-8">
                                            تهران
                                        </p>
                                    </div>

                                    {/*second*/}
                                    <div className="flex flex-col gap-y-4">
                                        <h2 className="flex justify-center md:justify-start items-center mt-6 gap-x-2">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M17.45 22.75C16.32 22.75 15.13 22.48 13.9 21.96C12.7 21.45 11.49 20.75 10.31 19.9C9.14 19.04 8.01 18.08 6.94 17.03C5.88 15.96 4.92 14.83 4.07 13.67C3.21 12.47 2.52 11.27 2.03 10.11C1.51 8.87 1.25 7.67 1.25 6.54C1.25 5.76 1.39 5.02 1.66 4.33C1.94 3.62 2.39 2.96 3 2.39C3.77 1.63 4.65 1.25 5.59 1.25C5.98 1.25 6.38 1.34 6.72 1.5C7.11 1.68 7.44 1.95 7.68 2.31L10 5.58C10.21 5.87 10.37 6.15 10.48 6.43C10.61 6.73 10.68 7.03 10.68 7.32C10.68 7.7 10.57 8.07 10.36 8.42C10.21 8.69 9.98 8.98 9.69 9.27L9.01 9.98C9.02 10.01 9.03 10.03 9.04 10.05C9.16 10.26 9.4 10.62 9.86 11.16C10.35 11.72 10.81 12.23 11.27 12.7C11.86 13.28 12.35 13.74 12.81 14.12C13.38 14.6 13.75 14.84 13.97 14.95L13.95 15L14.68 14.28C14.99 13.97 15.29 13.74 15.58 13.59C16.13 13.25 16.83 13.19 17.53 13.48C17.79 13.59 18.07 13.74 18.37 13.95L21.69 16.31C22.06 16.56 22.33 16.88 22.49 17.26C22.64 17.64 22.71 17.99 22.71 18.34C22.71 18.82 22.6 19.3 22.39 19.75C22.18 20.2 21.92 20.59 21.59 20.95C21.02 21.58 20.4 22.03 19.68 22.32C18.99 22.6 18.24 22.75 17.45 22.75ZM5.59 2.75C5.04 2.75 4.53 2.99 4.04 3.47C3.58 3.9 3.26 4.37 3.06 4.88C2.85 5.4 2.75 5.95 2.75 6.54C2.75 7.47 2.97 8.48 3.41 9.52C3.86 10.58 4.49 11.68 5.29 12.78C6.09 13.88 7 14.95 8 15.96C9 16.95 10.08 17.87 11.19 18.68C12.27 19.47 13.38 20.11 14.48 20.57C16.19 21.3 17.79 21.47 19.11 20.92C19.62 20.71 20.07 20.39 20.48 19.93C20.71 19.68 20.89 19.41 21.04 19.09C21.16 18.84 21.22 18.58 21.22 18.32C21.22 18.16 21.19 18 21.11 17.82C21.08 17.76 21.02 17.65 20.83 17.52L17.51 15.16C17.31 15.02 17.13 14.92 16.96 14.85C16.74 14.76 16.65 14.67 16.31 14.88C16.11 14.98 15.93 15.13 15.73 15.33L14.97 16.08C14.58 16.46 13.98 16.55 13.52 16.38L13.25 16.26C12.84 16.04 12.36 15.7 11.83 15.25C11.35 14.84 10.83 14.36 10.2 13.74C9.71 13.24 9.22 12.71 8.71 12.12C8.24 11.57 7.9 11.1 7.69 10.71L7.57 10.41C7.51 10.18 7.49 10.05 7.49 9.91C7.49 9.55 7.62 9.23 7.87 8.98L8.62 8.2C8.82 8 8.97 7.81 9.07 7.64C9.15 7.51 9.18 7.4 9.18 7.3C9.18 7.22 9.15 7.1 9.1 6.98C9.03 6.82 8.92 6.64 8.78 6.45L6.46 3.17C6.36 3.03 6.24 2.93 6.09 2.86C5.93 2.79 5.76 2.75 5.59 2.75ZM13.95 15.01L13.79 15.69L14.06 14.99C14.01 14.98 13.97 14.99 13.95 15.01Z"
                                                    fill="white"
                                                />
                                            </svg>

                                            <span className="text-xl font-bold">پشتیبانی</span>
                                        </h2>
                                        <div className="flex flex-col gap-y-4">
                                            <a href={`tel:09199575689`}>09199575689</a>
                                        </div>
                                    </div>

                                    {/*second */}

                                    <div className="flex flex-col gap-y-4">
                                        <h2 className="flex justify-center md:justify-start items-center mt-6 gap-x-2">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-miterlimit="10"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M7 8H17"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                                <path
                                                    d="M7 13H13"
                                                    stroke="white"
                                                    stroke-width="1.5"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>

                                            <span className="text-2xl font-bold">ایمیل</span>
                                        </h2>

                                        <p>Villaarzan.mazandaran@gmail.com</p>
                                    </div>
                                </div>

                                {/* licences */}

                                <div className="flex flex-col gap-y-4 md:order-3">
                                    <h2 className="flex justify-center md:justify-start items-center mt-14 md:mt-14 lg:mt-0 gap-x-2">
                                        <span className="text-xl font-bold">مجوز ها</span>
                                    </h2>
                                    <div className="flex justify-center gap-x-3 pb-[75px] md:pb-0">
                                        <img src="/images/e-namad.png" alt=""/>
                                        <img src="/images/zarinpal.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </footer>

            <div className='w-full  bg-slate-800 text-sm text-center text-white p-2'>
                <a rel='nofollow' href='https://camooda.ir' className='hover:text-gray-300'>
                    طراحی و پیاده سازی گروه نرم افزاری کامودا
                </a>
            </div>
        </>
    );
};

export default Footer;
