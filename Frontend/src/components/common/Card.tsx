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
        bg-white rounded-lg shadow-md p-6 transition-shadow
        ${hoverable ? "hover:shadow-lg" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
