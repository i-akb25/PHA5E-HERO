import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#212121] text-white py-4 shadow-md fixed top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="#" aria-label="Homepage">
            <img src="/logo.svg" alt="PHA5E Logo" className="h-10 w-auto" />
          </a>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* Navbar Links */}
        <ul className={`md:flex space-x-10 text-md transition-all duration-300
          ${isOpen ? "block absolute top-full left-0 w-full bg-[#212121] p-4" : "hidden md:flex"}
        `}>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Our Vision</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Our Team</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Our Projects</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Contact Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
