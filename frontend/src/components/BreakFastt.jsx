import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, IndianRupee, Search, Sun } from "lucide-react";

const Lunch = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch only lunch recipes
  const getLunch = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/getall/");

      // Filter only lunch category
      const lunchItems = (res.data.data || []).filter(
        (item) => item.category?.toLowerCase() === "lunch"
      );

      setRecipes(lunchItems);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLunch();
  }, []);

  // Image URL helper
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x300?text=No+Image";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/uploads/${img}`;
  };

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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
              <Sun size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Lunch Menu
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Enjoy our special lunch meals and thalis
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
              placeholder="Search lunch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-700">
            <Sun size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-500">
              No lunch items available
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
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
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
                    <div className="flex items-center gap-1 font-bold text-orange-600">
                      <IndianRupee size={16} />
                      {recipe.price}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Clock size={14} />
                      {recipe.preparationTime}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    disabled={!recipe.isAvailable}
                    className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition ${
                      recipe.isAvailable
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-700"
                    }`}
                  >
                    {recipe.isAvailable ? "Add to Cart" : "Not Available"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lunch;