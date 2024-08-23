import React from 'react';

interface ChangeRoleProps {
    width?: number
    height?: number
    color?: string
}

const ChangeRole = ({width,height,color} : ChangeRoleProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16.0026 16C19.6845 16 22.6693 13.0152 22.6693 9.33329C22.6693 5.65139 19.6845 2.66663 16.0026 2.66663C12.3207 2.66663 9.33594 5.65139 9.33594 9.33329C9.33594 13.0152 12.3207 16 16.0026 16Z"
                stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.53906 29.3333C4.53906 24.1733 9.67239 20 15.9924 20C17.2724 20 18.5124 20.1733 19.6724 20.4933"
                  stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path
                d="M27.2309 26C27.2309 28.1466 25.4887 29.8889 23.342 29.8889C21.1953 29.8889 19.8848 27.7266 19.8848 27.7266M19.8848 27.7266H21.6426M19.8848 27.7266V29.6711M19.4531 26C19.4531 23.8533 21.1798 22.1111 23.342 22.1111C25.9359 22.1111 27.2309 24.2733 27.2309 24.2733M27.2309 24.2733V22.3289M27.2309 24.2733H25.5042"
                stroke={color} stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};

export default ChangeRole;