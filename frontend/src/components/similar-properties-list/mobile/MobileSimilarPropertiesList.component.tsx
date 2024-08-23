import React, {FC, ReactElement, ReactNode} from "react";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation,Autoplay} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import PropertyCard from "../../property-card/PropertyCard";
import {CSSSelector} from "swiper/types";


interface MobileSimilarPropertiesListPropsType {
    children: ReactElement,
    data?: any,
    prevClass?: CSSSelector | HTMLElement | null | undefined
    nextClass?: CSSSelector | HTMLElement | null | undefined
}

const MobileSimilarPropertiesList: FC<MobileSimilarPropertiesListPropsType> = ({
                                                                                   children,
                                                                                   data,
                                                                                   prevClass,
                                                                                   nextClass
                                                                               }) => {  
    
    return (
        <>
            {/*  similar single property wrapper */}

            <div className="md:hidden h-full">
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    autoplay={{delay:5000}}
                    
                    spaceBetween={40}
                    modules={[Navigation,Autoplay]}
                    navigation={{
                        prevEl: prevClass,
                        nextEl: nextClass,
                        enabled: true,
                    }}

                    className="rounded-2xl box-shadow-2"

                >
                    {
                        data ?
                            data.map((item: any) => (
                                < SwiperSlide key={item.id}>

                                    {React.cloneElement(children, {data: item})}

                                </SwiperSlide>
                            ))
                            :
                            [1, 2, 3, 4].map((item: any) => (
                                < SwiperSlide key={item.id}>

                                    {/*{React.cloneElement(children, [item])}*/}
                                    {children}
                                </SwiperSlide>
                            ))
                    }

                </Swiper>
            </div>
        </>
    );
};

export default MobileSimilarPropertiesList;
