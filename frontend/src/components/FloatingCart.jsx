import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
function FloatingCart() {
  const { totalItems, totalPrice, cartItems } = useCart();
  const location = useLocation();

  // Hide when cart is empty
  if (totalItems === 0) return null;
  if (
    location.pathname === "/cart" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin")|| location.pathname==="/checkout"
    ) return null;
  // Last added item (for preview)
  const lastItem = cartItems[cartItems.length - 1];

  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl shadow-2xl shadow-orange-500/40 pl-4 pr-5 py-3
        hover:scale-105 hover:shadow-orange-500/60 active:scale-95 transition-all duration-300 animate-slide-up"
      >
        {/* Icon + badge */}
        <div className="relative">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
            🛒
          </div>
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-orange-800 text-xs font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
            {totalItems}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-white/80 font-medium">
            {totalItems} item{totalItems > 1 ? "s" : ""}
          </span>
          <span className="text-base font-extrabold">
            ₹{totalPrice}
          </span>
        </div>

        {/* Arrow */}
        <div className="ml-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition">
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Optional: tiny last item preview on hover (desktop) */}
        {lastItem && (
          <div className="hidden sm:flex absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white text-gray-800 rounded-xl shadow-xl border border-orange-100 px-3 py-2 flex items-center gap-2 min-w-[180px]">
              <span className="text-2xl">{lastItem.emoji || "🍽️"}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{lastItem.name}</p>
                <p className="text-[10px] text-gray-500">
                  Qty {lastItem.quantity} · ₹{lastItem.price * lastItem.quantity}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.35s ease-out;
        }
      `}</style>
    </Link>
  );
}

export default FloatingCart;