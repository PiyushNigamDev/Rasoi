import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ChefHat, Eye, EyeOff, Lock, Mail, Store } from "lucide-react";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/vendor/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.vendor));
      localStorage.setItem("role", "vendor");
      await Swal.fire({ icon: "success", title: "Welcome Vendor", text: "Login successful", timer: 1300, showConfirmButton: false });
      navigate("/admin/dashboard");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Login failed", text: error.response?.data?.message || "Invalid vendor email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-orange-100/70">
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20"><ChefHat size={32} /></div>
          <h1 className="text-2xl font-bold">Vendor Login</h1>
          <p className="mt-1 text-sm text-orange-100">Manage your Rasoi menu</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Vendor email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vendor@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white" /></div></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none focus:border-orange-500 focus:bg-white" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 disabled:opacity-60">{loading ? "Signing in..." : <><Store size={18} />Login as Vendor</>}</button>
        </form>
        <div className="border-t border-slate-100 px-8 py-4 text-center"><p className="text-xs text-slate-500">New vendor? <Link to="/vendor/register" className="font-semibold text-orange-500">Register here</Link></p></div>
      </div>
    </div>
  );
};

export default VendorLogin;
