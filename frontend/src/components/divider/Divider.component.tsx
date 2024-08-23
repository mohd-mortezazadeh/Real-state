import React, {FC} from "react";
import ShowMore from "../show-more/ShowMore.component";
import NavigationBar from "../navigation-bar/navigationBar";

interface DividerProps {
    title: string,
    hasNavigation?: boolean,
    hasShowMore ?: boolean,
    path : string
}

const Divider: FC<DividerProps> = ({title, hasNavigation = false , hasShowMore = true , path}) => {
    return (
        <>
            <div className="flex flex-row items-center md:items-between md:justify-between justify-center gap-y-2 mt-8 md:mt-0">
                <div className="flex flex-col gap-1 md:items-start items-center justify-center">
                    <div className="text-2xl font-bold">{title}</div>
                    <div className="w-2/3 h-1 bg-primary-lin rounded-[50px]"></div>
                </div>
                {hasNavigation ?
                    <div className='hidden md:block'>
                        <NavigationBar path={path} nextClass={'nextCities'} prevClass={'prevCities'} hasShowMore={false}/>
                    </div>

                    : <div className="md:flex hidden">
                        {
                            hasShowMore ?
                                <ShowMore path={`/${path}`}/>
                                :
                                <>
                                </>
                        }
                    </div>
                }


            </div>
        </>
    );
};

export default Divider;
