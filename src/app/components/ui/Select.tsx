import { ReactNode } from "react";

export const Select = ({
  name,
  value,
  onChange,
  required = false,
  options = [],
  children,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options?: { label: string; value: string }[];
  children?: ReactNode;
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border p-2 rounded w-full"
    >
      {options.length > 0
        ? options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
};
