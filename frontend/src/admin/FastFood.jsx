import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const FastFood = () => {
  // Modal states
  const [showModal, setShowModal] = useState(false); // Add modal
  const [modal2, setModal2] = useState(false);       // Edit modal

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preparationTime, setPreparationTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [category, setCategory] = useState("fastfood");
  const [selectId, setSelectId] = useState(null);

  // Data states
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  // ===================== GET ALL RECIPES =====================
  const getsData = async () => {
    try {
      const res = await axios.get("https://rasoi-backend1.onrender.com/api/getall/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecipes((res.data.data || []).filter((recipe) => recipe.category === "fastfood"));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getsData();
  }, []);

  // ===================== CREATE RECIPE =====================
  const submit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!image) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select an image",
        });
      }

      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("image", image);
      form.append("preparationTime", preparationTime);
      form.append("isAvailable", isAvailable);
      form.append("category", category);

      const res = await axios.post("https://rasoi-backend1.onrender.com/api/create", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setPreparationTime("");
      setIsAvailable(true);
      setCategory("fastfood");
      setShowModal(false);

      getsData(); // refresh list

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Recipe uploaded successfully",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  // ===================== UPDATE RECIPE =====================
  const updates = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const updateForm = new FormData();
      updateForm.append("name", name);
      updateForm.append("description", description);
      updateForm.append("price", price);
      updateForm.append("preparationTime", preparationTime);
      updateForm.append("isAvailable", isAvailable);
      updateForm.append("category", category);

      // Only send new image if user selected one
      if (image) {
        updateForm.append("image", image);
      }

      const res = await axios.put(
        `https://rasoi-backend1.onrender.com/api/update/${selectId}`,
        updateForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Recipe updated successfully",
      });

      setModal2(false);
      getsData();

      // Reset
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setPreparationTime("");
      setIsAvailable(true);
      setSelectId(null);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Recipe is not updated",
      });
    }
  };

  // ===================== DELETE RECIPE =====================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this recipe?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://rasoi-backend1.onrender.com/api/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Recipe has been deleted.",
        });

        getsData();
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Failed to delete",
        });
      }
    }
  };

  // ===================== TOGGLE AVAILABILITY =====================
  const toggleAvailability = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://rasoi-backend1.onrender.com/api/update/${id}`,
        { isAvailable: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getsData();
    } catch (err) {
      console.log(err);
    }
  };

  // ===================== OPEN EDIT MODAL =====================
  const openEditModal = (recipe) => {
    setSelectId(recipe._id);
    setName(recipe.name);
    setDescription(recipe.description);
    setPrice(recipe.price);
    setPreparationTime(recipe.preparationTime);
    setIsAvailable(recipe.isAvailable);
    setCategory(recipe.category || "fastfood");
    setImage(null);
    setModal2(true);
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Image URL helper
  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
    if (img.startsWith("http")) return img;
    const imagePath = img.replace(/^\/+/, "").replace(/\s+/g, "%20");
    return `http://localhost:5000/${imagePath.startsWith("uploads/") ? imagePath : `uploads/${imagePath}`}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Fast Food Recipes
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {recipes.length} items • Manage your Fast Food menu
          </p>
        </div>

        <button
          onClick={() => {
            setName("");
            setDescription("");
            setPrice("");
            setImage(null);
            setPreparationTime("");
            setIsAvailable(true);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 active:scale-95"
        >
          <Plus size={18} />
          Add Recipe
        </button>
      </div>

      {/* Search + Stats */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Fast Food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex gap-3 text-sm">
          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 dark:bg-green-500/20 dark:text-green-400">
            {recipes.filter((r) => r.isAvailable).length} Available
          </span>
          <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 dark:bg-red-500/20 dark:text-red-400">
            {recipes.filter((r) => !r.isAvailable).length} Unavailable
          </span>
        </div>
      </div>

      {/* ===================== DATA TABLE ===================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Prep Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecipes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-500">
                    No recipes found. Click "Add Recipe" to create one.
                  </td>
                </tr>
              ) :
               (
                filteredRecipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/40"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(recipe.image)}
                        alt={recipe.name}
                        className="h-14 w-14 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {recipe.name}
                      </p>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate text-sm text-slate-500 dark:text-slate-400">
                        {recipe.description}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-semibold text-orange-500">
                        <IndianRupee size={15} />
                        {recipe.price}
                      </div>
                    </td>

                    {/* Prep Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                        <Clock size={14} />
                        {recipe.preparationTime}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          toggleAvailability(recipe._id, recipe.isAvailable)
                        }
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                          recipe.isAvailable
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {recipe.isAvailable ? (
                          <>
                            <CheckCircle2 size={12} /> Available
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> Unavailable
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(recipe)}
                          className="rounded-lg p-2 text-blue-500 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== ADD RECIPE MODAL ===================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Add New Fast Food
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="max-h-[80vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ex: Chicken Burger"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    placeholder="Write a short description..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                    placeholder="120"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preparation Time *
                  </label>
                  <input
                    type="text"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    required
                    placeholder="15 mins"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Image File *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value="fastfood"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-7">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Available for ordering
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== EDIT RECIPE MODAL ===================== */}
      {modal2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Fast Food Recipe
              </h2>
              <button
                onClick={() => setModal2(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={updates} className="max-h-[80vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Preparation Time *
                  </label>
                  <input
                    type="text"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Image (optional - leave empty to keep old image)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value="fastfood"
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-7">
                  <input
                    type="checkbox"
                    id="isAvailableEdit"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label
                    htmlFor="isAvailableEdit"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Available for ordering
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModal2(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600"
                >
                  Update Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastFood;
