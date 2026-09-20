import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ChefHat, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please enter email and password",
      });
    }

    try {
      setLoading(true);

      const res = await axios.post("https://rasoi-backend1.onrender.com/api/admin/login", {
        email,
        password,
      });

      const token = res.data.token || res.data.data?.token;
      const admin = res.data.admin || res.data.user || res.data.data;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin || { email }));
      localStorage.setItem("role", "admin");

      Swal.fire({
        icon: "success",
        title: "Welcome Admin",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          err.response?.data?.message ||
          err.message ||
          "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white
    
    px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl  

        border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
          {/* Header */}
          <div className="border-b border-orange-100 bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
              <ChefHat size={32} />
            </div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="mt-1 text-sm text-orange-100">
              Rasoi Control Panel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rasoi.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Login as Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="border-t border-slate-100 px-8 py-4 text-center">
            <p className="text-xs text-slate-500">
              Not an admin?{" "}
              <Link
                to="/login"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                Customer Login
              </Link>
              {" | "}
              <Link
                to="/vendor/login"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                Vendor Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Protected area • Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
