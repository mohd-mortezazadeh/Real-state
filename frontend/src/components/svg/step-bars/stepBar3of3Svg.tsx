import React from 'react';

const StepBar3Of3Svg = () => {
    return (
        <svg width="300" height="44" viewBox="0 0 300 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="298.764" y1="18.25" x2="24.0338" y2="18.25" stroke="url(#paint0_radial_141_2595)" stroke-width="0.5" stroke-linecap="round"/>
            <g filter="url(#filter0_d_141_2595)">
                <ellipse cx="21.8108" cy="18" rx="13.8108" ry="14" fill="url(#paint1_linear_141_2595)"/>
            </g>
            <ellipse cx="293.095" cy="18" rx="6.90541" ry="7" fill="#005ADC"/>
            <ellipse cx="160.905" cy="18" rx="6.9054" ry="7" fill="#005ADC"/>
            <defs>
                <filter id="filter0_d_141_2595" x="0" y="0" width="43.6216" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="4"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.101961 0 0 0 0 0.466667 0 0 0 0 0.952941 0 0 0 0.17 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_141_2595"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_141_2595" result="shape"/>
                </filter>
                <radialGradient id="paint0_radial_141_2595" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(19.3446 18) scale(267.831 66798.7)">
                    <stop stop-color="#1D78F3"/>
                    <stop offset="1" stop-color="#AACEFF" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="paint1_linear_141_2595" x1="21.8108" y1="4" x2="21.8108" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1A77F3"/>
                    <stop offset="1" stop-color="#76B1FF"/>
                </linearGradient>
            </defs>
        </svg>

    );
};

export default StepBar3Of3Svg;