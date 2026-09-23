import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import FloatingCart from "./components/FloatingCart";
import Navbar from "./components/Navbar";
import ProceedToPay from "./components/proceedtoPay";
// Admin pages
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./pages/AdminLogin"; // or "./admin/AdminLogin"
import VendorLogin from "./pages/VendorLogin";
import VendorRegister from "./pages/VendorRegister";
import FastFoodPage from "./admin/FastFood";
import BreakFast from "./admin/BreakFast";
import Lunch from "./admin/Lunch";
import Dinner from "./admin/Dinner";
import Dashboard from "./admin/Dashboard";
import Recipes from "./admin/Recipes";
import Orders from "./admin/Orders";
import Customers from "./admin/Customers";

// Public category pages
import PublicBreakfast from "./components/BreakFast";
import PublicLunch from "./components/Lunch";
import PublicDinner from "./components/Dinner";
import PublicFastFoods from "./components/Fastfoods";
import CategoryMenu from "./components/CategoryMenu";
import CategoryManager from "./admin/CategoryManager";

// ===================== PUBLIC LAYOUT =====================
function PublicCategory({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// ===================== ADMIN PROTECTED ROUTE =====================
function AdminProtected({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !["admin", "vendor"].includes(role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== PUBLIC ROUTES ===================== */}
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<ProceedToPay />} />
        {/* Public Category Pages */}
        <Route
          path="/menu/breakfast"
          element={
            <PublicCategory>
              <PublicBreakfast />
            </PublicCategory>
          }
        />
        <Route
          path="/menu/lunch"
          element={
            <PublicCategory>
              <PublicLunch />
            </PublicCategory>
          }
        />
        <Route
          path="/menu/fastfood"
          element={
            <PublicCategory>
              <PublicFastFoods />
            </PublicCategory>
          }
        />
        <Route
          path="/menu/dinner"
          element={
            <PublicCategory>
              <PublicDinner />
            </PublicCategory>
          }
        />
        <Route path="/menu/dessert" element={<PublicCategory><CategoryMenu category="dessert" title="Dessert" description="Sweet treats made for every occasion" /></PublicCategory>} />
        <Route path="/menu/dietfood" element={<PublicCategory><CategoryMenu category="dietfood" title="Diet Food" description="Fresh, balanced dishes for mindful eating" /></PublicCategory>} />
        <Route path="/menu/drink" element={<PublicCategory><CategoryMenu category="drink" title="Drinks" description="Refreshing drinks to complete your meal" /></PublicCategory>} />

        {/* ===================== ADMIN LOGIN (outside layout) ===================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/register" element={<VendorRegister />} />

        {/* ===================== ADMIN ROUTES (protected + layout) ===================== */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />

          <Route path="fastfood" element={<FastFoodPage />} />
          <Route path="breakfast" element={<BreakFast />} />
          <Route path="lunch" element={<Lunch />} />
          <Route path="dinner" element={<Dinner />} />
          <Route path="dessert" element={<CategoryManager category="dessert" title="Dessert" />} />
          <Route path="dietfood" element={<CategoryManager category="dietfood" title="Diet Food" />} />
          <Route path="drink" element={<CategoryManager category="drink" title="Drinks" />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FloatingCart />
    </BrowserRouter>
  );
}

export default App;