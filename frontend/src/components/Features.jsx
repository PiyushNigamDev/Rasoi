import { useState, useEffect, useRef } from "react";

function Features() {
  const [activeCard, setActiveCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      icon: "⚡",
      title: "Lightning Fast Delivery",
      description:
        "Optimized Rasoi kitchen + smart routing. Your food arrives hot in under 20 minutes, every single time.",
      color: "from-orange-400 to-amber-500",
      delay: "0ms",
      direction: "left", // comes from left
    },
    {
      id: 2,
      icon: "👨‍🍳",
      title: "Chef-Crafted Meals",
      description:
        "Professional chefs cook every order with premium ingredients. No shortcuts, only real restaurant quality.",
      color: "from-rose-400 to-pink-500",
      delay: "150ms",
      direction: "right", // comes from right
    },
    {
      id: 3,
      icon: "🌿",
      title: "100% Fresh & Hygienic",
      description:
        "Daily fresh ingredients and strict hygiene standards in a dedicated delivery-only kitchen.",
      color: "from-emerald-400 to-green-500",
      delay: "300ms",
      direction: "left",
    },
    {
      id: 4,
      icon: "📱",
      title: "Easy Ordering & Tracking",
      description:
        "Order in a few taps and track your meal live — from kitchen to your doorstep in real time.",
      color: "from-blue-400 to-cyan-500",
      delay: "450ms",
      direction: "right",
    },
    {
      id: 5,
      icon: "🍽️",
      title: "Multiple Cuisines",
      description:
        "Burgers, Pizza, Biryani, Chinese, Healthy bowls and more — all from one powerful Rasoi kitchen.",
      color: "from-violet-400 to-purple-500",
      delay: "600ms",
      direction: "left",
    },
    {
      id: 6,
      icon: "💰",
      title: "Best Prices Guaranteed",
      description:
        "No restaurant overhead means better prices for you. Premium food without the premium cost.",
      color: "from-yellow-400 to-orange-500",
      delay: "750ms",
      direction: "right",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-white via-orange-50/40 to-white"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.9s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-semibold mb-5">
            <span className="text-base">✨</span>
            Why Rasoi?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Built for Speed.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Designed for Taste.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            We removed the dining hall so we could focus 100% on cooking and
            delivery. The result? Faster service, fresher food, and better
            prices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              onMouseEnter={() => setActiveCard(feature.id)}
              onMouseLeave={() => setActiveCard(null)}
              className={`group relative transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0 translate-y-0"
                  : feature.direction === "left"
                  ? "opacity-0 -translate-x-20 translate-y-8"
                  : "opacity-0 translate-x-20 translate-y-8"
              }`}
              style={{
                transitionDelay: isVisible ? feature.delay : "1ms",
              }}
            >
              {/* Card */}
              <div
                className={`relative h-full rounded-3xl p-7 sm:p-8 border bg-white/80 backdrop-blur-sm
                  transition-all duration-500 cursor-pointer overflow-hidden
                  ${
                    activeCard === feature.id
                      ? `border-orange-200 shadow-2xl shadow-orange-200/50 -translate-y-2 scale-[1.02]`
                      : "border-gray-100 shadow-md hover:shadow-xl"
                  }`}
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-br ${feature.color} mix-blend-overlay`}
                  style={{ opacity: activeCard === feature.id ? 1 : 0 }}
                />

                {/* Animated icon container */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                      transition-all duration-500 bg-gradient-to-br ${feature.color}
                      shadow-lg group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}
                  >
                    <span className="drop-shadow-md">{feature.icon}</span>
                  </div>

                  {/* Pulsing ring */}
                  <div
                    className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} 
                      opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 blur-md`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} 
                    transition-all duration-500 rounded-full
                    ${
                      activeCard === feature.id
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                />

                {/* Corner decoration */}
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${feature.color} opacity-20`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats / Trust Bar */}
        <div
          className={`mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {[
            { value: "20min", label: "Max Delivery", icon: "🚀" },
            { value: "100%", label: "Fresh Ingredients", icon: "🥬" },
            { value: "0", label: "Dine-in Tables", icon: "🪑" },
            { value: "24/7", label: "Order Support", icon: "💬" },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">
                {item.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-orange-500 transition-colors">
                {item.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;