import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { API_BASE_URL, getImageUrl } from "../services/api";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearch(q);
  }, [searchParams]);

  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/getall`);
        const recipes = (response.data?.data || []).filter(
          (item) => item.isAvailable !== false
        );

        const normalizedItems = recipes.map((recipe) => ({
          id: recipe._id,
          name: recipe.name,
          category: recipe.category,
          price: recipe.price,
          rating: recipe.rating || 4.7,
          image: getImageUrl(recipe.image),
          desc: recipe.description || recipe.desc || "",
          isVeg: recipe.category !== "fastfood" && recipe.category !== "dinner",
          emoji: "🍽️",
        }));

        setMenuItems(normalizedItems);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Fast Food",
    "Dinner",
    "Dessert",
    "Diet Food",
    "Drinks",
  ];

  const normalizeCategory = (value = "") =>
    String(value).trim().toLowerCase().replace(/\s+/g, "");

  const filteredItems = menuItems.filter((item) => {
    const normalizedItemCategory = normalizeCategory(item.category);
    const normalizedActiveCategory = normalizeCategory(activeCategory);
    const matchesCategory =
      !normalizedActiveCategory ||
      normalizedActiveCategory === "all" ||
      normalizedItemCategory === normalizedActiveCategory ||
      (normalizedActiveCategory === "fastfood" && normalizedItemCategory === "fastfood") ||
      (normalizedActiveCategory === "dietfood" && normalizedItemCategory === "dietfood") ||
      (normalizedActiveCategory === "drinks" && normalizedItemCategory === "drink") ||
      (normalizedActiveCategory === "drink" && normalizedItemCategory === "drink");

    const normalizedSearch = search.toLowerCase().trim();
    const matchesSearch = [item.name, item.desc].some((value) =>
      value.toLowerCase().includes(normalizedSearch)
    );

    return matchesCategory && matchesSearch;
  });

  // Quantity from global cart
  const getQty = (id) => {
    const found = cartItems.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  // Convert menu item → cart product format
  const handleAdd = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      emoji: item.emoji || "🍽️",
      image: item.image,
      category: item.category,
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
        {/* Header */}
        <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-md border-b border-orange-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Our <span className="text-orange-500">Menu</span>
                </h1>
                <p className="text-sm text-gray-500">
                  Freshly prepared • Delivered fast
                </p>
              </div>
              <Link
                to="/auth"
                className="text-sm font-medium text-orange-500 hover:text-orange-600"
              >
                ← Back to Home
              </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {[
                { label: "All", to: "/menu" },
                { label: "Breakfast", to: "/menu/breakfast" },
                { label: "Lunch", to: "/menu/lunch" },
                { label: "Fast Food", to: "/menu/fastfood" },
                { label: "Dinner", to: "/menu/dinner" },
                { label: "Dessert", to: "/menu/dessert" },
                { label: "Diet Food", to: "/menu/dietfood" },
                { label: "Drinks", to: "/menu/drinks" },
              ].map((meal) => (
                <Link
                  key={meal.label}
                  to={meal.to}
                  className="whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-500 hover:text-white"
                >
                  {meal.label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-400 outline-none bg-white shadow-sm transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-sm text-gray-500 mb-5">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredItems.length}
            </span>{" "}
            items
          </p>

          {/* Food Grid */}
          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading dishes...</div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-orange-100/50 border border-white
                    hover:shadow-xl hover:shadow-orange-200/60 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                          item.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {item.isVeg ? "VEG" : "NON-VEG"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      ⭐ {item.rating}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-orange-500 font-extrabold text-lg">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {item.desc}
                    </p>

                    {/* Add / Quantity controls */}
                    {getQty(item.id) > 0 ? (
                      <div className="flex items-center justify-center gap-3 bg-orange-50 rounded-xl py-2 border border-orange-200">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-9 h-9 rounded-full bg-white text-orange-500 font-bold flex items-center justify-center shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-base font-bold text-orange-600">
                          {getQty(item.id)}
                        </span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        className="w-full py-3 rounded-xl font-semibold text-white
                          bg-gradient-to-r from-orange-500 to-rose-500
                          hover:shadow-lg hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98]
                          transition-all duration-300"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-700">No dishes found</h3>
              <p className="text-gray-500 mt-2">
                Try a different category or search term
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Menu;