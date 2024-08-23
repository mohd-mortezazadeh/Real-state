
interface ExitSvgProps {
    width : number,
    height : number,
    color : string
}

const ExitSvg = ({width , height , color} : ExitSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.833 12.6C15.3497 6.59996 18.433 4.14996 25.183 4.14996H25.3997C32.8497 4.14996 35.833 7.1333 35.833 14.5833V25.45C35.833 32.9 32.8497 35.8833 25.3997 35.8833H25.183C18.483 35.8833 15.3997 33.4666 14.8497 27.5666" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24.9999 20H6.0332" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.75033 14.4165L4.16699 19.9998L9.75033 25.5832" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default ExitSvg;