import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-[#0f0f1a] text-gray-300 overflow-hidden">
      {/* Top decorative line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-purple-500" />

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/home" className="inline-flex items-center gap-2.5 group mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                🍔
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  <span className="text-orange-400">Rasoi</span>
                </span>
                <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase mt-0.5">
                  Fresh & Fast
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Rasoi delivers restaurant-quality meals straight to your door. No dine-in, only delicious.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { name: "Instagram", icon: "📸", href: "#" },
                { name: "Facebook", icon: "📘", href: "#" },
                { name: "Twitter", icon: "🐦", href: "#" },
                { name: "YouTube", icon: "▶️", href: "#" },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg
                    hover:bg-gradient-to-br hover:from-orange-500 hover:to-rose-500 hover:border-transparent
                    hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/auth" },
                { name: "Menu", path: "/menu" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Track Order", path: "/track" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Help Center", path: "/help" },
                { name: "FAQs", path: "/faq" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Refund Policy", path: "/refund" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">
              For Partners
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/vendor/login" className="text-sm text-gray-400 hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="text-sm text-gray-400 hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-300">
                  Register as Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">
              Get in Touch
            </h4>

            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-sm">
                <span className="text-lg mt-0.5">📍</span>
                <span className="text-gray-400">
                  Rasoi Hub,<br />
                  Hussainganj, Lucknow, India
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-lg">📞</span>
                <a href="tel:+919876543210" className="text-gray-400 hover:text-orange-400 transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-lg">✉️</span>
                <a href="mailto:hello@rasoi.com" className="text-gray-400 hover:text-orange-400 transition-colors">
                  hello@rasoi.com
                </a>
              </li>
            </ul>

            {/* Mini Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500
                  focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50 transition-all"
              />
              <button
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-semibold
                  hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            © {currentYear} Rasoi. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open 24/7
            </span>
            <span>Made with ❤️ for food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;