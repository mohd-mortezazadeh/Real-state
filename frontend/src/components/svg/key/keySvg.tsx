
interface KeySvgProps {
    color : string,
    width : number,
    height : number
}

const KeySvg = ({color , height , width} : KeySvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5197 16.2992C19.3066 18.5016 16.1372 19.1784 13.3547 18.3082L8.29451 23.3577C7.92923 23.7337 7.20941 23.9593 6.69373 23.8841L4.35165 23.5618C3.57812 23.4544 2.8583 22.7238 2.74012 21.9503L2.41782 19.6082C2.34262 19.0925 2.58972 18.3727 2.94425 18.0074L7.99369 12.958C7.13421 10.1647 7.80031 6.99533 10.0135 4.79292C13.1828 1.62359 18.3289 1.62359 21.509 4.79292C24.6891 7.96225 24.6891 13.1299 21.5197 16.2992Z" stroke={color} stroke-width="1.61152" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.66113 19.0495L10.1321 21.5205" stroke={color} stroke-width="1.61152" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.8371 12.077C16.7271 12.077 17.4486 11.3555 17.4486 10.4655C17.4486 9.57545 16.7271 8.85394 15.8371 8.85394C14.9471 8.85394 14.2256 9.57545 14.2256 10.4655C14.2256 11.3555 14.9471 12.077 15.8371 12.077Z" stroke={color} stroke-width="1.61152" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default KeySvg;