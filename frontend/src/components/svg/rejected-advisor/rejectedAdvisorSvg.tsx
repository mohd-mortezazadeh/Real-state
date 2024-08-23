interface RejectedAdvisorSvgProps {
    width: number,
    height: number,
    color: string
}

const RejectedAdvisorSvg = ({height,color,width} :RejectedAdvisorSvgProps ) => {
    return (
        <svg width={width} height={height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9375 21.375H17.4375" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.6672 12.2287C13.5547 12.2175 13.4197 12.2175 13.2959 12.2287C10.6184 12.1387 8.49219 9.945 8.49219 7.245C8.49219 4.48875 10.7197 2.25 13.4872 2.25C16.2434 2.25 18.4822 4.48875 18.4822 7.245C18.4709 9.945 16.3447 12.1387 13.6672 12.2287Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.4906 24.5359C11.4431 24.5359 9.40688 24.0184 7.85438 22.9834C5.13187 21.1609 5.13187 18.1909 7.85438 16.3796C10.9481 14.3096 16.0219 14.3096 19.1156 16.3796" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default RejectedAdvisorSvg;