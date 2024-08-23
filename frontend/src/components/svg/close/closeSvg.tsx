interface CloseIconPropsType {
    color?: string,
    width?:number,
    height?:number
}

const CloseIcon = ({color="#005adc",height=15,width=15} : CloseIconPropsType) => {
    return (
        <svg width={width} height={height} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.72217 13.2785L13.278 1.72266" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.278 13.2785L1.72217 1.72266" stroke={color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>


    );
};

export default CloseIcon;