import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CakeSlice, Clock, IndianRupee } from "lucide-react";
import axios from "axios";
import { API_BASE_URL, getImageUrl } from "../services/api";
import { useNavigate } from "react-router-dom";

const fallbackDesserts = [
  { name: "Chocolate Delight", description: "Rich chocolate dessert for a sweet finish", price: 149, preparationTime: "10 mins", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&q=80" },
  { name: "Strawberry Cheesecake", description: "Creamy cheesecake with fresh strawberry topping", price: 179, preparationTime: "15 mins", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1000&q=80" },
  { name: "Gulab Jamun", description: "Soft sweet dumplings in fragrant syrup", price: 99, preparationTime: "8 mins", image: "https://images.unsplash.com/photo-1666195403996-0c17dde1d43c?w=1000&q=80" },
];

const DessertSlideshow = () => {
  const [desserts, setDesserts] = useState(fallbackDesserts);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;
    axios.get(`${API_BASE_URL}/api/getall`).then((response) => {
      const items = (response.data.data || []).filter((recipe) => recipe.category === "dessert" && recipe.isAvailable !== false);
      if (active && items.length) setDesserts(items);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % desserts.length), 4500);
    return () => window.clearInterval(timer);
  }, [desserts.length]);

  const dessert = desserts[activeIndex % desserts.length];
  const previous = () => setActiveIndex((index) => (index - 1 + desserts.length) % desserts.length);
  const next = () => setActiveIndex((index) => (index + 1) % desserts.length);
const nav=useNavigate();
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
      <div onClick={()=>nav("/menu/dessert")} className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Sweet spotlight</p><h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Dessert of the moment</h2><p className="mt-2 text-slate-500">Finish your meal with something special.</p></div>
          <div className="flex items-center gap-2"><button onClick={previous} aria-label="Previous dessert" className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition hover:border-orange-400 hover:text-orange-500"><ArrowLeft size={18} /></button><button onClick={next} aria-label="Next dessert" className="rounded-full bg-orange-500 p-2.5 text-white transition hover:bg-orange-600"><ArrowRight size={18} /></button></div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-slate-950 shadow-2xl sm:min-h-[380px]">
          <img src={getImageUrl(dessert.image)} alt={dessert.name} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-transparent" />
          <div className="relative flex min-h-[300px] max-w-xl flex-col justify-center p-7 text-white sm:min-h-[380px] sm:p-12"><span className="flex w-fit items-center gap-2 rounded-full bg-orange-500/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"><CakeSlice size={14} /> Dessert</span><h3 className="mt-5 text-3xl font-extrabold sm:text-5xl">{dessert.name}</h3><p className="mt-3 max-w-md text-sm leading-6 text-white/75 sm:text-base">{dessert.description}</p><div className="mt-6 flex items-center gap-5 text-sm"><span className="flex items-center gap-1 font-bold text-orange-300"><IndianRupee size={16} />{dessert.price}</span><span className="flex items-center gap-1 text-white/70"><Clock size={15} />{dessert.preparationTime}</span></div><div className="mt-7 flex gap-2">{desserts.map((item, index) => <button key={`${item.name}-${index}`} onClick={() => setActiveIndex(index)} aria-label={`Show ${item.name}`} className={`h-2 rounded-full transition-all ${index === activeIndex % desserts.length ? "w-8 bg-orange-400" : "w-2 bg-white/40"}`} />)}</div></div>
        </div>
      </div>
    </section>
  );
};

export default DessertSlideshow;
