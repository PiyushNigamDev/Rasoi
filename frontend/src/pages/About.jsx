import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  const [counters, setCounters] = useState({
    customers: 0,
    dishes: 0,
    years: 0,
    rating: 0,
  });

  const [openFaq, setOpenFaq] = useState(null);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const targets = { customers: 12500, dishes: 850, years: 6, rating: 4.9 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        customers: Math.floor(targets.customers * progress),
        dishes: Math.floor(targets.dishes * progress),
        years: Math.floor(targets.years * progress),
        rating: Number((targets.rating * progress).toFixed(1)),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
  };

  const team = [
    {
      name: "Aarav Sharma",
      role: "Founder & Head Chef",
      emoji: "👨‍🍳",
      bio: "Passionate about bringing authentic home-style flavors to your doorstep.",
    },
    {
      name: "Priya Patel",
      role: "Operations Manager",
      emoji: "👩‍💼",
      bio: "Ensures every order is delivered hot, fresh, and on time.",
    },
    {
      name: "Rohan Mehta",
      role: "Tech Lead",
      emoji: "👨‍💻",
      bio: "Building the smoothest food ordering experience possible.",
    },
    {
      name: "Sneha Gupta",
      role: "Customer Success",
      emoji: "💬",
      bio: "Your happiness is our top priority — always.",
    },
  ];

  const values = [
    {
      title: "Fresh Ingredients",
      desc: "We source the freshest local produce every single morning.",
      emoji: "🥬",
    },
    {
      title: "Fast Delivery",
      desc: "Average delivery time under 30 minutes across the city.",
      emoji: "⚡",
    },
    {
      title: "Hygienic Kitchen",
      desc: "FSSAI certified kitchen with strict hygiene protocols.",
      emoji: "🧼",
    },
    {
      title: "Made with Love",
      desc: "Every dish is prepared by passionate home chefs.",
      emoji: "❤️",
    },
  ];

  const faqs = [
    {
      q: "Is Rasoi a real restaurant?",
      a: "Rasoi is a professional commercial kitchen focused only on delivery. No dine-in, just pure focus on food quality and speed.",
    },
    {
      q: "How do you keep food fresh during delivery?",
      a: "We use insulated packaging and partner with reliable delivery partners to ensure your food arrives hot and fresh.",
    },
    {
      q: "Can I customize my order?",
      a: "Yes! Most of our dishes support customizations like spice level, extra toppings, or dietary preferences.",
    },
    {
      q: "Do you have vegetarian / vegan options?",
      a: "Absolutely. We have a wide range of vegetarian and vegan dishes clearly marked on the menu.",
    },
  ];

  return (
    <>
    <Navbar/>
     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-rose-200/25 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating emojis */}
      <div className="absolute top-24 left-10 text-4xl opacity-20 animate-float hidden md:block">🍕</div>
      <div className="absolute top-40 right-16 text-3xl opacity-20 animate-float hidden md:block" style={{ animationDelay: "0.8s" }}>🍔</div>
      <div className="absolute bottom-40 left-20 text-3xl opacity-20 animate-float hidden md:block" style={{ animationDelay: "1.5s" }}>🌮</div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-16 pb-12 px-5 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span>🏠</span> About Rasoi
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              We cook. You relax.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                Deliciousness delivered.
              </span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
              Rasoi was born from a simple idea — great food shouldn't require leaving your home.
              We bring restaurant-quality meals straight to your door.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-12 px-5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Happy Customers", value: counters.customers.toLocaleString() + "+", emoji: "😊" },
              { label: "Dishes Served", value: counters.dishes.toLocaleString() + "+", emoji: "🍽️" },
              { label: "Years of Love", value: counters.years + "+", emoji: "📅" },
              { label: "Average Rating", value: counters.rating, emoji: "⭐" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg shadow-orange-100/50 border border-white hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-5">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl shadow-orange-100/40 border border-white">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                Our Story 📖
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2019, our founder Aarav started cooking for friends from a small home kitchen.
                  The feedback was so good that we decided to turn this passion into something bigger.
                </p>
                <p>
                  Today, Rasoi operates from a fully equipped commercial kitchen with a team of
                  talented chefs who believe that food is love made edible. We focus only on delivery —
                  no tables, no waiters — just pure focus on making the best possible food.
                </p>
                <p>
                  Every order is prepared fresh after you place it. No pre-cooked food sitting under heat lamps.
                  Just real food, made real-time, delivered fast.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 px-5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
              What We Stand For ✨
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white
                    hover:shadow-orange-200 hover:-translate-y-2 transition-all duration-300 cursor-default"
                >
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
              Meet the Team 👋
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
              The people who make the magic happen every day
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white
                    hover:shadow-xl hover:shadow-orange-100 transition-all duration-300"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center text-4xl
                    group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                    {member.emoji}
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-orange-500 font-medium">{member.role}</p>
                  <p className="mt-3 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">
              Frequently Asked Questions ❓
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-gray-800 hover:bg-orange-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-xl transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  <div
                    className={`px-6 text-gray-600 text-sm overflow-hidden transition-all duration-300 ${
                      openFaq === i ? "max-h-40 pb-4" : "max-h-0"
                    }`}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl p-10 sm:p-12 shadow-2xl shadow-orange-500/30 text-white">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Hungry already? 😋
              </h2>
              <p className="text-orange-100 mb-8 text-lg">
                Browse our menu and get your favorite food delivered in minutes.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl
                  hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg"
              >
                Order Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center pb-10 text-sm text-gray-400">
          Made with 🧡 by Rasoi Team
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(5deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
        </>

  );
}

export default About;