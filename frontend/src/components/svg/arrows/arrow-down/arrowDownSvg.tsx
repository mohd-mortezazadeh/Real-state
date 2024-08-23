interface ArrowDownSvgProps {
    rectFill ? : string,
    color ? : string,
    width ? : number,
    height ? : number
}


const ArrowDownSvg = ({width=15,rectFill="#fff",color="#005ADC",height=15} : ArrowDownSvgProps) => {
    return (
        <>

            <svg width={width} height={height} viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="14" height="14.2014" transform="matrix(0 -1 -1 0 14.4033 14)" fill={rectFill}/>
                <path d="M2.52163 6.27913L6.41866 10.5661C6.87889 11.0724 7.632 11.0724 8.09223 10.5661L11.9893 6.27913" stroke={color} stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>


        </>
    );
};

export default ArrowDownSvg;