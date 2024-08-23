interface EditSvgProps {
    color: string,
    width: number,
    height: number,
}

const EditSvg = ({color, height, width}: EditSvgProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.3258 2.39532H10.0933C4.51186 2.39532 2.2793 4.62788 2.2793 10.2093V16.907C2.2793 22.4883 4.51186 24.7209 10.0933 24.7209H16.7909C22.3723 24.7209 24.6049 22.4883 24.6049 16.907V14.6744"
                stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path
                d="M17.9516 3.53395L9.15528 12.3302C8.8204 12.6651 8.48551 13.3237 8.41854 13.8037L7.93854 17.1637C7.75993 18.3805 8.61947 19.2288 9.83621 19.0614L13.1962 18.5814C13.665 18.5144 14.3237 18.1795 14.6697 17.8446L23.466 9.04836C24.9841 7.53022 25.6985 5.7665 23.466 3.53395C21.2334 1.30139 19.4697 2.01581 17.9516 3.53395Z"
                stroke={color} stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.6904 4.79535C17.4383 7.46326 19.5258 9.5507 22.2048 10.3098" stroke={color} stroke-width="2"
                  stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default EditSvg;