import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Floating food items
  const foods = ["🍔", "🍕", "🌮", "🍣", "🍜", "🥗", "🍟", "🍩"];

  useEffect(() => {
    // Show skip button after 1 second
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    // Smooth progress from 0 → 100
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);

    // Auto navigate after ~3.2s
    const navTimer = setTimeout(() => {
      handleNavigate();
    }, 3200);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(navTimer);
      clearInterval(progressInterval);
    };
  }, []);

  const handleNavigate = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => navigate("/auth"), 500);
  };

  return (
    <div
      onClick={handleNavigate}
      className={`relative min-h-screen overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-500
        ${isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"}
        bg-gradient-to-br from-orange-500 via-rose-500 to-purple-600`}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Floating food emojis */}
      {foods.map((food, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-20 animate-float pointer-events-none select-none"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${15 + (i * 17) % 70}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }}
        >
          {food}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center text-white px-6">
        {/* Logo circle with bounce + glow */}
        <div className="relative mx-auto mb-8 w-28 h-28">
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
          <div className="relative w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl animate-bounce-slow">
            <span className="text-6xl drop-shadow-lg">🍔</span>
          </div>
        </div>

        {/* Brand name with staggered animation */}
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3 animate-slide-up">
          <span className="text-yellow-300">Rasoi</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/90 font-medium mb-10 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          Delicious food, delivered to you
        </p>

        {/* Custom progress bar */}
        <div className="mx-auto w-48 sm:w-56 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="h-1.5 w-full bg-white/25 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 via-white to-yellow-200 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-white/70 tracking-widest uppercase">
            Loading experience...
          </p>
        </div>

        {/* Skip button */}
        {showSkip && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="mt-10 px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-sm font-medium transition-all duration-300 hover:scale-105 animate-fade-in"
          >
            Skip →
          </button>
        )}
      </div>

      {/* Bottom decorative text */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-xs tracking-widest uppercase">
        Fresh • Fast • Delicious
      </div>

      {/* Custom CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out both;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}

export default Welcome;