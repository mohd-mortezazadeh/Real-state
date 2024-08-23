
const StepBar2of3Svg = () => {
    return (
        <svg width="296" height="44" viewBox="0 0 296 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="288.75" y1="18.25" x2="10.25" y2="18.25" stroke="url(#paint0_radial_52_6431)" stroke-width="0.5" stroke-linecap="round"/>
            <g filter="url(#filter0_d_52_6431)">
                <circle cx="148" cy="18" r="14" fill="url(#paint1_linear_52_6431)"/>
            </g>
            <circle cx="289" cy="18" r="7" fill="#005ADC"/>
            <circle cx="7" cy="18" r="7" fill="#AACEFF"/>
            <defs>
                <filter id="filter0_d_52_6431" x="126" y="0" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="4"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.101961 0 0 0 0 0.466667 0 0 0 0 0.952941 0 0 0 0.17 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_52_6431"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_52_6431" result="shape"/>
                </filter>
                <radialGradient id="paint0_radial_52_6431" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 17.9997) rotate(-180) scale(134 32968.8)">
                    <stop stop-color="#1D78F3"/>
                    <stop offset="1" stop-color="#AACEFF" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="paint1_linear_52_6431" x1="158.5" y1="10.8293" x2="137.026" y2="20.9907" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1A77F3"/>
                    <stop offset="1" stop-color="#76B1FF"/>
                </linearGradient>
            </defs>
        </svg>

    );
};

export default StepBar2of3Svg;