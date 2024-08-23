
interface DashboardSvgProps {
    color : string,
    width : number,
    height : number
}

const DashboardSvg = ({color , width , height} : DashboardSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.29043 10.9173H8.43912C10.5878 10.9173 11.6622 9.84296 11.6622 7.69427V5.54557C11.6622 3.39687 10.5878 2.32253 8.43912 2.32253H6.29043C4.14173 2.32253 3.06738 3.39687 3.06738 5.54557V7.69427C3.06738 9.84296 4.14173 10.9173 6.29043 10.9173Z" stroke={color} stroke-width="1.61152" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.183 10.9173H21.3317C23.4804 10.9173 24.5547 9.84296 24.5547 7.69427V5.54557C24.5547 3.39687 23.4804 2.32253 21.3317 2.32253H19.183C17.0343 2.32253 15.96 3.39687 15.96 5.54557V7.69427C15.96 9.84296 17.0343 10.9173 19.183 10.9173Z" stroke={color} stroke-width="1.61152" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.183 23.8095H21.3317C23.4804 23.8095 24.5547 22.7351 24.5547 20.5864V18.4378C24.5547 16.2891 23.4804 15.2147 21.3317 15.2147H19.183C17.0343 15.2147 15.96 16.2891 15.96 18.4378V20.5864C15.96 22.7351 17.0343 23.8095 19.183 23.8095Z" stroke={color} stroke-width="1.61152" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.29043 23.8095H8.43912C10.5878 23.8095 11.6622 22.7351 11.6622 20.5864V18.4378C11.6622 16.2891 10.5878 15.2147 8.43912 15.2147H6.29043C4.14173 15.2147 3.06738 16.2891 3.06738 18.4378V20.5864C3.06738 22.7351 4.14173 23.8095 6.29043 23.8095Z" stroke={color} stroke-width="1.61152" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>


    );
};

export default DashboardSvg;