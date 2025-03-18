import { ReactNode } from "react";
export const Button = ({ type = "button", children, onClick, className = "" }: {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};