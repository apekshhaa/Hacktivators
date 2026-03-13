import React, { useState } from "react";
import { auth, googleProvider } from "../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import heartBeatVideo from "../../assets/heart_beat.webm";

import Baymax from "../../components/user/Baymax";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user"); // user | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User specific state
  const [householdId, setHouseholdId] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [error, setError] = useState("");

  const handlePostLogin = () => {
    if (role === "user") {
      navigate("/home");
    } else {
      navigate("/admin-home");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handlePostLogin();
    } catch (err) {
      setError("Admin login failed: " + err.message);
    }
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          identifier: householdId,
          password: userPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userHouseholdId', data.householdId);
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/admin-home");
    } catch {
      setError("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] p-4 font-sans text-white relative overflow-hidden">
      
      {/* Main Login Card */}
      <div className="bg-white/5 backdrop-blur-xl w-full max-w-[420px] p-10 rounded-[2rem] shadow-2xl relative border border-white/10 z-10">

        {/* Role Selection Tabs */}
        <div className="flex gap-2 mb-8 bg-black/20 p-1.5 rounded-full border border-white/5">
          <button
            onClick={() => { setRole("user"); setError(""); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
              ${role === "user"
                ? "bg-accent text-[#0a0a1a] shadow-lg shadow-accent/20"
                : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            User
          </button>
          <button
            onClick={() => { setRole("admin"); setError(""); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
              ${role === "admin"
                ? "bg-accent text-[#0a0a1a] shadow-lg shadow-accent/20"
                : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            Admin / Worker
          </button>
        </div>

        {/* Baymax Animation */}
        <div className="mb-6 flex justify-center drop-shadow-[0_0_15px_rgba(209,240,114,0.3)]">
            <Baymax />
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          {role === 'user' ? 'Household Login' : 'Admin Portal'}
        </h2>
        <p className="text-center text-gray-400 text-sm mb-8">
          Welcome to Swasthya Parivar
        </p>

        {role === 'user' ? (
          /* USER LOGIN FORM */
          <form onSubmit={handleUserLogin} className="space-y-5">
            <div className="space-y-2">
              <input
                id="field-hid-secure"
                name="field-hid-secure"
                type="text"
                placeholder="Household ID (Ex: HH-1234)"
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/5 transition-all"
                value={householdId}
                onChange={(e) => setHouseholdId(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <input
                id="field-hpass-secure"
                name="field-hpass-secure"
                type="password"
                placeholder="Access Password"
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/5 transition-all"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

            <button
              type="submit"
              className="w-full bg-accent text-[#0a0a1a] py-4 rounded-xl font-bold text-lg hover:bg-accent/90 hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(209,240,114,0.2)] active:scale-95 mt-2"
            >
              Enter Dashboard
            </button>
          </form>
        ) : (
          /* ADMIN LOGIN FORM */
          <div className="space-y-5">
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  placeholder="Worker Email"
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/5 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/5 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

              <button
                type="submit"
                className="w-full bg-accent text-[#0a0a1a] py-4 rounded-xl font-bold text-lg hover:bg-accent/90 hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(209,240,114,0.2)] active:scale-95 mt-2"
              >
                Admin Login
              </button>
            </form>

            <div className="relative my-8 text-center pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 text-gray-500 text-sm bg-transparent backdrop-blur-md">or</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 rounded-xl text-white hover:bg-white/10 transition-all font-medium"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5 shadow-sm"
                alt="Google"
              />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-gray-500 text-sm">
              New worker?{" "}
              <span
                className="text-accent font-semibold cursor-pointer hover:underline ml-1"
                onClick={() => navigate("/signup")}
              >
                Register here
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
