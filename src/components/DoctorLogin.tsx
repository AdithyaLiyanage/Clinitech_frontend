import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import doc from "../assets/doc.jpg";

const DoctorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await login(email, password);
      navigate("/doctordashboard");
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Blue Background with Doctor Illustration */}
      <div className="w-1/2 bg-[#2146C7] relative overflow-hidden">
        <div className="absolute top-4 left-4 text-white font-bold text-lg">
          Clini<span className="font-normal">Tech</span>
        </div>
        <img src={doc} alt="Doctor" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#2146C7] mb-10 text-center">Welcome to Doctor Portal</h2>
          {errorMessage && <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-gray-100 rounded-md focus:outline-none text-sm"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-gray-100 rounded-md focus:outline-none text-sm"
              />
            </div>
            <div className="flex justify-between items-center text-sm mb-6">
              <label className="flex items-center space-x-2 text-gray-500">
                <input 
                  type="checkbox" 
                  checked={rememberPassword}
                  onChange={() => setRememberPassword(!rememberPassword)}
                  className="accent-[#2146C7]" 
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-[#2146C7] hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-[#2146C7] text-white py-3 rounded-full hover:bg-[#1D3CA6] transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
