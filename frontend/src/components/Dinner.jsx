import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, IndianRupee, Search, Moon } from "lucide-react";
import { getImageUrl } from "../services/api";
import { useCart } from "../context/CartContext";

const Dinner = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, removeFromCart } = useCart();

  const getQuantity = (recipeId) =>
    cartItems.find((item) => item.id === recipeId)?.quantity || 0;

  const handleAddToCart = (recipe) => {
    addToCart({
      id: recipe._id,
      name: recipe.name,
      price: recipe.price,
      image: getImageUrl(recipe.image),
      emoji: "🍽️",
      category: recipe.category,
    });
  };

  // Fetch only dinner recipes
  const getDinner = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/getall/");

      // Filter only dinner category
      const dinnerItems = (res.data.data || []).filter(
        (item) => item.category?.toLowerCase() === "dinner"
      );

      setRecipes(dinnerItems);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDinner();
  }, []);

  // Search filter
  const filteredRecipes = recipes.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Moon size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Dinner Menu
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            End your day with our special dinner dishes
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search dinner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-700">
            <Moon size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-500">
              No dinner items available
            </p>
          </div>
        ) : (
          /* Recipe Cards */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(recipe.image)}
                    alt={recipe.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = getImageUrl();
                      e.currentTarget.onerror = null;
                    }}
                  />

                  {/* Availability Badge */}
                  <span
                    className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      recipe.isAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {recipe.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {recipe.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {recipe.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-indigo-600">
                      <IndianRupee size={16} />
                      {recipe.price}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Clock size={14} />
                      {recipe.preparationTime}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  {getQuantity(recipe._id) > 0 ? (
                    <div className="mt-4 flex h-16 w-full items-center justify-center gap-7 rounded-2xl border border-orange-200 bg-orange-50/70 px-4">
                      <button aria-label="Decrease quantity" onClick={() => removeFromCart(recipe._id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-medium text-orange-500 shadow-sm transition hover:bg-orange-500 hover:text-white">−</button>
                      <span className="w-5 text-center text-base font-bold text-orange-600">{getQuantity(recipe._id)}</span>
                      <button aria-label="Increase quantity" onClick={() => handleAddToCart(recipe)} className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-xl font-medium text-white shadow-sm transition hover:scale-105">+</button>
                    </div>
                  ) : (
                    <button
                      disabled={recipe.isAvailable === false}
                      onClick={() => handleAddToCart(recipe)}
                      className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition ${recipe.isAvailable !== false ? "bg-indigo-500 text-white hover:bg-indigo-600" : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-700"}`}
                    >
                      {recipe.isAvailable !== false ? "Add to Cart" : "Not Available"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dinner;