interface CircleProfileSvg {
    color?: string,
    width?: number,
    height?: number,
    strokeWidth?: number
}

const CircleProfileSvg = ({color = "#005ADC", width = 17, height = 16 ,strokeWidth =1.32665}: CircleProfileSvg) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.81097 8.51861C8.76454 8.51198 8.70484 8.51198 8.65177 8.51861C7.48432 8.47881 6.55566 7.52362 6.55566 6.34954C6.55566 5.14892 7.52412 4.17383 8.73137 4.17383C9.93199 4.17383 10.9071 5.14892 10.9071 6.34954C10.9004 7.52362 9.97842 8.47881 8.81097 8.51861Z"
                stroke={color}
                stroke-width={strokeWidth}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M13.2019 12.8961C12.0212 13.9773 10.4557 14.634 8.73107 14.634C7.00642 14.634 5.44097 13.9773 4.26025 12.8961C4.32659 12.2726 4.72458 11.6623 5.43434 11.1847C7.25185 9.97748 10.2235 9.97748 12.0278 11.1847C12.7376 11.6623 13.1355 12.2726 13.2019 12.8961Z"
                stroke={color}
                stroke-width={strokeWidth}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M8.7314 14.6337C12.3948 14.6337 15.3647 11.6639 15.3647 8.00044C15.3647 4.337 12.3948 1.36719 8.7314 1.36719C5.06795 1.36719 2.09814 4.337 2.09814 8.00044C2.09814 11.6639 5.06795 14.6337 8.7314 14.6337Z"
                stroke={color}
                stroke-width={strokeWidth}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
}

export default CircleProfileSvg
