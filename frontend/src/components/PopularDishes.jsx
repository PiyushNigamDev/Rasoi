import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function PopularDishes({ searchQuery = "" }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const { cartItems, addToCart, removeFromCart } = useCart();

  const categories = ["All", "Burgers", "Pizza", "Biryani", "Chinese", "Healthy"];

  const dishes = [
    {
      id: 1,
      name: "Classic Cheese Burger",
      category: "Burgers",
      price: 249,
      rating: 4.9,
      time: "15 min",
      emoji: "🍔",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
      description: "Juicy patty, melted cheese, fresh veggies & special sauce",
      tag: "Bestseller",
      tagColor: "bg-orange-500",
    },
    {
      id: 2,
      name: "Margherita Pizza",
      category: "Pizza",
      price: 299,
      rating: 4.8,
      time: "18 min",
      emoji: "🍕",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d264?w=600&q=80",
      description: "Fresh mozzarella, basil & authentic Italian tomato sauce",
      tag: "Popular",
      tagColor: "bg-rose-500",
    },
    {
      id: 3,
      name: "Hyderabadi Chicken Biryani",
      category: "Biryani",
      price: 349,
      rating: 4.9,
      time: "20 min",
      emoji: "🍗",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
      description: "Aromatic basmati rice with tender chicken & authentic spices",
      tag: "Spicy",
      tagColor: "bg-red-500",
    },
    {
      id: 4,
      name: "Veg Hakka Noodles",
      category: "Chinese",
      price: 199,
      rating: 4.7,
      time: "14 min",
      emoji: "🍜",
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&q=80",
      description: "Stir-fried noodles with fresh vegetables & Indo-Chinese sauce",
      tag: "Veg",
      tagColor: "bg-emerald-500",
    },
    {
      id: 5,
      name: "Grilled Chicken Salad",
      category: "Healthy",
      price: 279,
      rating: 4.8,
      time: "12 min",
      emoji: "🥗",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      description: "Grilled chicken, mixed greens, avocado & light dressing",
      tag: "Healthy",
      tagColor: "bg-green-500",
    },
    {
      id: 6,
      name: "Paneer Tikka Burger",
      category: "Burgers",
      price: 229,
      rating: 4.6,
      time: "16 min",
      emoji: "🥪",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
      description: "Smoky paneer tikka, mint mayo & crispy veggies",
      tag: "Veg",
      tagColor: "bg-emerald-500",
    },
    {
      id: 7,
      name: "Pepperoni Feast Pizza",
      category: "Pizza",
      price: 399,
      rating: 4.9,
      time: "20 min",
      emoji: "🍕",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
      description: "Loaded with pepperoni, mozzarella & herbs",
      tag: "Bestseller",
      tagColor: "bg-orange-500",
    },
    {
      id: 8,
      name: "Chicken Manchurian",
      category: "Chinese",
      price: 269,
      rating: 4.7,
      time: "17 min",
      emoji: "🍲",
      image: "https://images.unsplash.com/photo-1525755662778-989d05245632?w=600&q=80",
      description: "Crispy chicken tossed in spicy Manchurian gravy",
      tag: "Spicy",
      tagColor: "bg-red-500",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      activeCategory === "All" || dish.category === activeCategory;
    const matchesSearch =
      !normalizedQuery ||
      [dish.name, dish.category, dish.description].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );

    return matchesCategory && matchesSearch;
  });

  const getQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200/25 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-5">
            <span>🔥</span>
            Most Loved
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Popular{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Dishes
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600">
            Handpicked bestsellers from our Rasoi kitchen — freshly prepared and
            delivered hot.
          </p>
        </div>

        {/* Category Filter */}
        <div
          className={`flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 transition-all duration-1000 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500 hover:shadow-md"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {filteredDishes.map((dish, index) => (
            <div
              key={dish.id}
              className={`group relative bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden
                transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 hover:border-orange-200
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : "0ms",
              }}
            >
              {/* Tag */}
              <div
                className={`absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${dish.tagColor}`}
              >
                {dish.tag}
              </div>

              {/* Real Image */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Rating badge */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                  <span className="text-yellow-500">★</span>
                  {dish.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors mb-1">
                  {dish.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                  {dish.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">⏱️ {dish.time}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-gray-400">{dish.category}</span>
                </div>

                {/* Price + Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-gray-900">
                    ₹{dish.price}
                  </span>

                  {getQty(dish.id) > 0 ? (
                    <div className="flex items-center gap-2 bg-orange-50 rounded-full px-1.5 py-1 border border-orange-200">
                      <button
                        onClick={() => removeFromCart(dish.id)}
                        className="w-7 h-7 rounded-full bg-white text-orange-500 font-bold flex items-center justify-center shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-orange-600">
                        {getQty(dish.id)}
                      </span>
                      <button
                        onClick={() => addToCart(dish)}
                        className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(dish)}
                      className="px-4 py-2 rounded-full text-sm font-semibold text-white
                        bg-gradient-to-r from-orange-500 to-rose-500
                        shadow-md shadow-orange-500/25
                        hover:shadow-orange-500/40 hover:scale-105 active:scale-95
                        transition-all duration-300"
                    >
                      Add +
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div
          className={`mt-14 text-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold
              text-gray-700 bg-white border-2 border-gray-200
              hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50
              hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View Full Menu
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PopularDishes;