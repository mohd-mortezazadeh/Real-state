import React from "react";

interface ArrowLeftSvgProps {
  color: string;
  width: number;
  height: number;
}

const ArrowLeftSvg = ({ color, width, height }: ArrowLeftSvgProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.9998 20.7677L8.47984 14.2477C7.70984 13.4777 7.70984 12.2177 8.47984 11.4477L14.9998 4.92773"
        stroke={color}
        stroke-width="2"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ArrowLeftSvg;
