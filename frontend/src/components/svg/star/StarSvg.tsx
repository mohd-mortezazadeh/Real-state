import {FC} from 'react'
interface StarSvgProps {
    color?: string;
    width?: number;
    height?: number;
}
const StarSvg:FC<StarSvgProps> = ({color="white",height=14,width=14}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.46977 1.98197L8.42067 3.88377C8.55034 4.14851 8.89612 4.40244 9.18788 4.45107L10.9114 4.73742C12.0136 4.92111 12.2729 5.72073 11.4787 6.50955L10.1388 7.84945C9.91186 8.07637 9.78759 8.514 9.85783 8.82737L10.2414 10.486C10.544 11.7989 9.84702 12.3068 8.68541 11.6206L7.06996 10.6643C6.77821 10.4914 6.29735 10.4914 6.0002 10.6643L4.38475 11.6206C3.22854 12.3068 2.52617 11.7935 2.82873 10.486L3.21233 8.82737C3.28257 8.514 3.1583 8.07637 2.93138 7.84945L1.59148 6.50955C0.802662 5.72073 1.0566 4.92111 2.15878 4.73742L3.88228 4.45107C4.16863 4.40244 4.51442 4.14851 4.64408 3.88377L5.59499 1.98197C6.11366 0.950022 6.9565 0.950022 7.46977 1.98197Z" fill={color} stroke={color} stroke-width="1.08057" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};

export default StarSvg;