import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        
        px-6 py-3 rounded-2xl
        font-semibold
        transition-all duration-300
        
        ${
          variant === "primary"
            ? "bg-emerald-500 hover:bg-emerald-600 text-black"
            : "border border-white/10 hover:border-emerald-400 text-white"
        }

        ${disabled ? "opacity-50 cursor-not-allowed" : ""}

        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
