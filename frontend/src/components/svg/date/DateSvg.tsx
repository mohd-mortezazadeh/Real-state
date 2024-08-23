import {FC} from 'react'

interface DateSvgPropsType {
    color: string,
    width?:number,
    height?:number
}

const DateSvg = ({color,width=22,height=22}: DateSvgPropsType) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5.28079 1.51141V3.35674"
                stroke={color}
                stroke-width="1.07644"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M10.2017 1.51141V3.35674"
                stroke={color}
                stroke-width="1.07644"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M2.51282 5.87256H12.9697"
                stroke={color}
                stroke-width="1.07644"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M13.2772 5.50968V10.7381C13.2772 12.5834 12.3545 13.8136 10.2017 13.8136H5.2808C3.12792 13.8136 2.20526 12.5834 2.20526 10.7381V5.50968C2.20526 3.66436 3.12792 2.43414 5.2808 2.43414H10.2017C12.3545 2.43414 13.2772 3.66436 13.2772 5.50968Z"
                stroke={color}
                stroke-width="1.07644"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M10.0139 8.70825H10.0194"
                stroke={color}
                stroke-width="1.43525"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M10.0139 10.5536H10.0194"
                stroke={color}
                stroke-width="1.43525"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M7.73844 8.70825H7.74397"
                stroke={color}
                stroke-width="1.43525"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M7.73844 10.5536H7.74397"
                stroke={color}
                stroke-width="1.43525"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M5.46183 8.70825H5.46735"
                stroke={color}
                stroke-width="1.43525"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M5.46183 10.5536H5.46735"
                stroke={color}
                stroke-width="1.43525"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

export default DateSvg
