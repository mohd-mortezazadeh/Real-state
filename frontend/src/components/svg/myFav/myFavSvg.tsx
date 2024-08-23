
interface MyFavSvgProps {
    color : string,
    width : number ,
    height : number
}

const MyFavSvg = ({color , width , height} : MyFavSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.3158 10.5544V15.7196C23.3158 20.8847 21.2498 22.9508 16.0846 22.9508H9.88646C4.72133 22.9508 2.65527 20.8847 2.65527 15.7196V9.5214C2.65527 4.35626 4.72133 2.29021 9.88646 2.29021H15.0516" stroke={color} stroke-width="1.54954" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23.315 10.5544H19.1829C16.0838 10.5544 15.0508 9.5214 15.0508 6.42232V2.29021L23.315 10.5544Z" stroke={color} stroke-width="1.54954" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.42726 16.4737C7.08636 15.4097 7.48924 14.0977 8.59458 13.7361C9.1834 13.5502 9.90652 13.7052 10.3094 14.2733C10.6916 13.6845 11.4457 13.5502 12.0242 13.7361C13.1399 14.0977 13.5324 15.4097 13.2019 16.4737C12.675 18.1575 10.8259 19.0356 10.3094 19.0356C9.80322 19.0252 7.97476 18.1678 7.42726 16.4737Z" stroke={color} stroke-width="1.54954" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default MyFavSvg;