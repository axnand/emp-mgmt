"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext"; 
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const defaultUsers = [
  { role: "admin", userId: "admin", password: "admin123" },
  { role: "schoolAdmin", userId: "schoolAdmin", password: "school123", schoolId: "101" },
  { role: "staff", userId: "staff", password: "staff123" },
];

export default function LoginPage() {
  const [userType, setUserType] = useState("admin");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  const { setUser, setUserRole } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = defaultUsers.find(
      (u) =>
        u.role === userType &&
        u.userId === userId.trim() &&
        u.password === password
    );

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setUserRole(user.role);

      router.push("/home/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex relative flex-col md:flex-row">
      
      {/* Left Section */}
      <div className="hidden md:flex flex-1 shadow-xl text-[#377dff] flex-col justify-center items-center p-8">
      
        <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-[30rem] h-[15rem]"/>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6 text-sm">
            <p>
              <strong>Note:</strong> This is just the early frontend prototype of the <strong>Employee Management System</strong> created for <strong>Chief Education Office Kashmir</strong> for their employee management. 
              the full backend and other features are not shown due to privacy reasons.
            </p>
            <p className="mt-2">
              Below are the login credentials to test this prototype:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li><code>Admin: User ID: admin | Password: admin123</code></li>
              <li><code>School Admin: User ID: schoolAdmin | Password: school123</code></li>
              <li><code>Staff: User ID: staff | Password: staff123</code></li>
            </ul>

          </div>
        <p className="absolute bottom-5 font-medium text-gray-700 text-[13px] opacity-75">
          © 2025 CEO Doda. Created by Anand Mohan Jha
        </p>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 bg-gradient-to-br from-[#377dff] to-[#4d86f0] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[26rem]">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter your credentials to access your account
          </p>

          

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="space-y-4 text-sm">
              {/* User Type Dropdown */}
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full border-gray-300 border rounded-md p-2 mt-1"
                >
                  <option value="admin">Admin</option>
                  <option value="schoolAdmin">School Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* User ID */}
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full border-gray-300 border rounded-md p-2 mt-1"
                  required
                />
              </div>

              {/* Password with Show/Hide Button */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-gray-300 border rounded-md p-2 mt-1 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-6 py-2 bg-blue-500 transition text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Login Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
