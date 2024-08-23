import {FC} from 'react'
interface ArrowUpProps{
    width?:string,
    height?:string,
    color?:string
}
const ArrowUp:FC<ArrowUpProps> = ({width="24",height="24",color="white"}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.93007 9.57007L12.0001 3.50007L18.0701 9.57007" stroke={color} stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20.5V3.67" stroke={color} stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};

export default ArrowUp;