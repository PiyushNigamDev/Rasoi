import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ChefHat, Lock, Mail, Store, User } from "lucide-react";

const VendorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/vendor/register", form);
      await Swal.fire({ icon: "success", title: "Vendor account created", text: "You can now sign in to manage your recipes", confirmButtonColor: "#f97316" });
      navigate("/vendor/login");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Registration failed", text: error.response?.data?.message || "Unable to create vendor account" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-orange-100/70">
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-8 text-center text-white"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20"><ChefHat size={32} /></div><h1 className="text-2xl font-bold">Register as Vendor</h1><p className="mt-1 text-sm text-orange-100">Start selling your dishes on Rasoi</p></div>
        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Business or full name</label><div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your kitchen name" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white" /></div></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="vendor@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white" /></div></div>
          <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="password" required minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white" /></div></div>
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 disabled:opacity-60">{loading ? "Creating account..." : <><Store size={18} />Create Vendor Account</>}</button>
        </form>
        <div className="border-t border-slate-100 px-8 py-4 text-center"><p className="text-xs text-slate-500">Already a vendor? <Link to="/vendor/login" className="font-semibold text-orange-500">Vendor Login</Link></p></div>
      </div>
    </div>
  );
};

export default VendorRegister;
