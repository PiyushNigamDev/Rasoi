import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getImageUrl } from "../services/api";

function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const deliveryFee = totalPrice > 0 ? (totalPrice >= 499 ? 0 : 40) : 0;
  const grandTotal = totalPrice + deliveryFee;

  // Checkout handler
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      await Swal.fire({
        title: "Login Required",
        text: "Please login first to proceed to checkout",
        icon: "warning",
        confirmButtonText: "Login Now",
        confirmButtonColor: "#f97316",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // User is logged in → go to checkout
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                Cart
              </span>
            </h1>
            <p className="text-gray-500 mt-1">
              {totalItems === 0
                ? "No items yet"
                : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-600 hover:underline transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 sm:p-16 text-center">
            <div className="text-7xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some delicious food from our menu
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white
                bg-gradient-to-r from-orange-500 to-rose-500
                shadow-lg shadow-orange-500/30 hover:scale-105 transition-all"
            >
              Browse Dishes
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5 flex gap-4 items-center hover:shadow-lg hover:border-orange-200 transition-all"
                >
                  {/* Product image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-orange-50 to-rose-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <span className={`text-4xl sm:text-5xl ${item.image ? "hidden" : "flex"}`}>
                      {item.emoji || "🍽️"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      ₹{item.price} each
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-orange-50 rounded-full px-1.5 py-1 border border-orange-200">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-full bg-white text-orange-500 font-bold flex items-center justify-center shadow-sm hover:bg-orange-500 hover:text-white transition-all"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-orange-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => deleteFromCart(item.id)}
                        className="text-xs font-semibold text-red-400 hover:text-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-extrabold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {totalPrice < 499 && totalPrice > 0 && (
                    <p className="text-xs text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
                      Add ₹{499 - totalPrice} more for free delivery
                    </p>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

             

              <button
  onClick={handleCheckout}
  className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white
    bg-gradient-to-r from-orange-500 to-rose-500
    shadow-lg shadow-orange-500/30
    hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]
    transition-all duration-300"
>
  Proceed to Checkout
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;