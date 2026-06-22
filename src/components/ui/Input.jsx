/**
 * @component Input
 * @description A reusable input field component with label, placeholder, error display, and multiple input types.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Input label text
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.type="text"] - Input type: "text" | "email" | "password" | "number" | "date"
 * @param {string} [props.value] - Current input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.disabled=false] - Disable input
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {string} [props.size="md"] - Input size: "sm" | "md" | "lg"
 * 
 * @example
 * // Basic email input
 * <Input label="Email" type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
 * 
 * @example
 * // Input with error
 * <Input label="Username" value={username} error="Username is required" onChange={handleChange} />
 */
export const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
  className = "",
  size = "md",
  ...props
}) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const inputClass = `w-full border rounded transition-all duration-200 
    bg-white dark:bg-gray-700 
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    ${
      error 
        ? "border-red-500 dark:border-red-400 focus:ring-red-200 dark:focus:ring-red-900" 
        : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-900"
    } 
    focus:outline-none focus:ring-2 
    ${sizeStyles[size]} 
    ${disabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-60" : ""} 
    ${className}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClass}
        {...props}
      />
      {error && <span className="text-xs text-red-500 dark:text-red-400 font-medium">{error}</span>}
    </div>
  );
};

export default Input;
