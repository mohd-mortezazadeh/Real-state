import React, {FC} from "react";
import ShowMore from "../show-more/ShowMore.component";

interface NavigationBarPropsType {
    hasShowMore ? : boolean,
    nextClass ?: string,
    prevClass ?: string,
    path : string
}

const NavigationBar : FC<NavigationBarPropsType> = ({hasShowMore , nextClass , prevClass , path}) => {
    return (
        <div className="flex flex-row justify-between items-center gap-x-4">
            <div className={`bg-primary-100/30 py-3 px-4 rounded-lg ${nextClass} cursor-pointer`}>
                <img src="/images/arrow-right.svg"/>
            </div>
            {
                hasShowMore &&
                <div className="flex flex-row justify-center gap-x-1">
                    <ShowMore path={`/${path}`}/>
                </div>
            }
            <div className={`bg-primary-100/30 py-3 px-4 rounded-lg ${prevClass} cursor-pointer`}>
                <img src="/images/arrow-left.svg"/>
            </div>
        </div>
    );
};

export default NavigationBar;