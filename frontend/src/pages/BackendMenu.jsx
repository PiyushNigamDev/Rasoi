import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { API_BASE_URL, getImageUrl } from "../services/api";

const categoryLabel = (category) =>
  ({ fastfood: "Fast Food", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", dessert: "Dessert", dietfood: "Diet Food", drink: "Drinks" }[category] || category);

function BackendMenu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => setSearch(searchParams.get("search") || ""), [searchParams]);
  useEffect(() => {
    let mounted = true;
    axios.get(`${API_BASE_URL}/api/getall`).then(({ data }) => {
      if (mounted) setRecipes((data.data || []).filter((recipe) => recipe.isAvailable !== false));
    }).catch(() => mounted && setRecipes([])).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const categories = ["All", ...new Set(recipes.map((recipe) => recipe.category))];
  const query = search.trim().toLowerCase();
  const visibleRecipes = recipes.filter((recipe) =>
    (activeCategory === "All" || recipe.category === activeCategory) &&
    [recipe.name, recipe.description, recipe.category].some((value) => String(value || "").toLowerCase().includes(query))
  );
  const quantity = (id) => cartItems.find((item) => item.id === id)?.quantity || 0;
  const addRecipe = (recipe) => addToCart({ id: recipe._id, name: recipe.name, price: recipe.price, image: recipe.image, category: recipe.category });

  return <><Navbar /><main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50"><div className="sticky top-20 z-20 border-b border-orange-100 bg-white/80 backdrop-blur-md"><div className="mx-auto max-w-6xl px-4 py-4"><div className="mb-4 flex items-center justify-between"><div><h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Our <span className="text-orange-500">Menu</span></h1><p className="text-sm text-gray-500">Freshly prepared • Delivered fast</p></div><Link to="/auth" className="text-sm font-medium text-orange-500 hover:text-orange-600">← Back to Home</Link></div><div className="relative"><input type="search" placeholder="Search dishes..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-orange-400" /><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span></div></div></div><div className="mx-auto max-w-6xl px-4 py-6"><div className="mb-5 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${activeCategory === category ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200" : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"}`}>{category === "All" ? "All" : categoryLabel(category)}</button>)}</div>{loading ? <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div> : visibleRecipes.length ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleRecipes.map((recipe) => <article key={recipe._id} className="overflow-hidden rounded-3xl border border-white bg-white shadow-lg shadow-orange-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/60"><div className="relative h-48 overflow-hidden">{recipe.image && <img src={getImageUrl(recipe.image)} alt={recipe.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />}<span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-orange-600 backdrop-blur-sm">{categoryLabel(recipe.category)}</span></div><div className="p-5"><div className="mb-1 flex items-start justify-between gap-3"><h2 className="text-lg font-bold leading-tight text-gray-900">{recipe.name}</h2><span className="text-lg font-extrabold text-orange-500">₹{recipe.price}</span></div><p className="mb-3 line-clamp-2 text-sm text-gray-500">{recipe.description}</p><p className="mb-4 text-xs text-gray-400">⏱ {recipe.preparationTime}</p>{quantity(recipe._id) ? <div className="flex items-center justify-center gap-3 rounded-xl border border-orange-200 bg-orange-50 py-2"><button onClick={() => removeFromCart(recipe._id)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-orange-500 shadow-sm">−</button><span className="w-8 text-center font-bold text-orange-600">{quantity(recipe._id)}</span><button onClick={() => addRecipe(recipe)} className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white">+</button></div> : <button onClick={() => addRecipe(recipe)} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 font-semibold text-white transition hover:shadow-lg">Add to Cart</button>}</div></article>)}</div> : <div className="py-20 text-center"><h2 className="text-xl font-bold text-gray-700">No dishes found</h2><p className="mt-2 text-gray-500">Upload recipes from the admin dashboard to display them here.</p></div>}</div></main></>;
}

export default BackendMenu;
