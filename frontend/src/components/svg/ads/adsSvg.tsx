
interface AddSvgProps {
    color : string,
    width : number ,
    height : number
}

const AdsSvg = ({color , width , height} : AddSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.019 23.892H16.2998C21.5338 23.892 23.6274 21.7984 23.6274 16.5644V10.2836C23.6274 5.04963 21.5338 2.95603 16.2998 2.95603H10.019C4.78501 2.95603 2.69141 5.04963 2.69141 10.2836V16.5644C2.69141 21.7984 4.78501 23.892 10.019 23.892Z" stroke={color} stroke-width="1.5702" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2.69141 14.4708H6.62738C7.42295 14.4708 8.14524 14.921 8.50115 15.6328L9.4328 17.5066C10.019 18.658 11.0658 18.658 11.317 18.658H15.0123C15.8078 18.658 16.5301 18.2079 16.886 17.4961L17.8177 15.6223C18.1736 14.9105 18.8959 14.4604 19.6915 14.4604H23.6065" stroke={color} stroke-width="1.5702" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.4219 8.19003H14.9077" stroke={color} stroke-width="1.5702" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.542 11.3304H15.776" stroke={color} stroke-width="1.5702" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};

export default AdsSvg;