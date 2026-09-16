import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CheckCircle2, Clock, Edit2, IndianRupee, Plus, Search, Trash2, X, XCircle } from "lucide-react";
import { API_BASE_URL, getImageUrl } from "../services/api";

const blankForm = { name: "", description: "", price: "", preparationTime: "", isAvailable: true, image: null };

const CategoryManager = ({ category, title }) => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankForm);
  const token = localStorage.getItem("token");

  const loadRecipes = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/getall`, { headers: { Authorization: `Bearer ${token}` } });
    setRecipes((response.data.data || []).filter((recipe) => recipe.category === category));
  };

  useEffect(() => {
    let active = true;
    axios.get(`${API_BASE_URL}/api/getall`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      if (active) setRecipes((response.data.data || []).filter((recipe) => recipe.category === category));
    }).catch(() => { if (active) setRecipes([]); });
    return () => { active = false; };
  }, [category, token]);

  const closeModal = () => { setModal(null); setForm(blankForm); };
  const openAdd = () => { setForm(blankForm); setModal({ mode: "add" }); };
  const openEdit = (recipe) => { setForm({ name: recipe.name, description: recipe.description, price: recipe.price, preparationTime: recipe.preparationTime, isAvailable: recipe.isAvailable, image: null }); setModal({ mode: "edit", recipe }); };
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const isEdit = modal?.mode === "edit";
    if (!isEdit && !form.image) return Swal.fire({ icon: "warning", title: "Image required", text: "Please select a recipe image" });
    const data = new FormData();
    data.append("name", form.name); data.append("description", form.description); data.append("price", form.price); data.append("preparationTime", form.preparationTime); data.append("isAvailable", form.isAvailable); data.append("category", category);
    if (form.image) data.append("image", form.image);
    try {
      await axios({ method: isEdit ? "put" : "post", url: isEdit ? `${API_BASE_URL}/api/update/${modal.recipe._id}` : `${API_BASE_URL}/api/create`, data, headers: { Authorization: `Bearer ${token}` } });
      closeModal(); await loadRecipes();
      Swal.fire({ icon: "success", title: isEdit ? "Recipe updated" : "Recipe added", timer: 1200, showConfirmButton: false });
    } catch (error) { Swal.fire({ icon: "error", title: "Could not save recipe", text: error.response?.data?.message || error.message }); }
  };

  const toggleAvailability = async (recipe) => {
    try { await axios.put(`${API_BASE_URL}/api/update/${recipe._id}`, { isAvailable: !recipe.isAvailable }, { headers: { Authorization: `Bearer ${token}` } }); await loadRecipes(); }
    catch (error) { Swal.fire({ icon: "error", title: "Could not update status", text: error.response?.data?.message || error.message }); }
  };

  const remove = async (id) => {
    const result = await Swal.fire({ title: "Delete this recipe?", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444" });
    if (!result.isConfirmed) return;
    try { await axios.delete(`${API_BASE_URL}/api/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } }); await loadRecipes(); Swal.fire({ icon: "success", title: "Recipe deleted", timer: 1100, showConfirmButton: false }); }
    catch (error) { Swal.fire({ icon: "error", title: "Could not delete recipe", text: error.response?.data?.message || error.message }); }
  };

  const filtered = recipes.filter((recipe) => recipe.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title} Recipes</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{recipes.length} items • Manage your {title.toLowerCase()} menu</p></div><button onClick={openAdd} className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"><Plus size={18} />Add Recipe</button></div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${title}...`} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div><div className="flex gap-3 text-sm"><span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 dark:bg-green-500/20 dark:text-green-400">{recipes.filter((recipe) => recipe.isAvailable).length} Available</span><span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 dark:bg-red-500/20 dark:text-red-400">{recipes.filter((recipe) => !recipe.isAvailable).length} Unavailable</span></div></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="overflow-x-auto"><table className="w-full min-w-[900px]"><thead><tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"><th className="px-6 py-4">Image</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Prep Time</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th></tr></thead><tbody>{filtered.length === 0 ? <tr><td colSpan="7" className="px-6 py-16 text-center text-slate-500">No recipes found. Click “Add Recipe” to create one.</td></tr> : filtered.map((recipe) => <tr key={recipe._id} className="border-b border-slate-50 transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/40"><td className="px-6 py-4"><img src={getImageUrl(recipe.image)} alt={recipe.name} className="h-14 w-14 rounded-xl object-cover" /></td><td className="px-6 py-4"><p className="font-semibold text-slate-800 dark:text-white">{recipe.name}</p></td><td className="px-6 py-4"><p className="max-w-xs truncate text-sm text-slate-500 dark:text-slate-400">{recipe.description}</p></td><td className="px-6 py-4"><div className="flex items-center gap-1 font-semibold text-orange-500"><IndianRupee size={15} />{recipe.price}</div></td><td className="px-6 py-4"><div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"><Clock size={14} />{recipe.preparationTime}</div></td><td className="px-6 py-4"><button onClick={() => toggleAvailability(recipe)} className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${recipe.isAvailable ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"}`}>{recipe.isAvailable ? <><CheckCircle2 size={12} />Available</> : <><XCircle size={12} />Unavailable</>}</button></td><td className="px-6 py-4"><div className="flex items-center gap-2"><button onClick={() => openEdit(recipe)} className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50"><Edit2 size={16} /></button><button onClick={() => remove(recipe._id)} className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></div>
      {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-800"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{modal.mode === "edit" ? "Edit" : "Add New"} {title} Recipe</h2><button onClick={closeModal} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20} /></button></div><form onSubmit={submit} className="max-h-[80vh] overflow-y-auto p-6"><div className="grid grid-cols-1 gap-5 md:grid-cols-2"><div className="md:col-span-2"><label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Recipe Name *</label><input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ex: Chocolate Cake" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div><div className="md:col-span-2"><label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label><textarea required rows={3} value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Write a short description..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div><div><label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Price (₹) *</label><input required min="1" type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} placeholder="120" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div><div><label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Preparation Time *</label><input required value={form.preparationTime} onChange={(event) => updateField("preparationTime", event.target.value)} placeholder="15 mins" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div><div className="md:col-span-2"><label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Image File {modal.mode === "add" ? "*" : "(optional)"}</label><input required={modal.mode === "add"} type="file" accept="image/*" onChange={(event) => updateField("image", event.target.files?.[0] || null)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white" /></div><div><label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label><input value={category} disabled className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400" /></div><div className="flex items-center gap-3 pt-7"><input type="checkbox" checked={form.isAvailable} onChange={(event) => updateField("isAvailable", event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-500" /><label className="text-sm font-medium text-slate-700 dark:text-slate-300">Available for ordering</label></div></div><div className="mt-8 flex justify-end gap-3"><button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium dark:border-slate-600">Cancel</button><button type="submit" className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30">{modal.mode === "edit" ? "Update Recipe" : "Save Recipe"}</button></div></form></div></div>}
    </section>
  );
};

export default CategoryManager;
