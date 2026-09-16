// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Users,
  ChefHat,
  LogOut,
  Menu,
  X,
  Pizza,
  Coffee,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  CakeSlice,
  Salad,
  CupSoda,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem("admin") || "null") || {};
    } catch {
      return {};
    }
  })();
  const adminName = admin.name || "Admin";
  const adminEmail = admin.email || "admin@rasoi.com";
  const profileRole = admin.role === "vendor" ? "Vendor" : "Administrator";
  const adminInitials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Recipes", icon: Utensils, path: "/admin/recipes" },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
  ];

  const categories = [
    { name: "Fast Food", icon: Pizza, path: "/admin/fastfood" },
    { name: "Breakfast", icon: Coffee, path: "/admin/breakfast" },
    { name: "Lunch", icon: Sun, path: "/admin/lunch" },
    { name: "Dinner", icon: Moon, path: "/admin/dinner" },
    { name: "Dessert", icon: CakeSlice, path: "/admin/dessert" },
    { name: "Diet Food", icon: Salad, path: "/admin/dietfood" },
    { name: "Drinks", icon: CupSoda, path: "/admin/drink" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===================== FIXED SIDEBAR ===================== */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-slate-950 text-white transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Rasoi</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex h-[calc(100%-5rem)] flex-col overflow-y-auto px-4 py-6">
          
          {/* Main Menu */}
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive(item.path)
                    ? "bg-orange-500 font-medium text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            ))}
          </div>

          {/* Categories */}
          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Categories
          </p>

          <div className="space-y-1">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive(item.path)
                    ? "bg-orange-500 font-medium text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="mt-auto pt-6">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="lg:ml-72">
        
        {/* Top Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
              >
                <Menu size={22} className="text-slate-700 dark:text-white" />
              </button>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Admin Panel
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {darkMode ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-slate-600" />
                )}
              </button>

              <button className="relative rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700">
                <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="relative ml-2">
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Open admin profile"
                  aria-expanded={profileOpen}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                    {adminInitials || "A"}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-32 truncate text-sm font-semibold text-slate-800 dark:text-white">{adminName}</span>
                    <span className="block max-w-32 truncate text-xs text-slate-500 dark:text-slate-400">{adminEmail}</span>
                  </span>
                  <ChevronDown size={16} className="hidden text-slate-500 sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b border-slate-100 px-2 pb-3 dark:border-slate-700">
                      <p className="font-semibold text-slate-900 dark:text-white">{adminName}</p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{adminEmail}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-orange-500">{profileRole}</p>
                    </div>
                    <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10">
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - This is where category pages will show */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;