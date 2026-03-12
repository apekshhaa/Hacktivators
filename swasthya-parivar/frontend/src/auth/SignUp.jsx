import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Baymax from "../../components/user/Baymax";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B2525] p-4 font-sans">
      <div className="bg-[#164040] w-full max-w-[420px] p-10 rounded-[2rem] shadow-2xl relative border border-white/10">

        {/* Baymax Animation */}
        <Baymax />

        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-tight">
          Create Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-5 py-4 bg-[#0B2525] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#D1F072] transition-colors"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <select
              className="w-full px-5 py-4 bg-[#0B2525] border border-white/10 rounded-xl text-white/70 focus:outline-none focus:border-[#D1F072] transition-colors appearance-none"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user" className="bg-[#0B2525]">User / Patient</option>
              <option value="admin" className="bg-[#0B2525]">Healthcare Worker / Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 bg-[#0B2525] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#D1F072] transition-colors"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 bg-[#0B2525] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#D1F072] transition-colors"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#D1F072] text-[#0B2525] py-4 rounded-xl font-bold text-lg hover:bg-[#c1e062] hover:-translate-y-0.5 transition-all shadow-lg active:scale-95 mt-2"
          >
            Get Started
          </button>
        </form>

        <p className="mt-8 text-center text-white/50 text-sm">
          Already have an account?{" "}
          <span
            className="text-[#D1F072] font-semibold cursor-pointer hover:underline ml-1"
            onClick={() => navigate("/")}
          >
            Login here
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;
