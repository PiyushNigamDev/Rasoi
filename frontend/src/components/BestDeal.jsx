import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function BestDeals() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const { cartItems, addToCart, removeFromCart } = useCart();

  const deals = [
    {
      id: 201,
      name: "Family Pizza Combo",
      price: 399,
      originalPrice: 599,
      discount: "33% OFF",
      rating: 4.9,
      time: "25 min",
      emoji: "🍕",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=80",
      description: "2 large pizzas + garlic bread + coke",
      tag: "Best Deal",
    },
    {
      id: 202,
      name: "Burger Meal Box",
      price: 249,
      originalPrice: 349,
      discount: "29% OFF",
      rating: 4.8,
      time: "18 min",
      emoji: "🍔",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80",
      description: "2 cheese burgers + fries + soft drink",
      tag: "Hot Deal",
    },
    {
      id: 203,
      name: "Chicken Biryani Feast",
      price: 299,
      originalPrice: 449,
      discount: "33% OFF",
      rating: 4.9,
      time: "22 min",
      emoji: "🍗",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&q=80",
      description: "Full chicken biryani + raita + salad",
      tag: "Limited",
    },
    {
      id: 204,
      name: "Healthy Bowl Duo",
      price: 279,
      originalPrice: 399,
      discount: "30% OFF",
      rating: 4.7,
      time: "15 min",
      emoji: "🥗",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80",
      description: "2 grilled chicken / paneer bowls",
      tag: "Healthy",
    },
    {
      id: 205,
      name: "Chinese Starter Pack",
      price: 229,
      originalPrice: 329,
      discount: "30% OFF",
      rating: 4.6,
      time: "20 min",
      emoji: "🍜",
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=700&q=80",
      description: "Noodles + manchurian + soup",
      tag: "Combo",
    },
    {
      id: 206,
      name: "Sweet Treat Box",
      price: 149,
      originalPrice: 219,
      discount: "32% OFF",
      rating: 4.8,
      time: "15 min",
      emoji: "🍰",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=80",
      description: "Brownie + ice cream + gulab jamun",
      tag: "Dessert",
    },
  ];

  // Duplicate for seamless infinite scroll
  const loopDeals = [...deals, ...deals];

  // Scroll reveal
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

  // Auto scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frameId;
    const speed = 2.5; // pixels per frame (increase = faster)

    const step = () => {
      if (!isPaused && el) {
        el.scrollLeft += speed;

        // Reset for infinite loop
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  const getQty = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-amber-50/40 to-white"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-5 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-sm font-semibold mb-4">
              <span>⚡</span>
              Limited Time Offers
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Best{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                Deals
              </span>
            </h2>
            {/* <p className="mt-3 text-gray-600 max-w-lg">
              Save big on our most loved combos — auto-scrolling deals for you.
            </p> */}
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
          >
            View all deals
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Auto-scroll row */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollBehavior: "auto" }}
        >
          {loopDeals.map((deal, index) => (
            <div
              key={`${deal.id}-${index}`}
              className="group relative flex-shrink-0 w-[280px] sm:w-[300px] bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden
                transition-all duration-300 hover:shadow-xl hover:shadow-orange-100 hover:border-orange-200"
            >
              {/* Discount */}
              <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-md">
                {deal.discount}
              </div>

              <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-orange-600 backdrop-blur-sm shadow-sm">
                {deal.tag}
              </div>

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                  <span className="text-yellow-500">★</span>
                  {deal.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-orange-600 transition-colors">
                  {deal.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{deal.description}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 mb-3">
                  <span>⏱️ {deal.time}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-extrabold text-gray-900">₹{deal.price}</span>
                  <span className="text-sm text-gray-400 line-through">₹{deal.originalPrice}</span>
                </div>

                {getQty(deal.id) > 0 ? (
                  <div className="flex items-center justify-center gap-3 bg-orange-50 rounded-xl py-2 border border-orange-200">
                    <button
                      onClick={() => removeFromCart(deal.id)}
                      className="w-8 h-8 rounded-full bg-white text-orange-500 font-bold flex items-center justify-center shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-orange-600">
                      {getQty(deal.id)}
                    </span>
                    <button
                      onClick={() => addToCart(deal)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(deal)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                      bg-gradient-to-r from-amber-500 to-orange-500
                      shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    Grab Deal
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* <p className="text-center text-xs text-gray-400 mt-4">
          Hover to pause • Auto-scrolling deals
        </p> */}
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

export default BestDeals;