import { BookOpen, CircleCheck, Search, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getImageUrl } from "../services/api";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/getall`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRecipes(response.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => `${recipe.name} ${recipe.category}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">Menu library</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Recipes</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Browse every dish currently in your kitchen menu.</p></div><button onClick={() => navigate("/admin/fastfood")} className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"><Utensils size={17} />Manage menu</button></div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search recipes or categories" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div><span className="text-sm text-slate-500 dark:text-slate-400">{recipes.length} total recipes</span></div>
      {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">Loading recipes...</div> : filteredRecipes.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800"><BookOpen size={30} className="text-orange-500" /><h2 className="mt-4 font-semibold text-slate-900 dark:text-white">No recipes found</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add a dish from one of the menu categories to get started.</p></div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filteredRecipes.map((recipe) => <article key={recipe._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"><img src={getImageUrl(recipe.image)} alt={recipe.name} className="h-44 w-full object-cover" /><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-900 dark:text-white">{recipe.name}</h2><p className="mt-1 text-xs uppercase tracking-wider text-orange-500">{recipe.category}</p></div>{recipe.isAvailable && <CircleCheck size={19} className="shrink-0 text-emerald-500" />}</div><p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{recipe.description}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700"><span className="font-bold text-orange-500">₹{recipe.price}</span><span className="text-sm text-slate-500 dark:text-slate-400">{recipe.preparationTime}</span></div></div></article>)}</div>}
    </section>
  );
};

export default Recipes;