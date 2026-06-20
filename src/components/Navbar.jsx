import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-green-600">🌾 CropAdv</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition">
              Dashboard
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">
              About
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-green-600 transition">
              Login
            </Link>
          </div>

          {/* Profile Icon */}
          <div className="hidden md:block">
            <button className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition">
              👤
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Home
            </Link>
            <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Dashboard
            </Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              About
            </Link>
            <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
