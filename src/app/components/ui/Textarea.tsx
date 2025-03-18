export const Textarea = ({ name, value, onChange, placeholder = "", required = false }: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
  }) => {
    return (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="border p-2 rounded w-full"
      />
    );
  };