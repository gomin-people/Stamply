import { type ComponentProps } from "react";
import { cn } from "@/utils";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "outline" | "ghost" | "kakao";
};

const variantStyles = {
  primary: "bg-gomin-primary-700 text-white",
  outline: "border border-gomin-primary-700 text-gomin-primary-700",
  ghost: "text-gomin-primary-700",
  kakao: "bg-yellow-400 text-black",
};
const Button = ({
  children,
  variant = "primary",
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
