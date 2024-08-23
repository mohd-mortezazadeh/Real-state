import React, {FC} from "react";

import MobileSimilarPropertiesList from "./mobile/MobileSimilarPropertiesList.component";

import Divider from "../divider/Divider.component";
import PropertyCard from "../property-card/PropertyCard";
import ShowMore from "../show-more/ShowMore.component";
import NavigationBar from "../navigation-bar/navigationBar";

interface SimilarPropertiesListProps{
    data : any
}

const SimilarPropertiesList= ({data} : SimilarPropertiesListProps) => {
    return (
        <>
            <div className="space-y-7 pt-14 pb-8">
                {/*  property divider  */}

                <Divider path='' title="املاک مشابه" hasNavigation={false} hasShowMore={false}/>

                <div className="grid grid-cols-12 gap-x-7 gap-y-5">
                    {/*  mobile responsive post  -  change to slider  */}

                    <div className="col-span-12">
                        <MobileSimilarPropertiesList   nextClass={'.propertiesNext'} prevClass={'.propertiesPrev'} data={data}>
                            <PropertyCard />
                        </MobileSimilarPropertiesList>
                    </div>

                    {/*  similar posts 3 in row */}
                    {
                        data.map((data:any)=>(
                            <div key={data.id}  className="lg:col-span-4 md:col-span-6 hidden md:block ">
                                <PropertyCard data={data}/>
                            </div>
                        ))
                    }


                </div>

                {/*  mobile properties list navigation */}
                <div className='md:hidden'>
                    <NavigationBar path=''  nextClass={'propertiesNext'} prevClass={'propertiesPrev'} hasShowMore={false}/>
                </div>
            </div>
        </>
    );
};

export default SimilarPropertiesList;
