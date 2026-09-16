import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Utensils,
    ShoppingBag,
    Users,
    IndianRupee,
    Plus,
    Menu,
    X,
    ChefHat,
    LogOut,
    Bell,
    Search,
    MoreVertical,
    ArrowUpRight,
    PackageCheck,
    Truck,
    CircleAlert,
    Coffee,
    Sun,
    Moon,
    Pizza,
    SunMoon          // for theme toggle
} from "lucide-react" ;         

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Load theme from localStorage on first render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // Toggle Dark / Light Mode
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

    const stats = [
        {
            title: "Total Revenue",
            value: "₹84,560",
            change: "+12.5%",
            icon: IndianRupee,
            description: "vs last month"
        },
        {
            title: "Total Orders",
            value: "1,248",
            change: "+8.2%",
            icon: ShoppingBag,
            description: "vs last month"
        },
        {
            title: "Total Recipes",
            value: "86",
            change: "+5.4%",
            icon: Utensils,
            description: "new this month"
        },
        {
            title: "Customers",
            value: "3,642",
            change: "+10.8%",
            icon: Users,
            description: "vs last month"
        }
    ];

    const orders = [
        {
            id: "#ORD-1024",
            customer: "Rahul Sharma",
            item: "Paneer Butter Masala",
            amount: "₹450",
            status: "Delivered"
        },
        {
            id: "#ORD-1023",
            customer: "Anjali Verma",
            item: "Chicken Biryani",
            amount: "₹620",
            status: "Preparing"
        },
        {
            id: "#ORD-1022",
            customer: "Aman Gupta",
            item: "Masala Dosa",
            amount: "₹280",
            status: "Out for Delivery"
        },
        {
            id: "#ORD-1021",
            customer: "Priya Singh",
            item: "Veg Thali",
            amount: "₹350",
            status: "Pending"
        },
        {
            id: "#ORD-1020",
            customer: "Rohit Kumar",
            item: "Butter Chicken",
            amount: "₹580",
            status: "Delivered"
        }
    ];

    const popularRecipes = [
        {
            name: "Paneer Butter Masala",
            category: "North Indian",
            price: "₹250",
            orders: 124,
            image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500"
        },
        {
            name: "Chicken Biryani",
            category: "Biryani",
            price: "₹320",
            orders: 108,
            image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500"
        },
        {
            name: "Masala Dosa",
            category: "South Indian",
            price: "₹150",
            orders: 92,
            image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500"
        }
    ];

    const mealCategories = [
        {
            name: "Fast Food",
            items: 24,
            icon: Pizza,
            color: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
            hover: "hover:border-red-200 dark:hover:border-red-500/40"
        },
        {
            name: "Breakfast",
            items: 18,
            icon: Coffee,
            color: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
            hover: "hover:border-amber-200 dark:hover:border-amber-500/40"
        },
        {
            name: "Lunch",
            items: 32,
            icon: Sun,
            color: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
            hover: "hover:border-orange-200 dark:hover:border-orange-500/40"
        },
        {
            name: "Dinner",
            items: 27,
            icon: Moon,
            color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
            hover: "hover:border-indigo-200 dark:hover:border-indigo-500/40"
        }
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
            case "Preparing":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
            case "Out for Delivery":
                return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
            case "Pending":
                return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-72
                bg-slate-950 text-white transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/30">
                            <ChefHat size={25} />
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
                <nav className="px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Main Menu
                    </p>

                    <div className="space-y-1">
                        <a href="#" className="flex items-center gap-3 rounded-xl bg-orange-500 px-4 py-3 font-medium shadow-lg shadow-orange-500/20">
                            <LayoutDashboard size={20} />
                            Dashboard
                        </a>

                        <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Utensils size={20} />
                            Recipes
                        </a>

                        <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <ShoppingBag size={20} />
                            Orders
                        </a>

                        <a href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Users size={20} />
                            Customers
                        </a>
                    </div>

                    <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Categories
                    </p>

                    <div className="space-y-1">
                        <a href="/admin/fastfood" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Pizza size={20} />
                            Fast Food
                        </a>
                        <a href="/breakfast" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Coffee size={20} />
                            Breakfast
                        </a>
                        <a href="/lunch" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Sun size={20} />
                            Lunch
                        </a>
                        <a href="/dinner" className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                            <Moon size={20} />
                            Dinner
                        </a>
                    </div>
                </nav>

                {/* Logout */}
                <div className="absolute bottom-5 left-4 right-4">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72">
                {/* Header */}
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 transition-colors">
                    <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden"
                            >
                                <Menu size={24} className="text-slate-700 dark:text-slate-200" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
                                <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
                                    Welcome back, Admin 👋
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden items-center rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-2 md:flex">
                                <Search size={18} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-32 bg-transparent px-2 text-sm outline-none text-slate-700 dark:text-slate-200"
                                />
                            </div>

                            {/* Dark / Light Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-700"
                                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {darkMode ? (
                                    <Sun size={21} className="text-yellow-400" />
                                ) : (
                                    <Moon size={21} className="text-slate-600" />
                                )}
                            </button>

                            {/* Notification */}
                            <button className="relative rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Bell size={21} className="text-slate-600 dark:text-slate-300" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                            </button>

                            {/* Profile */}
                            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-600 pl-3">
                                <div className="hidden text-right sm:block">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">Admin</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Body */}
                <div className="p-4 sm:p-6 lg:p-8">

                    {/* Welcome Banner */}
                    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white shadow-xl shadow-orange-500/20 sm:p-8">
                        <div className="relative z-10 max-w-xl">
                            <p className="mb-2 text-sm font-medium text-orange-100">ADMIN OVERVIEW</p>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Manage your kitchen with ease 🍽️
                            </h1>
                            <p className="mt-2 text-sm text-orange-100 sm:text-base">
                                Keep track of your recipes, orders, customers and business performance.
                            </p>
                            <button className="mt-5 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-lg transition hover:bg-orange-50">
                                <Plus size={18} />
                                Add New Recipe
                            </button>
                        </div>
                        <ChefHat size={220} className="absolute -right-10 -bottom-16 opacity-10" />
                    </div>

                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                                            <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                        </div>
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/20">
                                            <Icon size={21} />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-xs">
                                        <span className="flex items-center font-semibold text-green-600">
                                            <ArrowUpRight size={14} />
                                            {stat.change}
                                        </span>
                                        <span className="text-slate-400">{stat.description}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Meal Categories */}
                    <div className="mb-8">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meal Categories</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {mealCategories.map((cat, index) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={index}
                                        className={`group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition dark:border-slate-700 dark:bg-slate-800 ${cat.hover} hover:shadow-md`}
                                    >
                                        <div className={`rounded-xl p-3 ${cat.color}`}>
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white">{cat.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{cat.items} items</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                                <div className="rounded-xl bg-orange-100 p-3 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/20">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">Add Recipe</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Create new food</p>
                                </div>
                            </button>

                            <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                                <div className="rounded-xl bg-blue-100 p-3 text-blue-500 transition group-hover:bg-blue-500 group-hover:text-white dark:bg-blue-500/20">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">Orders</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage orders</p>
                                </div>
                            </button>

                            <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-green-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                                <div className="rounded-xl bg-green-100 p-3 text-green-500 transition group-hover:bg-green-500 group-hover:text-white dark:bg-green-500/20">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">Customers</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">View customers</p>
                                </div>
                            </button>

                            <button className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                                <div className="rounded-xl bg-purple-100 p-3 text-purple-500 transition group-hover:bg-purple-500 group-hover:text-white dark:bg-purple-500/20">
                                    <Utensils size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white">Recipes</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage menu</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Orders + Popular Recipes */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        {/* Recent Orders */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-700">
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Latest customer orders</p>
                                </div>
                                <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                                    View All
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[650px]">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400 dark:border-slate-700">
                                            <th className="px-5 py-4">Order</th>
                                            <th className="px-5 py-4">Customer</th>
                                            <th className="px-5 py-4">Item</th>
                                            <th className="px-5 py-4">Amount</th>
                                            <th className="px-5 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order, index) => (
                                            <tr key={index} className="border-b border-slate-50 transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50">
                                                <td className="px-5 py-4">
                                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{order.id}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{order.customer}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">{order.item}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="font-semibold text-slate-800 dark:text-white">{order.amount}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Popular Recipes */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-700">
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white">Popular Recipes</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Best selling dishes</p>
                                </div>
                                <button>
                                    <MoreVertical size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4 p-5">
                                {popularRecipes.map((recipe, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.name}
                                            className="h-14 w-14 rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                                                {recipe.name}
                                            </h3>
                                            <p className="text-xs text-slate-400">{recipe.category}</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-sm font-bold text-orange-500">
                                                    {recipe.price}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    • {recipe.orders} orders
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-100 p-4 dark:border-slate-700">
                                <button className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-orange-500 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-orange-500">
                                    Manage Recipes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                                <PackageCheck size={23} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">42</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Delivered Today</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <Truck size={23} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">18</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Out for Delivery</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <div className="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                <CircleAlert size={23} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">7</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Orders</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;