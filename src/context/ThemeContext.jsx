import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * ThemeContext
 * Provides theme state (light/dark) and toggle functionality throughout the app
 * Theme preference is persisted in localStorage
 */
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from query param or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");
    const savedTheme = themeParam === "dark" || themeParam === "light"
      ? themeParam
      : (localStorage.getItem("theme") || "light");
    setTheme(savedTheme);
    setIsMounted(true);
    applyTheme(savedTheme);
  }, []);

  // Apply theme to document
  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Prevent flashing by only rendering visibility: hidden until mounted
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={isMounted ? {} : { visibility: "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Use this hook in any component to access theme state and toggle function
 * @example const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export default ThemeProvider;
