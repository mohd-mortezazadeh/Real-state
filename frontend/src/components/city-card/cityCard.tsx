import Link from "next/link";

interface CardCityPropsType {
    city : any
}
const CityCard = ({city} : CardCityPropsType) => {
    
    return (
       <Link href={`/${city?.slug}`}>
           <div className=' box-shadow-1 rounded-lg p-5 overflow-hidden'>
               {/*   card image */}
               <div className='h-[150px]'>
                   <img className='w-full h-full object-cover rounded-lg' src={`/images/${city?.slug}.png`} alt=""/>
               </div>

               {/*card info*/}
               <div className='mt-4 flex items-center justify-between'>
                   <span className='font-bold text-lg'>{city.name}</span>
                   {/*<span className='text-primary'> {city?.ad_count} ملک</span>*/}
               </div>
           </div>
       </Link>
    );
};

export default CityCard;