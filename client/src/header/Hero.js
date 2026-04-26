import React from 'react';
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

const Hero = () => {

  const navigate = useNavigate(); // ✅ INIT

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">

          <div className="text-center lg:w-2/3 w-full">

            <h1 className="title-font sm:text-5xl text-3xl mb-6 font-medium text-gray-900 text-center leading-tight">
              <span className="block mb-3">Manage Campus</span>
              <span className="block">
                Ambassadors <span className="text-[#1e2a97]">Smartly</span>
              </span>
            </h1>

            <p className="mb-8 leading-relaxed w-2/4 mx-auto">
              A modern, integrated platform to streamline task assignment, track performance, and enhance your student leadership experience.
            </p>

            <div className="flex justify-center mt-10">
              <div className="inline-flex p-4 bg-white rounded-2xl shadow-inner border border-gray-100/50">

                {/* JOIN AS AMBASSADOR */}
                <button
                  onClick={() => navigate("/auth")} // ✅ ADD THIS
                  className="
                    inline-flex items-center justify-center 
                    text-white bg-[#4f46e5] border-0 
                    py-3 px-8 
                    hover:bg-[#4338ca] 
                    rounded-xl 
                    font-bold text-sm tracking-wide uppercase 
                    transition-all duration-300 
                    shadow-md hover:shadow-indigo-500/50 hover:scale-105
                  "
                >
                  Join as Ambassador
                </button>

                {/* LOGIN AS ADMIN */}
                <button
                  onClick={() => navigate("/auth")} // ✅ SAME HERE
                  className="
                    ml-4 
                    inline-flex items-center justify-center 
                    text-[#4f46e5] bg-white border border-[#4f46e5] 
                    py-3 px-8 
                    hover:bg-[#4f46e5] hover:text-white 
                    rounded-xl 
                    font-bold text-sm tracking-wide uppercase 
                    transition-all duration-300 
                    shadow-sm hover:shadow-md
                  "
                >
                  Login as Admin
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;