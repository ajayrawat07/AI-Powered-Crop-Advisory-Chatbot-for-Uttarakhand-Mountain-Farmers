import React, { useState, useEffect } from "react";

/**
 * @component Toast
 * @description A notification component that appears briefly and dismisses automatically. Use a context or hook for global toast management.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message text
 * @param {string} [props.type="info"] - Toast type: "success" | "error" | "warning" | "info"
 * @param {number} [props.duration=3000] - Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
 * @param {Function} [props.onClose] - Callback when toast dismisses
 * @param {string} [props.position="top-right"] - Position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
 * 
 * @example
 * // Success toast
 * <Toast message="Profile updated successfully!" type="success" />
 * 
 * @example
 * // Error toast with manual dismiss
 * <Toast message="Failed to save changes" type="error" duration={5000} onClose={handleClose} />
 */
export const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
  position = "top-right",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const positionStyles = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${typeStyles[type]} animate-fadeIn`}
      {...props}
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-2 text-lg hover:opacity-75 leading-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
