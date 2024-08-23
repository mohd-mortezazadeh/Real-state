import React,{FC} from 'react'

const RedMark:FC = () => {
  return (
    <svg width="68" height="78" viewBox="0 0 68 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_584_30568)">
        <rect x="30" y="26" width="8" height="18" rx="4" fill="#FA3737"/>
        </g>
        <defs>
        <filter id="filter0_d_584_30568" x="0" y="0" width="68" height="78" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="15"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.148273 0 0 0 0 0.329167 0 0 0 0.11 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_584_30568"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_584_30568" result="shape"/>
        </filter>
        </defs>
    </svg>

  )
}

export default RedMark
