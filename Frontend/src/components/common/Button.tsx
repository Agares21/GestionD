import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2";

    const variantStyles = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
      danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
      success:
        "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const finalClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className} ${
      disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
    }`;

    return (
      <button
        ref={ref}
        className={finalClass}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
