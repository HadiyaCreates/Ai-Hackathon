import React from 'react';

const Footer = () => {
  const footerSections = [
    {
      title: "Program",
      links: ["Join as Ambassador", "Login as Admin", "How it Works", "Rewards", "Leaderboard"],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Blog", "GitHub"],
    },
    {
      title: "Resources",
      links: ["FAQ", "Best Practices", "Task Ideas", "Case Studies"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service"],
    },
  ];

  return (
    <footer className="bg-[#1e2a97] text-white py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-12 space-x-2">
          {/* Simple Shield Icon SVG to match image */}
          {/* <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg> */}
          <img src='/logo.png' className='w-[10rem] h-[5rem]'/>
          <span className="text-2xl font-bold tracking-wider uppercase">CampusPulse</span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-5 opacity-90">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 CampusPulse Inc. All rights reserved.</p>
          <p className="mt-1">Solapur, Maharashtra, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;