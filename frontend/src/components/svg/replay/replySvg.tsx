interface ReplySvgProps {
    color?: string,
    width?: number,
    height?: number

}

const ReplySvg = ({color = "#fff", width = 18, height = 18}: ReplySvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.88661 13.7325H11.0009C12.7653 13.7325 14.1973 12.0525 14.1973 9.98254C14.1973 7.91254 12.7653 6.23254 11.0009 6.23254H3.96875"
                stroke={color} stroke-width="0.958929" stroke-miterlimit="10" stroke-linecap="round"
                stroke-linejoin="round"/>
            <path d="M5.43931 8.10758L3.80273 6.18758L5.43931 4.26758" stroke={color} stroke-width="0.958929"
                  stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};

export default ReplySvg;