interface GlobalSvgProps {
    color: string,
    width: number,
    height: number,
    className?: any
}

const GlobalSvg = ({color, width, height, className}: GlobalSvgProps) => {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 21 21" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.6082 18.9745C15.3715 18.9745 19.233 15.1131 19.233 10.3497C19.233 5.58641 15.3715 1.72496 10.6082 1.72496C5.84485 1.72496 1.9834 5.58641 1.9834 10.3497C1.9834 15.1131 5.84485 18.9745 10.6082 18.9745Z"
                stroke={color} stroke-width="1.29372" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.15866 2.58743H8.02114C6.33931 7.62431 6.33931 13.0752 8.02114 18.112H7.15866" stroke={color}
                  stroke-width="1.29372" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.1963 2.58743C14.8781 7.62431 14.8781 13.0752 13.1963 18.112" stroke={color}
                  stroke-width="1.29372" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.84668 13.7997V12.9372C7.88356 14.619 13.3344 14.619 18.3713 12.9372V13.7997" stroke={color}
                  stroke-width="1.29372" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.84668 7.76232C7.88356 6.08049 13.3344 6.08049 18.3713 7.76232" stroke={color}
                  stroke-width="1.29372" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default GlobalSvg;