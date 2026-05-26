import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
}) => {
  return (
    <div
      className={`
        rounded-lg border border-gray-200/80 bg-white/95 p-6 shadow-sm ring-1 ring-white/60 transition-all
        ${hoverable ? "hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
