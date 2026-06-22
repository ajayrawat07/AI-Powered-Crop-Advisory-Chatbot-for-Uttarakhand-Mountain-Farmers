import React, { useEffect, useRef } from "react";

/**
 * @component Modal
 * @description A reusable modal/dialog component with title, content, and action buttons. Must trap focus and close on Escape key.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal should close
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Optional footer with action buttons
 * @param {boolean} [props.closeable=true] - Show close button
 * @param {string} [props.size="md"] - Modal size: "sm" | "md" | "lg"
 * 
 * @example
 * // Basic modal with close button
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * 
 * @example
 * // Modal with footer actions
 * <Modal isOpen={isOpen} onClose={handleClose} title="Delete Item" footer={
 *   <>
 *     <Button label="Cancel" onClick={handleClose} />
 *     <Button label="Delete" variant="danger" onClick={handleDelete} />
 *   </>
 * }>
 *   This action cannot be undone.
 * </Modal>
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeable = true,
  size = "md",
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape" && closeable) {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, closeable]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeable ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        tabIndex="-1"
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${sizeStyles[size]} w-full max-h-screen overflow-y-auto transition-colors duration-300 focus:outline-none`} 
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
          {closeable && (
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-gray-700 dark:text-gray-300 mb-6">{children}</div>

        {/* Footer */}
        {footer && <div className="flex gap-3 justify-end border-t dark:border-gray-700 pt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
