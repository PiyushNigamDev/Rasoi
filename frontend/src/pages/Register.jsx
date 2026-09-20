import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      triggerShake();
      return;
    }

    try {
      setIsLoading(true);

      const data = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await Swal.fire({
        title: "Success!",
        text: response.data?.message || "User registered successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#f97316",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);

      let message = "User registration failed";

      if (err.response) {
        // Server responded with error
        message =
          err.response.data?.message ||
          err.response.data?.error ||
          `Error: ${err.response.status}`;
      } else if (err.request) {
        // No response (backend down, CORS, or network error). Port 5000 only
        // applies locally; production uses the URL configured in Vercel.
        message = `Cannot reach the API at ${API_BASE_URL}. Please try again shortly.`;
      } else {
        message = err.message || "Something went wrong";
      }

      triggerShake();

      await Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-rose-200/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl" />
      </div>

      {/* Floating food */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float hidden sm:block">
        🍕
      </div>
      <div
        className="absolute top-40 right-16 text-3xl opacity-20 animate-float hidden sm:block"
        style={{ animationDelay: "0.8s" }}
      >
        🍔
      </div>
      <div
        className="absolute bottom-32 left-20 text-3xl opacity-20 animate-float hidden sm:block"
        style={{ animationDelay: "1.5s" }}
      >
        🌮
      </div>

      {/* Main */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center justify-center gap-2.5 mb-8 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              🍔
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                <span className="text-orange-500">Rasoi</span>
              </span>
              <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
                Fresh & Fast
              </span>
            </div>
          </Link>

          {/* Card */}
          <div
            className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-orange-100/50 border border-white/50 p-6 sm:p-8 transition-shadow duration-300 ${
              shake ? "animate-shake border-red-300 shadow-red-100" : ""
            }`}
          >
            {/* Heading */}
            <div className="text-center mb-7">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Create Account 🚀
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Join Rasoi and start ordering delicious food
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border-2 bg-white transition-all duration-300 ${
                    focusedField === "name"
                      ? "border-orange-400 shadow-lg shadow-orange-100"
                      : errors.name
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="pl-4 text-lg">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">⚠️ {errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border-2 bg-white transition-all duration-300 ${
                    focusedField === "email"
                      ? "border-orange-400 shadow-lg shadow-orange-100"
                      : errors.email
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="pl-4 text-lg">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">⚠️ {errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border-2 bg-white transition-all duration-300 ${
                    focusedField === "password"
                      ? "border-orange-400 shadow-lg shadow-orange-100"
                      : errors.password
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="pl-4 text-lg">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password"
                    className="w-full px-3 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    ⚠️ {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div
                  className={`relative flex items-center rounded-2xl border-2 bg-white transition-all duration-300 ${
                    focusedField === "confirmPassword"
                      ? "border-orange-400 shadow-lg shadow-orange-100"
                      : errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="pl-4 text-lg">🔐</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    className="w-full px-3 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="pr-4 text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    ⚠️ {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-orange-500 hover:underline">
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-500 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl font-semibold text-white
                  bg-gradient-to-r from-orange-500 to-rose-500
                  shadow-lg shadow-orange-500/30
                  hover:shadow-orange-500/50 hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                  transition-all duration-300"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">
                  or sign up with
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 bg-white font-medium text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span className="text-lg">🔴</span>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 bg-white font-medium text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span className="text-lg">📘</span>
                Facebook
              </button>
            </div>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(5deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Register;
