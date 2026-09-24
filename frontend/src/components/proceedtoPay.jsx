import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Wallet,
  Banknote,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { API_BASE_URL, getImageUrl as getApiImageUrl } from "../services/api";

const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve();

  const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_URL}"]`);
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout"));
    document.body.appendChild(script);
  });
};

const ProceedToPay = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, token, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [cancelingOrder, setCancelingOrder] = useState(false);
  // Online payment is the default, so clicking Place Order opens Razorpay.
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!orderConfirmed?.readyAt) return undefined;

    const updateRemainingTime = () => {
      setRemainingSeconds(Math.max(0, Math.ceil((orderConfirmed.readyAt - Date.now()) / 1000)));
    };

    updateRemainingTime();
    const timer = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(timer);
  }, [orderConfirmed?.readyAt]);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    landmark: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const FREE_SHIPPING_THRESHOLD = 50;
  const deliveryFee = totalPrice > 0 ? (totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 40) : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      return Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to place your order",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "Cart is empty",
        text: "Add some items before checkout",
      });
    }

    if (!form.fullName || !form.phone || !form.address || !form.city || !form.pincode) {
      return Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please fill all required delivery fields",
      });
    }

    try {
      setLoading(true);
      const orderData = {
        items: cartItems.map((item) => ({
          recipeId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        deliveryAddress: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          landmark: form.landmark,
          city: form.city,
          pincode: form.pincode,
        },
        notes: form.notes,
        paymentMethod,
        subtotal: totalPrice,
        deliveryFee,
        totalAmount: grandTotal,
      };

      const response = await axios.post(`${API_BASE_URL}/api/orders/create`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let confirmedOrderId = response.data.order?._id || response.data.razorpayOrderId;
      let preparationMinutes = response.data.order?.preparationMinutes || response.data.orderData?.preparationMinutes || 30;

      if (paymentMethod !== "cod") {
        await loadRazorpayCheckout();
        if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable");

        await new Promise((resolve, reject) => {
          const checkout = new window.Razorpay({
            key: response.data.keyId,
            amount: response.data.amount,
            currency: response.data.currency,
            name: "Rasoi",
            description: "Food order payment",
            order_id: response.data.razorpayOrderId,
            prefill: {
              name: form.fullName,
              contact: form.phone,
            },
            theme: { color: "#f97316" },
            handler: async (paymentResponse) => {
              try {
                const verification = await axios.post(
                  `${API_BASE_URL}/api/orders/verify-payment`,
                  {
                    ...paymentResponse,
                    orderData: response.data.orderData,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                confirmedOrderId = verification.data.order?._id || paymentResponse.razorpay_payment_id;
                preparationMinutes = verification.data.order?.preparationMinutes || preparationMinutes;
                resolve();
              } catch (error) {
                reject(new Error(error.response?.data?.message || "Payment verification failed"));
              }
            },
            modal: { ondismiss: () => reject(new Error("Payment was cancelled")) },
          });
          checkout.open();
        });
      }

      clearCart?.();
      setOrderConfirmed({
        id: confirmedOrderId,
        paymentMethod,
        preparationMinutes,
        readyAt: Date.now() + preparationMinutes * 60 * 1000,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.description ||
        err.message ||
        "Something went wrong";
      console.error("Order payment failed:", {
        status: err.response?.status,
        data: err.response?.data,
        error: err,
      });
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderConfirmed?.id) return;

    try {
      setCancelingOrder(true);
      await axios.patch(
        `${API_BASE_URL}/api/orders/${orderConfirmed.id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderConfirmed((prev) => ({ ...prev, cancelled: true }));
      Swal.fire({
        icon: "success",
        title: "Order cancelled",
        text: "Your order has been successfully cancelled.",
        confirmButtonColor: "#f97316",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Cancellation failed",
        text: error.response?.data?.message || "Unable to cancel this order right now.",
      });
    } finally {
      setCancelingOrder(false);
    }
  };

  const formatRemainingTime = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const getImageUrl = (img) => {
    return getApiImageUrl(img) || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
  };

  if (orderConfirmed) {
    if (orderConfirmed.cancelled) {
      return (
        <>
          <Navbar />
          <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <CheckCircle2 size={42} />
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">Order cancelled</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Your order was cancelled</h1>
              <p className="mt-3 text-slate-500">You can keep browsing the menu or return home.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button onClick={() => navigate("/menu")} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">Continue shopping</button>
                <button onClick={() => navigate("/auth")} className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Go home</button>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={42} />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Order confirmed</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {remainingSeconds > 0 ? "Your order is being prepared" : "Your order is at your door"}
            </h1>
            <p className="mt-3 text-slate-500">
              {remainingSeconds > 0
                ? `Estimated preparation time: ${orderConfirmed.preparationMinutes} minutes`
                : "Your order is ready for delivery."}
            </p>
            {remainingSeconds > 0 && (
              <div className="mx-auto mt-6 w-fit rounded-2xl bg-orange-50 px-8 py-4 text-orange-600">
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Ready in</p>
                <p className="mt-1 text-4xl font-bold tabular-nums">{formatRemainingTime()}</p>
              </div>
            )}
            {orderConfirmed.id && <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">Reference: <span className="font-semibold text-slate-900">{orderConfirmed.id}</span></p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button disabled={cancelingOrder} onClick={handleCancelOrder} className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60">
                {cancelingOrder ? "Cancelling..." : "Cancel Order"}
              </button>
              <button onClick={() => navigate("/menu")} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">Continue shopping</button>
              <button onClick={() => navigate("/auth")} className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Go home</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
          <ShoppingBag size={56} className="mb-4 text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Add items to proceed to checkout</p>
          <Link
            to="/menu"
            className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Browse Menu
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
              <p className="text-sm text-slate-500">Complete your order details</p>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT: Delivery + Payment */}
            <div className="space-y-6 lg:col-span-2">
              {/* Delivery Details */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MapPin className="text-orange-500" size={20} />
                  Delivery Details
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="10-digit mobile number"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 110001"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={2}
                      placeholder="House no, street, area"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={form.landmark}
                      onChange={handleChange}
                      placeholder="Near park, mall..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="Your city"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Order Notes (optional)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Less spicy, extra napkins..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <CreditCard className="text-orange-500" size={20} />
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: Banknote },
                    { id: "upi", label: "Razorpay (UPI/Card)", icon: Wallet },
                    { id: "card", label: "Razorpay Card", icon: CreditCard },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                          active
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-orange-200"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-semibold">{method.label}</span>
                        {active && <CheckCircle2 size={16} className="ml-auto text-orange-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-slate-900">Order Summary</h2>

                <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex gap-3">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-orange-500">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-4 border-t border-slate-100" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>

                  {totalPrice >= FREE_SHIPPING_THRESHOLD && totalPrice > 0 && (
                    <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      🎉 Congratulations! Free shipping unlocked.
                    </p>
                  )}

                  {totalPrice < FREE_SHIPPING_THRESHOLD && totalPrice > 0 && (
                    <p className="text-xs text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
                      Add ₹{FREE_SHIPPING_THRESHOLD - totalPrice} more for free delivery
                    </p>
                  )}

                  <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-orange-600">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:from-orange-600 hover:to-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Placing Order...
                    </>
                  ) : (
                    <>Place Order • ₹{grandTotal}</>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  By placing order, you agree to our terms
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProceedToPay;
