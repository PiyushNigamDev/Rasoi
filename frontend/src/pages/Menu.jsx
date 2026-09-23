import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // keep search in sync when coming from navbar
  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearch(q);
  }, [searchParams]);
  const { cartItems, addToCart, removeFromCart } = useCart();

  const categories = [
    "All",
    "Veg",
    "Non-Veg",
    "Breakfast",
    "Salad",
    "Sweets",
    "Dessert",
    "Diet Food",
    "Drinks",
  ];

  const menuItems = [
    {
      id: 101,
      name: "Paneer Butter Masala",
      category: "Veg",
      price: 249,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
      desc: "Creamy tomato gravy with soft paneer cubes",
      isVeg: true,
      emoji: "🍛",
    },
    {
      id: 102,
      name: "Veg Biryani",
      category: "Veg",
      price: 199,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1589302168069-af2f3d4e9b73?w=600&q=80",
      desc: "Fragrant basmati rice with mixed vegetables",
      isVeg: true,
      emoji: "🍚",
    },
    {
      id: 103,
      name: "Dal Makhani",
      category: "Veg",
      price: 179,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
      desc: "Slow-cooked black lentils in buttery gravy",
      isVeg: true,
      emoji: "🍲",
    },
    {
      id: 104,
      name: "Butter Chicken",
      category: "Non-Veg",
      price: 299,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1603894584372-a21ea7102f15?w=600&q=80",
      desc: "Tender chicken in rich tomato-butter sauce",
      isVeg: false,
      emoji: "🍗",
    },
    {
      id: 105,
      name: "Chicken Biryani",
      category: "Non-Veg",
      price: 279,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
      desc: "Aromatic rice layered with spicy chicken",
      isVeg: false,
      emoji: "🍗",
    },
    {
      id: 106,
      name: "Tandoori Chicken",
      category: "Non-Veg",
      price: 329,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80",
      desc: "Smoky, juicy chicken cooked in tandoor",
      isVeg: false,
      emoji: "🍖",
    },
    {
      id: 107,
      name: "Masala Dosa",
      category: "Breakfast",
      price: 129,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1668236543090-827244bcfea0?w=600&q=80",
      desc: "Crispy dosa filled with spiced potato",
      isVeg: true,
      emoji: "🥞",
    },
    {
      id: 108,
      name: "Poha",
      category: "Breakfast",
      price: 89,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
      desc: "Light & flavorful flattened rice breakfast",
      isVeg: true,
      emoji: "🥣",
    },
    {
      id: 109,
      name: "Egg Benedict",
      category: "Breakfast",
      price: 199,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80",
      desc: "Poached eggs on muffin with hollandaise",
      isVeg: false,
      emoji: "🍳",
    },
    {
      id: 110,
      name: "Greek Salad",
      category: "Salad",
      price: 159,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
      desc: "Fresh veggies, feta, olives & olive oil",
      isVeg: true,
      emoji: "🥗",
    },
    {
      id: 111,
      name: "Caesar Salad",
      category: "Salad",
      price: 179,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80",
      desc: "Crisp romaine, croutons & creamy dressing",
      isVeg: true,
      emoji: "🥗",
    },
    {
      id: 112,
      name: "Chicken Salad",
      category: "Salad",
      price: 219,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      desc: "Grilled chicken with fresh garden greens",
      isVeg: false,
      emoji: "🥗",
    },
    {
      id: 113,
      name: "Gulab Jamun",
      category: "Sweets",
      price: 99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1666195403996-0c17dde1d43c?w=600&q=80",
      desc: "Soft milk-solid balls soaked in sugar syrup",
      isVeg: true,
      emoji: "🍮",
    },
    {
      id: 114,
      name: "Rasmalai",
      category: "Sweets",
      price: 129,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
      desc: "Spongy cottage cheese in sweetened milk",
      isVeg: true,
      emoji: "🥛",
    },
    {
      id: 115,
      name: "Jalebi",
      category: "Sweets",
      price: 89,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
      desc: "Crispy, juicy, deep-fried sweet spirals",
      isVeg: true,
      emoji: "🌀",
    },
    {
      id: 116,
      name: "Chocolate Brownie",
      category: "Dessert",
      price: 149,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
      desc: "Warm gooey brownie with chocolate chunks",
      isVeg: true,
      emoji: "🍫",
    },
    {
      id: 117,
      name: "Cheesecake",
      category: "Dessert",
      price: 199,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
      desc: "Creamy New York style cheesecake",
      isVeg: true,
      emoji: "🍰",
    },
    {
      id: 118,
      name: "Ice Cream Sundae",
      category: "Dessert",
      price: 129,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
      desc: "Vanilla ice cream with chocolate & nuts",
      isVeg: true,
      emoji: "🍨",
    },
    {
      id: 119,
      name: "Berry Yogurt Parfait",
      category: "Diet Food",
      price: 189,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1488477181946-4cfa6c56fd38?w=600&q=80",
      desc: "Greek yogurt, berries, oats and honey",
      isVeg: true,
      emoji: "🥣",
    },
    {
      id: 120,
      name: "Grilled Paneer Salad",
      category: "Diet Food",
      price: 229,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      desc: "Grilled paneer with greens and lemon dressing",
      isVeg: true,
      emoji: "🥗",
    },
    {
      id: 121,
      name: "Green Detox Cooler",
      category: "Drinks",
      price: 119,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&q=80",
      desc: "Cucumber, mint, lime and refreshing herbs",
      isVeg: true,
      emoji: "🥒",
    },
    {
      id: 122,
      name: "Mango Iced Tea",
      category: "Drinks",
      price: 99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
      desc: "Chilled black tea with ripe mango and citrus",
      isVeg: true,
      emoji: "🥭",
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
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
              {["Breakfast", "Lunch", "Fast Food", "Dinner", "Dessert", "Diet Food", "Drinks"].map((meal) => (
                <Link
                  key={meal}
                  to={`/menu/${meal === "Fast Food" ? "fastfood" : meal === "Diet Food" ? "dietfood" : meal.toLowerCase()}`}
                  className="whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-500 hover:text-white"
                >
                  {meal}
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
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-5">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredItems.length}
            </span>{" "}
            items
          </p>

          {/* Food Grid */}
          {filteredItems.length > 0 ? (
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