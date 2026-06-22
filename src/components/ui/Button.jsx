/**
 * @component Button
 * @description A flexible, reusable button component with multiple variants, sizes, and states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Button text content
 * @param {Function} props.onClick - Click handler function
 * @param {string} [props.variant="primary"] - Button style variant: "primary" | "secondary" | "outline" | "danger"
 * @param {string} [props.size="md"] - Button size: "sm" | "md" | "lg"
 * @param {boolean} [props.disabled=false] - Disable button state
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {React.ReactNode} [props.icon] - Optional icon element
 * 
 * @example
 * // Primary button
 * <Button label="Submit" onClick={handleSubmit} />
 * 
 * @example
 * // Secondary button with icon
 * <Button label="Login" variant="secondary" size="lg" icon={<LoginIcon />} />
 */
export const Button = ({
  label,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
  ...props
}) => {
  const baseStyles = "font-semibold rounded transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer";

  const variantStyles = {
    primary: "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400",
    secondary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400",
    outline: "border-2 border-gray-400 text-gray-700 hover:bg-gray-100 disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const finalClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClass}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
