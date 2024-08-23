import {useMemo, useState} from "react";
import {AiFillStar} from "react-icons/ai";

interface RatingProps {
    count: number,
    rating: number | null,
    color: {
        filled : string,
        unFilled : string
    },
    onRating: (a : number) => void
}

const Rating = ({count, rating, color, onRating} : RatingProps) => {

    const [hoverRating , setHoverRating] = useState(0)


    const getColor = (rate: number) => {
        if(hoverRating >= rate){
            return color.filled
        }else if(!hoverRating && rating! >=rate){
            return color.filled
        }

        return color.unFilled
    }

    const starRating = useMemo(()=>{
        return Array(count)
            .fill(0)
            .map((_ , index)=>index + 1)
            .map((rate:number)=>{
                return(
                    <AiFillStar
                        key={rate}
                        className='cursor-pointer w-8 h-8 '
                        onClick={()=>onRating(rate)}
                        onMouseEnter={()=>setHoverRating(rate)}
                        onMouseLeave={()=>setHoverRating(0)}
                        style={{color : getColor(rate) , fill : getColor(rate)}}
                    />
                )
            })
    } , [count , rating , hoverRating])

    return (
        <div className='flex items-center'>
            {starRating}
        </div>
    );
};

export default Rating;