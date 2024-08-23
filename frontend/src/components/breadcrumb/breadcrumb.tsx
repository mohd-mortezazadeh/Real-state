import React, {useEffect} from "react";
import ArrowLeftSvg from "../svg/arrows/arrow-left/ArrowLeftSvg";
import Link from "next/link";

interface BreadcrumbProps {
    title: string;
    subtitle: string;
    path?: {
        name: string,
        url: string
    }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
                                                   title,
                                                   subtitle,
                                                   path = [],
                                               }) => {


    useEffect(() => {
        // only execute all the code below in client side

        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state

            if (window.innerWidth < 768) {

                // path?.length >0 && path?.splice(0, 2)
            }
        }

        // Add event listener
        path && handleResize()

        // Call handler right away so state gets updated with initial window size
        // handleResize();

        // Remove event listener on cleanup
        // return () => window.removeEventListener("resize", handleResize);
    }, [path])


    return (
        <div className="bg-header-banner bg-cover bg-no-repeat bg-center md:h-[160px] min-h-[120px] relative mb-12">
            <div
                className="absolute w-full  min-h-full flex "
                style={{background: "rgba(0, 90, 220, 0.69)"}}
            >
                <div
                    className=" px-4 lg:px-16 w-full flex md:flex-row flex-col md:justify-between justify-center items-center gap-y-5  h-full m-auto">
                    <div className="flex flex-col justify-start items-start gap-y-3 ">
                        {path?.length > 0 ? <div className="text-lg lg:text-2xl font-extrabold text-white">{path[path?.length -1].name}</div> : ''}
                        {/*{subtitle.trim() && <div className="text-lg font-bold text-white md:block hidden">*/}
                        {/*    {subtitle}*/}
                        {/*</div>}*/}
                    </div>
                    <div className="flex flex-row flex-wrap justify-start items-center gap-x-0">
                        <Link href='/'>
                            <span className=" text-xs lg:text-base xl:text-lg  text-white">خانه</span>
                        </Link>
                        {path?.length > 0 ? path?.map((item, i, array) => (
                            <div
                                key={item?.name}
                                className="flex flex-row  justify-start items-center gap-x-2 text-xs lg:text-base xl:text-lg last:font-bold last:text-base xl:last:text-lg"
                            >
                                <ArrowLeftSvg color="#fff" width={18} height={16}/>
                                {
                                    i === array.length -1  ?
                                        <span  className=" text-white ">
                                            {item?.name === 'undefined' ? '' : item?.name}
                                        </span>
                                        :
                                        <Link href={`/${item?.url}`} className=" text-white ">
                                            {item?.name === 'undefined' ? '' : item?.name}
                                        </Link>
                                }
                            </div>
                        ))
                        :
                            ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;
