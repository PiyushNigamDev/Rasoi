import { ArrowLeft, ArrowRight, Clock3, Leaf, MapPin, ShieldCheck, Star, Truck } from "lucide-react";
import { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const trustSignals = [
  { icon: Truck, label: "Fast delivery", value: "15-20 min" },
  { icon: Leaf, label: "Made fresh", value: "Every order" },
  { icon: ShieldCheck, label: "Secure checkout", value: "100% protected" },
];

const foodSlides = [
  {
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=2200&q=85",
    alt: "Freshly prepared bowl with vegetables and grains",
    label: "Fresh bowls",
  },
  {
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=2200&q=85",
    alt: "Aromatic chicken biryani with herbs",
    label: "Comfort classics",
  },
  {
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=2200&q=85",
    alt: "Chocolate cake with creamy frosting",
    label: "Sweet finishes",
  },
  {
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=2200&q=85",
    alt: "Colorful fresh salad with vegetables",
    label: "Light and bright",
  },
];

function Hero() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = foodSlides[slideIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % foodSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const previousSlide = () => setSlideIndex((current) => (current - 1 + foodSlides.length) % foodSlides.length);
  const nextSlide = () => setSlideIndex((current) => (current + 1) % foodSlides.length);

  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-slate-950 text-white sm:min-h-[720px]">
      <img
        key={slide.image}
        src={slide.image}
        alt={slide.alt}
        className="absolute inset-0 -z-20 h-full w-full animate-fade-in object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/70" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.82)_38%,rgba(2,6,23,0.22)_78%,rgba(2,6,23,0.42)_100%)]" />

      <div className="mx-auto flex min-h-[680px] max-w-7xl items-center px-5 pb-16 pt-24 sm:min-h-[720px] sm:px-8 lg:pb-20">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-200 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_0_5px_rgba(251,146,60,0.18)]" />
            Rasoi · Delivery only
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            Good food,
            <span className="block text-orange-300">right on time.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Restaurant-quality meals prepared fresh by local kitchen partners and delivered warm to your door.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" className="group inline-flex items-center justify-center gap-3 rounded-full bg-orange-500 px-7 py-4 text-sm font-bold text-white shadow-2xl shadow-orange-950/40 transition hover:bg-orange-400 hover:shadow-orange-500/30">
              Explore the menu
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/menu/dessert" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20">
              Browse desserts
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/15 pt-5">
            <div className="flex items-center gap-2 text-sm text-white/90"><Star size={17} className="fill-orange-300 text-orange-300" /><strong>4.9/5</strong><span className="text-white/60">from 500+ diners</span></div>
            <div className="flex items-center gap-2 text-sm text-white/70"><MapPin size={16} className="text-orange-300" />Serving Lucknow and nearby</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {trustSignals.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-4 sm:px-6 first:sm:pl-0 last:sm:pr-0">
              {createElement(Icon, { size: 20, className: "text-orange-300" })}
              <div><p className="text-xs text-white/60">{label}</p><p className="mt-0.5 text-sm font-semibold text-white">{value}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-6 top-28 hidden rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md lg:block">
        <div className="flex items-center gap-3"><Clock3 size={20} className="text-orange-300" /><div><p className="text-xs text-white/60">Kitchen is open</p><p className="text-sm font-bold">Taking orders now</p></div></div>
      </div>

      <div className="absolute bottom-24 right-5 flex items-center gap-3 sm:bottom-24 sm:right-8">
        <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:block">{slide.label}</span>
        <button onClick={previousSlide} aria-label="Previous food slide" className="rounded-full border border-white/30 bg-black/20 p-2 text-white backdrop-blur transition hover:bg-white/20"><ArrowLeft size={16} /></button>
        <button onClick={nextSlide} aria-label="Next food slide" className="rounded-full bg-orange-500 p-2 text-white transition hover:bg-orange-400"><ArrowRight size={16} /></button>
        <div className="flex gap-1.5 pl-1">{foodSlides.map((item, index) => <button key={item.image} onClick={() => setSlideIndex(index)} aria-label={`Show ${item.label}`} className={`h-1.5 rounded-full transition-all ${index === slideIndex ? "w-7 bg-orange-300" : "w-1.5 bg-white/50"}`} />)}</div>
      </div>

      <style>{`@keyframes fade-in { from { opacity: 0.35; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } } .animate-fade-in { animation: fade-in 0.7s ease-out; }`}</style>
    </section>
  );
}

export default Hero;
