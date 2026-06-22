/**
 * @component Loader
 * @description A spinner/skeleton component to show during data fetching or loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type="spinner"] - Loader type: "spinner" | "skeleton" | "dots"
 * @param {string} [props.size="md"] - Loader size: "sm" | "md" | "lg"
 * @param {string} [props.color="blue"] - Color variant: "blue" | "green" | "gray"
 * @param {string} [props.text] - Optional loading text
 * @param {string} [props.className=""] - Additional CSS classes
 * 
 * @example
 * // Spinner loader
 * <Loader type="spinner" size="lg" />
 * 
 * @example
 * // Skeleton with text
 * <Loader type="skeleton" text="Loading data..." />
 */
export const Loader = ({
  type = "spinner",
  size = "md",
  color = "blue",
  text,
  className = "",
  ...props
}) => {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const colorStyles = {
    blue: "border-blue-500 border-t-transparent",
    green: "border-green-500 border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  };

  const containerClass = type === "skeleton" ? "space-y-3" : "flex flex-col items-center justify-center";

  if (type === "spinner") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`} {...props}>
        <div
          className={`${sizeMap[size]} border-4 ${colorStyles[color]} rounded-full animate-spin`}
        />
        {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className={`${containerClass} ${className}`} {...props}>
        <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse" />
        {text && <p className="text-gray-600 text-xs mt-2">{text}</p>}
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className={`flex items-center gap-1 ${className}`} {...props}>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
        {text && <span className="ml-2 text-gray-600 text-sm">{text}</span>}
      </div>
    );
  }

  return null;
};

export default Loader;
