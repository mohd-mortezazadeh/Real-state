interface ActiveAdvisorSvg {
    width: number,
    height: number,
    color: string
}

const ActiveAdvisorSvg = ({color, height, width}: ActiveAdvisorSvg) => {
    return (
        <svg width={width} height={height} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.4492 23.0183L19.2859 24.855L22.9592 21.1816" stroke={color} stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
            <path
                d="M14.6951 13.1349C14.5743 13.1228 14.4293 13.1228 14.2963 13.1349C11.4205 13.0382 9.13676 10.682 9.13676 7.78199C9.12468 4.82158 11.5293 2.41699 14.4897 2.41699C17.4501 2.41699 19.8547 4.82158 19.8547 7.78199C19.8547 10.682 17.5588 13.0382 14.6951 13.1349Z"
                stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path
                d="M14.4891 26.3537C12.2899 26.3537 10.1028 25.7979 8.43531 24.6862C5.51115 22.7287 5.51115 19.5387 8.43531 17.5933C11.7582 15.3699 17.2078 15.3699 20.5307 17.5933"
                stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default ActiveAdvisorSvg;