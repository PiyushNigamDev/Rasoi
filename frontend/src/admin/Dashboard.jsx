import {
  ArrowUpRight,
  BookOpen,
  IndianRupee,
  ShoppingBag,
  Users,
} from "lucide-react";
import { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../services/api";

const Dashboard = () => {
  const [recipeCount, setRecipeCount] = useState(0);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/getall`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setRecipeCount(response.data.data?.length || 0))
      .catch(() => setRecipeCount(0));
  }, []);
  const stats = [
    ["Revenue", "₹0", IndianRupee, "Connect order data to track sales"],
    ["Orders", "0", ShoppingBag, "No orders waiting"],
    ["Recipes", recipeCount, BookOpen, "Published menu items"],
    ["Customers", "0", Users, "Registered customer accounts"],
  ];
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
          Overview
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Good to see you, Admin
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here is what is happening across Rasoi today.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, StatIcon, note]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                {createElement(StatIcon, { size: 19 })}
              </span>
              <ArrowUpRight size={17} className="text-slate-300" />
            </div>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
            <p className="mt-2 text-xs text-slate-400">{note}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Order activity
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your order pipeline will be visualized here.
              </p>
            </div>
            <ShoppingBag className="text-orange-500" size={22} />
          </div>
          <div className="mt-10 flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
            No order activity yet
          </div>
        </div>
        <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
          <BookOpen className="text-orange-400" size={24} />
          <h2 className="mt-5 text-xl font-semibold">Build your menu</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Add recipes so customers can discover your best dishes.
          </p>
          <Link
            to="/admin/recipes"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-orange-400"
          >
            View recipes <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
