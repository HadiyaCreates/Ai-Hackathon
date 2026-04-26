// import { useState } from "react";
// import { useNavigate } from "react-router-dom";   // ✅ FIX
// import Swal from "sweetalert2";                  // ✅ FIX

// export default function AuthPage() {
//   const [role, setRole] = useState("ambassador");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:8000/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           name,
//           role,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: data.message || "Something went wrong",
//         });
//         return;
//       }

//       // ✅ SUCCESS ALERT
// Swal.fire({
//   title: "Account Created!",
//   text: "Welcome to CampusPulse 🎉",
//   icon: "success",
//   draggable: true,
//   confirmButtonColor: "#4f46e5",
// }).then(() => {

//   // ✅ STORE CORRECT USER FROM BACKEND
//   localStorage.setItem("user", JSON.stringify(data.user));

//   // 🔀 REDIRECT BASED ON BACKEND ROLE (NOT FRONTEND)
//   if (data.user.role === "admin") {
//     navigate("/admin");
//   } else {
//     navigate("/ambassador");
//   }
// });

//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Server Error",
//         text: error.message,
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 hover:shadow-2xl transition">

//         {/* LEFT */}
//         <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col justify-center items-center p-10">
//           <div className="bg-white text-gray-800 rounded-xl p-6 shadow-lg text-center hover:scale-105 transition">
//             <h1 className="text-3xl font-bold">
//               Manage Campus <br />
//               Ambassadors <span className="text-indigo-600">Smartly.</span>
//             </h1>
//           </div>

//           <p className="mt-6 text-sm text-gray-200 text-center">
//             Access your dedicated dashboard <br />
//             based on your role.
//           </p>
//         </div>

//         {/* RIGHT */}
//         <div className="p-10">
//           <h2 className="text-2xl font-bold mb-6">Create an Account</h2>

//           {/* Toggle */}
//           <div className="flex mb-6 bg-gray-100 rounded-full p-1 shadow-inner">
//             <button
//               type="button"
//               onClick={() => setRole("ambassador")}
//               className={`flex-1 py-2 rounded-full ${
//                 role === "ambassador"
//                   ? "bg-indigo-600 text-white"
//                   : "text-gray-600"
//               }`}
//             >
//               I am an Ambassador
//             </button>

//             <button
//               type="button"
//               onClick={() => setRole("admin")}
//               className={`flex-1 py-2 rounded-full ${
//                 role === "admin"
//                   ? "bg-indigo-600 text-white"
//                   : "text-gray-600"
//               }`}
//             >
//               I am an Admin
//             </button>
//           </div>

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email Address"
//               className="w-full px-4 py-3 rounded-lg bg-gray-100"
//               required
//             />

//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               className="w-full px-4 py-3 rounded-lg bg-gray-100"
//               required
//             />

//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Full Name"
//               className="w-full px-4 py-3 rounded-lg bg-gray-100"
//               required
//             />

//             <button className="w-full py-3 bg-indigo-600 text-white rounded-full hover:shadow-xl transition">
//               CREATE ACCOUNT
//             </button>
         
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AuthPage() {
  const [role, setRole] = useState("ambassador");
  const [isLogin, setIsLogin] = useState(false); // 🔥 NEW

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:8000/api/auth/login"
        : "http://localhost:8000/api/auth/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.message || "Something went wrong", "error");
        return;
      }

      Swal.fire({
        title: isLogin ? "Welcome Back 🎉" : "Account Created 🎉",
        icon: "success",
        confirmButtonColor: "#4f46e5",
      }).then(() => {
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ SAME REDIRECT FOR LOGIN + SIGNUP
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/ambassador");
        }
      });

    } catch (error) {
      Swal.fire("Server Error", error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-3xl font-bold text-center">
            Manage Campus <br />
            Ambassadors <span className="text-yellow-300">Smartly</span>
          </h1>

          <p className="mt-6 text-sm text-gray-200 text-center">
            Access your dashboard based on your role
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-10">
          <h2 className="text-2xl font-bold mb-6">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          {/* LOGIN / SIGNUP TOGGLE */}
          <p className="mb-4 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              className="text-indigo-600 cursor-pointer ml-2"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>

          {/* ROLE TOGGLE */}
          <div className="flex mb-6 bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setRole("ambassador")}
              className={`flex-1 py-2 rounded-full ${
                role === "ambassador"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Ambassador
            </button>

            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-full ${
                role === "admin"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Admin
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100"
              required
            />

            <button className="w-full py-3 bg-indigo-600 text-white rounded-full">
              {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}