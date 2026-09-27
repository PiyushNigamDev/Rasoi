import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, ShoppingBag, User, Mail, PackageCheck, Clock3, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, getImageUrl } from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("rasoi_token") || localStorage.getItem("cloud_kitchen_token");

        const response = await axios.get(`${API_BASE_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link to="/auth" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/40">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-2xl font-bold text-white shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Customer</p>
                <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{user?.name || "User"}</h1>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <User className="mt-0.5 text-orange-500" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Full name</p>
                  <p className="mt-1 font-semibold text-slate-800">{user?.name || "Not available"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                <Mail className="mt-0.5 text-orange-500" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
                  <p className="mt-1 font-semibold text-slate-800 break-all">{user?.email || "Not available"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-100/40">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Orders</p>
                <h2 className="text-2xl font-extrabold text-slate-900">Placed orders</h2>
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center text-sm font-medium text-orange-700">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                You haven’t placed any orders yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Order ID</p>
                        <p className="mt-1 font-bold text-slate-800">#{String(order._id).slice(-6).toUpperCase()}</p>
                      </div>

                      <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {order.orderStatus || "Pending"}
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> {formatDate(order.createdAt)}</span>
                      <span className="inline-flex items-center gap-1.5"><PackageCheck size={14} /> {order.paymentStatus || "Pending"}</span>
                    </div>

                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex gap-3 rounded-xl bg-white p-2.5 shadow-sm">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover"
                            onError={(event) => {
                              event.currentTarget.src = getImageUrl();
                              event.currentTarget.onerror = null;
                            }}
                          />

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-xl bg-white p-3">
                      <div className="mb-2 flex items-center gap-2 text-slate-700">
                        <MapPin size={16} className="text-orange-500" />
                        <span className="font-semibold">Delivery address</span>
                      </div>

                      <p className="text-sm text-slate-600">
                        {order.deliveryAddress?.fullName || "Customer"} • {order.deliveryAddress?.phone || "—"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {order.deliveryAddress?.address || "No address provided"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {order.deliveryAddress?.city || ""} {order.deliveryAddress?.pincode || ""}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="text-sm text-slate-500">Total</span>
                      <span className="text-lg font-extrabold text-orange-600">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
