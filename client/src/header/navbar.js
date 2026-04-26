

import React from 'react';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="antialiased">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => navigate("/")}
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0 cursor-pointer group"
          >
            <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
              <img 
                src='/logo.png' 
                className='w-[5.5rem] md:w-[6.5rem] h-auto object-contain drop-shadow-sm' 
                alt="CampusPulse Logo"
              />
              <span className="text-xl md:text-2xl font-black tracking-tighter ml-1 flex items-center">
                <span className="text-[#1e2a97]">CAMPUS</span>
                <span className="text-[#374151]">PULSE</span>
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="md:ml-auto md:mr-8 flex items-center text-[15px] font-semibold">

            {/* ✅ LOGIN BUTTON */}
            <button
              onClick={() => navigate("/auth")}
              className="mr-8 relative text-gray-600 transition-colors duration-300 hover:text-[#1e2a97] group"
            >
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1e2a97] transition-all duration-300 group-hover:w-full"></span>
            </button>

          </nav>

        </div>
      </header>

      {/* Spacer */}
      <div className="h-24"></div>
    </div>
  );
}

export default Navbar;