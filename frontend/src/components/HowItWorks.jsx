import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 1,
      number: "01",
      icon: "📱",
      title: "Browse Menu",
      description:
        "Explore hundreds of dishes from our Rasoi kitchen. Filter by cuisine, price, or dietary preference.",
      color: "from-orange-400 to-amber-500",
      bgGlow: "bg-orange-400",
    },
    {
      id: 2,
      number: "02",
      icon: "🛒",
      title: "Place Order",
      description:
        "Add your favorites to cart, customize as you like, and checkout in seconds with secure payment.",
      color: "from-rose-400 to-pink-500",
      bgGlow: "bg-rose-400",
    },
    {
      id: 3,
      number: "03",
      icon: "👨‍🍳",
      title: "We Cook Fresh",
      description:
        "Our chefs start preparing your meal the moment you order. No pre-cooked food — only fresh.",
      color: "from-violet-400 to-purple-500",
      bgGlow: "bg-violet-400",
    },
    {
      id: 4,
      number: "04",
      icon: "🚀",
      title: "Fast Delivery",
      description:
        "Hot food reaches your door in 15–20 minutes. Track every step live on your phone.",
      color: "from-emerald-400 to-green-500",
      bgGlow: "bg-emerald-400",
    },
  ];

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto play steps
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-white via-rose-50/30 to-white"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-orange-200/25 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 sm:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-600 text-sm font-semibold mb-5">
            <span>🔄</span>
            Simple Process
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            How Rasoi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Works
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600">
            From craving to doorstep in just 4 simple steps. No complicated
            process — just pure speed and taste.
          </p>
        </div>

        {/* Steps + Preview */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Steps List */}
          <div className="space-y-5">
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setActiveStep(index)}
                className={`group relative flex gap-5 p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-500 border ${
                  activeStep === index
                    ? "bg-white border-orange-200 shadow-xl shadow-orange-100 -translate-y-1 scale-[1.02]"
                    : "bg-white/60 border-transparent hover:bg-white hover:border-gray-100 hover:shadow-md"
                } ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-16"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 120}ms` : "0ms",
                }}
              >
                {/* Number + Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl
                      transition-all duration-500 bg-gradient-to-br ${step.color} text-white shadow-lg
                      ${activeStep === index ? "scale-110 rotate-6" : "group-hover:scale-105"}`}
                  >
                    {step.icon}
                  </div>

                  {/* Active ring */}
                  {activeStep === index && (
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-40 animate-ping`}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                        activeStep === index ? "text-orange-500" : "text-gray-400"
                      }`}
                    >
                      Step {step.number}
                    </span>
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                      activeStep === index ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`mt-1.5 text-sm leading-relaxed transition-all duration-300 ${
                      activeStep === index
                        ? "text-gray-600 opacity-100 max-h-24"
                        : "text-gray-500 opacity-80 max-h-12 overflow-hidden"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Active indicator bar */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 rounded-full transition-all duration-500 ${
                    activeStep === index
                      ? `h-12 bg-gradient-to-b ${step.color}`
                      : "h-0 bg-transparent"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Right - Interactive Preview Card */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
          >
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-orange-200/40 border border-orange-100 overflow-hidden">
                {/* Top bar */}
                <div
                  className={`h-1.5 bg-gradient-to-r transition-all duration-700 ${steps[activeStep].color}`}
                />

                <div className="p-8 sm:p-10">
                  {/* Big Icon */}
                  <div className="relative flex justify-center mb-8">
                    <div
                      className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-6xl sm:text-7xl
                        bg-gradient-to-br ${steps[activeStep].color} shadow-2xl
                        transition-all duration-700 animate-bounce-slow`}
                    >
                      {steps[activeStep].icon}
                    </div>

                    {/* Orbiting dots */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 sm:w-44 sm:h-44 border-2 border-dashed border-orange-200 rounded-full animate-spin-slow opacity-60" />
                    </div>
                  </div>

                  {/* Step Info */}
                  <div className="text-center space-y-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase
                        bg-gradient-to-r ${steps[activeStep].color} text-white`}
                    >
                      Step {steps[activeStep].number}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 transition-all duration-500">
                      {steps[activeStep].title}
                    </h3>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                      {steps[activeStep].description}
                    </p>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2.5 mt-8">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          activeStep === i
                            ? `w-8 bg-gradient-to-r ${steps[i].color}`
                            : "w-2 bg-gray-200 hover:bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2 border border-orange-100 animate-float">
                <span className="text-lg">⏱️</span>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium uppercase">Total Time</p>
                  <p className="text-sm font-bold text-gray-900">~18 min</p>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2.5 flex items-center gap-2 border border-orange-100 animate-float"
                style={{ animationDelay: "0.8s" }}
              >
                <span className="text-lg">✅</span>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium uppercase">Success Rate</p>
                  <p className="text-sm font-bold text-gray-900">99.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 sm:mt-20 text-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white
              bg-gradient-to-r from-orange-500 to-rose-500 shadow-lg shadow-orange-500/30
              hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300"
          >
            Start Ordering Now
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;