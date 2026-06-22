import { useState } from "react";
import { Button, Input, Modal, Toast, Loader } from "../../components/ui";

/**
 * Component Showcase Page
 * Demonstrates all 5 core components with their variants
 */
export default function ComponentShowcase() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const triggerToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(e.target.value.includes("@") ? "" : "Invalid email");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">Component Library</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">Showcase of all 5 core reusable components</p>

        {/* Button Component */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Button Component</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Primary - Default</p>
              <Button label="Submit" size="md" onClick={() => triggerToast("Submitted!", "success")} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Secondary</p>
              <Button label="Action" variant="secondary" onClick={() => triggerToast("Action triggered", "info")} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Outline</p>
              <Button label="Cancel" variant="outline" onClick={() => triggerToast("Cancelled", "warning")} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Danger</p>
              <Button label="Delete" variant="danger" onClick={() => triggerToast("Deleted", "error")} />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Small</p>
              <Button label="Small" size="sm" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Medium</p>
              <Button label="Medium" size="md" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Large</p>
              <Button label="Large" size="lg" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Disabled</p>
              <Button label="Disabled" disabled />
            </div>
          </div>
        </section>

        {/* Input Component */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Input Component</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Standard Inputs</p>
              <div className="space-y-4">
                <Input label="Full Name" placeholder="Enter your name" size="md" />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                />
                <Input label="Username" placeholder="Choose username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Variants</p>
              <div className="space-y-4">
                <Input label="Small Input" size="sm" placeholder="Small size" />
                <Input label="Large Input" size="lg" placeholder="Large size" />
                <Input label="Disabled" disabled placeholder="Cannot edit" />
                <Input label="Password" type="password" placeholder="Enter password" />
              </div>
            </div>
          </div>
        </section>

        {/* Modal Component */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Modal Component</h2>
          <div className="space-y-4">
            <Button label="Open Modal (Default)" onClick={() => setIsModalOpen(true)} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Click the button or press Escape to close</p>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Welcome to Modals" size="md">
            <p className="mb-4">This is a modal dialog component. It supports:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Closing on Escape key</li>
              <li>Backdrop click to close</li>
              <li>Custom footer with actions</li>
              <li>Multiple sizes (sm, md, lg)</li>
            </ul>
          </Modal>
        </section>

        {/* Toast Component */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Toast Component</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Button
              label="Success Toast"
              onClick={() => triggerToast("Operation completed!", "success")}
              variant="primary"
            />
            <Button
              label="Error Toast"
              onClick={() => triggerToast("Something went wrong!", "error")}
              variant="danger"
            />
            <Button
              label="Warning Toast"
              onClick={() => triggerToast("Please be careful!", "warning")}
              variant="outline"
            />
            <Button
              label="Info Toast"
              onClick={() => triggerToast("Here's some information", "info")}
              variant="secondary"
            />
          </div>
        </section>

        {/* Loader Component */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Loader Component</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Spinner Variants</p>
              <div className="space-y-6 flex flex-col items-center">
                <Loader type="spinner" size="sm" color="blue" />
                <Loader type="spinner" size="md" color="green" />
                <Loader type="spinner" size="lg" color="gray" text="Loading..." />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Skeleton Loader</p>
              <Loader type="skeleton" text="Loading content..." />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Dot Animation</p>
              <div className="flex items-center justify-center">
                <Loader type="dots" text="Processing..." />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast Display */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
          position="top-right"
        />
      )}
    </div>
  );
}
