import { SVGProps } from "react";

const IconDashedCircle = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconDashedCircle;
