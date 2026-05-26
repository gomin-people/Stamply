const OverlayCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="94" height="94" viewBox="0 0 94 94" fill="none">
    <g filter="url(#filter0_d_190_1723)">
      <circle cx="47" cy="47" r="18.5" stroke="white" shapeRendering="crispEdges"/>
    </g>
    <defs>
      <filter id="filter0_d_190_1723" x="0" y="0" width="94" height="94" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="8" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_190_1723"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_190_1723"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_190_1723" result="shape"/>
      </filter>
    </defs>
  </svg>
)

export default OverlayCircleIcon
