import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`
        bg-[#111827]
        border border-white/10
        rounded-3xl
        p-6
        backdrop-blur-xl
        
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
