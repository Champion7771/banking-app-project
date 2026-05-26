interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ type = "text", placeholder, value, onChange }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full
        bg-[#111827]
        border border-white/10
        rounded-2xl
        px-5 py-4
        outline-none
        focus:border-emerald-400
        transition
        text-white
        placeholder:text-zinc-500
      "
    />
  );
};

export default Input;
