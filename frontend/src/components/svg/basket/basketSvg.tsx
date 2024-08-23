
interface BasketSvgProps {
    color : string,
    width : number,
    height : number
}

const BasketSvg = ({color , height , width} : BasketSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.07619 2.48129L5.58594 5.98119" stroke={color} stroke-width="1.44624" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.2266 2.48129L18.7168 5.98119" stroke={color} stroke-width="1.44624" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.50977 8.12162C2.50977 6.33793 3.46428 6.19331 4.6502 6.19331H19.6525C20.8384 6.19331 21.7929 6.33793 21.7929 8.12162C21.7929 10.1946 20.8384 10.0499 19.6525 10.0499H4.6502C3.46428 10.0499 2.50977 10.1946 2.50977 8.12162Z" stroke={color} stroke-width="1.44624"/>
            <path d="M9.99121 14.0512V17.474" stroke={color} stroke-width="1.44624" stroke-linecap="round"/>
            <path d="M14.4268 14.0512V17.474" stroke={color} stroke-width="1.44624" stroke-linecap="round"/>
            <path d="M3.95605 10.1946L5.31552 18.5249C5.62405 20.3954 6.36645 21.7645 9.12395 21.7645H14.9378C17.9364 21.7645 18.3799 20.4532 18.727 18.6406L20.3468 10.1946" stroke={color} stroke-width="1.44624" stroke-linecap="round"/>
        </svg>

    );
};

export default BasketSvg;