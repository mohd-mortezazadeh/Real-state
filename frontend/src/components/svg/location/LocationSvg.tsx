import { NextPage } from "next";
import React from "react";
import { number } from "yup";

interface LocationSvgProps{
  width?:number,
  height?:number,
  color?:string
}
const LocationSvg: NextPage<LocationSvgProps> = ({width=20,height=19,color="#005adc"}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.16545 10.4307C10.402 10.4307 11.4044 9.42831 11.4044 8.19175C11.4044 6.95519 10.402 5.95276 9.16545 5.95276C7.92888 5.95276 6.92645 6.95519 6.92645 8.19175C6.92645 9.42831 7.92888 10.4307 9.16545 10.4307Z"
        stroke={color}
        stroke-width="1.23022"
      />
      <path
        d="M3.15175 6.88567C4.56547 0.671025 13.7726 0.678201 15.1792 6.89284C16.0044 10.5384 13.7367 13.6242 11.7489 15.5331C10.3065 16.9253 8.02443 16.9253 6.57482 15.5331C4.59418 13.6242 2.32648 10.5312 3.15175 6.88567Z"
        stroke="#005ADC"
        stroke-width="1.23022"
      />
    </svg>
  );
};

export default LocationSvg;
