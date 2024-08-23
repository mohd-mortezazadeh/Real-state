import React, { FC } from 'react'

interface HeadPhonesProps {
    color: string;
    width: number;
    height: number;
  }
  

const HeadPhonesSvg:FC<HeadPhonesProps> = ({ color, width, height }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.95578 20.1676V16.9827C5.95578 15.9247 6.78473 14.9757 7.96271 14.9757C9.02071 14.9757 9.96964 15.8047 9.96964 16.9827V20.0476C9.96964 22.1745 8.20267 23.9415 6.07575 23.9415C3.94884 23.9415 2.18187 22.1636 2.18187 20.0476V13.3287C2.06189 7.19888 6.90471 2.23608 13.0346 2.23608C19.1644 2.23608 23.9964 7.19888 23.9964 13.2088V19.9276C23.9964 22.0545 22.2294 23.8215 20.1025 23.8215C17.9756 23.8215 16.2086 22.0545 16.2086 19.9276V16.8627C16.2086 15.8047 17.0375 14.8558 18.2155 14.8558C19.2735 14.8558 20.2224 15.6847 20.2224 16.8627V20.1676" stroke={color} stroke-width="2.54" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}

export default HeadPhonesSvg
