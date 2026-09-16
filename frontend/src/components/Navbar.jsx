 import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import {
  ChevronDown,
  LoaderCircle,
  MapPin,
  Search,
  ShoppingBag,
  X,
  Menu,
  Home,
  Utensils,
  Info,
  Phone,
  LogOut,
  User,
  Navigation,
} from "lucide-react";

function Navbar() {
  // =====================================
  // STATES
  // =====================================

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [locationText, setLocationText] = useState(() => {
    try {
      return (
        localStorage.getItem("rasoi_location") ||
        localStorage.getItem("cloud_kitchen_location") ||
        "Detect Location"
      );
    } catch {
      return "Detect Location";
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();

  // =====================================
  // SCROLL EFFECT
  // =====================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =====================================
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // =====================================

  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // =====================================
  // READ SEARCH FROM URL
  // =====================================

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";

    setSearchQuery(search);
  }, [location.search]);

  // =====================================
  // OUTSIDE CLICK
  // =====================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================
  // NAVIGATION LINKS
  // =====================================

  const navLinks = [
    {
      name: "Home",
      path: "/auth",
      icon: Home,
    },
    {
      name: "Menu",
      path: "/menu",
      icon: Utensils,
    },
    {
      name: "About",
      path: "/about",
      icon: Info,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: Phone,
    },
  ];

  // =====================================
  // ACTIVE LINK
  // =====================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    logout();

    setIsProfileOpen(false);
    setIsMobileOpen(false);

    navigate("/auth");
  };

  // =====================================
  // SEARCH
  // =====================================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    navigate(
      query
        ? `/menu?search=${encodeURIComponent(query)}`
        : "/menu"
    );

    setIsSearchOpen(false);
  };

  // =====================================
  // LOCATION DETECTION
  // =====================================

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported");
      setLocationText("Not supported");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    setLocationText("Detecting...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`
          );

          if (!response.ok) {
            throw new Error("Unable to read location");
          }

          const data = await response.json();

          const area =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district ||
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Your Area";

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.state ||
            "";

          const resolvedLocation = city
            ? `${area}, ${city}`
            : area;

          setLocationText(resolvedLocation);

          localStorage.setItem(
            "rasoi_location",
            resolvedLocation
          );
        } catch {
          const coordinates = `${latitude.toFixed(
            2
          )}°, ${longitude.toFixed(2)}°`;

          setLocationText(coordinates);

          localStorage.setItem(
            "rasoi_location",
            coordinates
          );
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);

        let message = "Location denied";

        if (error.code === error.PERMISSION_DENIED) {
          message = "Permission denied";
        } else if (
          error.code === error.POSITION_UNAVAILABLE
        ) {
          message = "Unavailable";
        } else if (error.code === error.TIMEOUT) {
          message = "Timed out";
        }

        setLocationError(message);
        setLocationText(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // =====================================
  // RETURN
  // =====================================

  return (
    <>
      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          transition-all
          duration-300

          ${
            isScrolled
              ? "bg-white shadow-lg"
              : "bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500"
          }
        `}
      >
        {/* =====================================
            TOP SHINE
        ====================================== */}

        <div
          className={`
            absolute
            top-0
            left-0
            right-0
            h-[2px]

            ${
              isScrolled
                ? "bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400"
                : "bg-white/40"
            }
          `}
        />

        {/* =====================================
            MAIN CONTAINER
        ====================================== */}

        <div
          className="
            mx-auto
            max-w-7xl
            px-3
            sm:px-6
            lg:px-8
          "
        >
          {/* =====================================
              MAIN NAVBAR ROW
          ====================================== */}

          <div
            className={`
              flex
              items-center
              justify-between
              gap-2
              sm:gap-4

              transition-all
              duration-500

              ${
                isScrolled
                  ? "h-[64px] sm:h-[68px]"
                  : "h-[68px] sm:h-[76px]"
              }
            `}
          >
            {/* =====================================
                LOGO
            ====================================== */}

            <Link
              to="/auth"
              className="
                group
                flex
                items-center
                gap-2
                sm:gap-3
                shrink-0
              "
            >
              {/* Logo */}
              <div className="relative">
                {/* Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-white/50
                    blur-lg
                    opacity-60
                    transition-all
                    duration-300
                    group-hover:opacity-100
                  "
                />

                {/* Logo Box */}
                <div
                  className="
                    relative
                    flex
                    h-10
                    w-10
                    sm:h-11
                    sm:w-11
                    items-center
                    justify-center
                    rounded-xl
                    sm:rounded-2xl
                    bg-white
                    shadow-lg
                    transition-all
                    duration-300
                    group-hover:-rotate-6
                    group-hover:scale-110
                  "
                >
                  <span className="text-xl sm:text-2xl">
                    🍔
                  </span>
                </div>
              </div>

              {/* Logo Text */}
              <div className="hidden sm:block">
                <h1
                  className={`
                    text-lg
                    sm:text-xl
                    font-extrabold
                    tracking-tight
                    transition-colors

                    ${
                      isScrolled
                        ? "text-slate-900"
                        : "text-white"
                    }
                  `}
                >
                  <span
                    className={
                      isScrolled
                        ? "text-orange-500"
                        : "text-yellow-200"
                    }
                  >
                    Rasoi
                  </span>
                </h1>

                <p
                  className={`
                    text-[8px]
                    sm:text-[9px]
                    font-semibold
                    tracking-[0.18em]
                    sm:tracking-[0.22em]
                    uppercase

                    ${
                      isScrolled
                        ? "text-slate-400"
                        : "text-white/70"
                    }
                  `}
                >
                  Fresh • Fast • Delicious
                </p>
              </div>
            </Link>

            {/* =====================================
                DESKTOP NAVIGATION
            ====================================== */}

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-1
              "
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                      group
                      relative
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3.5
                      py-2.5
                      text-sm
                      font-semibold
                      transition-all
                      duration-300

                      ${
                        active
                          ? isScrolled
                            ? "bg-orange-50 text-orange-600"
                            : "bg-white/20 text-yellow-200"
                          : isScrolled
                          ? "text-slate-600 hover:bg-slate-100 hover:text-orange-500"
                          : "text-white/90 hover:bg-white/15 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      className="
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      "
                    />

                    {link.name}

                    {/* Active Indicator */}
                    {active && (
                      <span
                        className="
                          absolute
                          bottom-1
                          left-1/2
                          h-1
                          w-1
                          -translate-x-1/2
                          rounded-full
                          bg-orange-500
                        "
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* =====================================
                DESKTOP SEARCH
            ====================================== */}

            <div
              ref={searchRef}
              className="
                relative
                hidden
                md:block
                flex-1
                max-w-sm
              "
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search
                    size={18}
                    className={`
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2

                      ${
                        isScrolled
                          ? "text-slate-400"
                          : "text-white/70"
                      }
                    `}
                  />

                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() =>
                      setIsSearchOpen(true)
                    }
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search dishes..."
                    className={`
                      w-full
                      rounded-2xl
                      py-2.5
                      pl-11
                      pr-11
                      text-sm
                      outline-none
                      transition-all
                      duration-300

                      ${
                        isScrolled
                          ? "border border-slate-200 bg-slate-100 text-slate-800 placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                          : "border border-white/25 bg-white/15 text-white placeholder:text-white/60 focus:bg-white focus:text-slate-800 focus:placeholder:text-slate-400"
                      }
                    `}
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                      className={`
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        rounded-lg
                        p-1

                        ${
                          isScrolled
                            ? "text-slate-400 hover:bg-slate-200"
                            : "text-white/70 hover:bg-white/20"
                        }
                      `}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-full
                    mt-2
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                  "
                >
                  <div className="p-3">
                    <p
                      className="
                        px-2
                        py-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Search Rasoi
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        if (searchQuery.trim()) {
                          handleSearch({
                            preventDefault: () => {},
                          });
                        }
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        text-sm
                        text-slate-700
                        transition
                        hover:bg-orange-50
                        hover:text-orange-600
                      "
                    >
                      <div
                        className="
                          rounded-lg
                          bg-orange-100
                          p-2
                          text-orange-500
                        "
                      >
                        <Search size={16} />
                      </div>

                      <div>
                        <p className="font-semibold">
                          Search for dishes
                        </p>

                        <p className="text-xs text-slate-400">
                          Find your favourite food
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =====================================
                DESKTOP RIGHT SIDE
            ====================================== */}

            <div
              className="
                hidden
                md:flex
                items-center
                gap-2
                shrink-0
              "
            >
              {/* Location */}
              <button
                onClick={detectLocation}
                disabled={isLocating}
                title={locationText}
                className={`
                  hidden
                  xl:flex
                  max-w-[170px]
                  items-center
                  gap-2
                  rounded-xl
                  border
                  px-3
                  py-2
                  text-sm
                  font-semibold
                  transition-all
                  duration-300

                  ${
                    locationError
                      ? "border-red-200 bg-red-50 text-red-600"
                      : isScrolled
                      ? "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                      : "border-white/25 bg-white/15 text-white hover:bg-white/25"
                  }
                `}
              >
                {isLocating ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin shrink-0"
                  />
                ) : (
                  <MapPin
                    size={17}
                    className="shrink-0"
                  />
                )}

                <span className="truncate">
                  {isLocating
                    ? "Detecting..."
                    : locationText}
                </span>
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className={`
                  group
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  transition-all
                  duration-300

                  ${
                    isScrolled
                      ? "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
                      : "border-white/25 bg-white/15 text-white hover:bg-white hover:text-orange-500"
                  }
                `}
              >
                <ShoppingBag
                  size={19}
                  className="
                    transition-transform
                    group-hover:scale-110
                  "
                />

                {totalItems > 0 && (
                  <span
                    className="
                      absolute
                      -right-1.5
                      -top-1.5
                      flex
                      min-h-[19px]
                      min-w-[19px]
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500
                      px-1
                      text-[10px]
                      font-bold
                      text-white
                      shadow-md
                      ring-2
                      ring-white
                    "
                  >
                    {totalItems > 99
                      ? "99+"
                      : totalItems}
                  </span>
                )}
              </Link>

              {/* Profile */}
              {isLoggedIn ? (
                <div
                  ref={profileRef}
                  className="relative"
                >
                  <button
                    onClick={() =>
                      setIsProfileOpen(
                        !isProfileOpen
                      )
                    }
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      px-2
                      py-1.5
                      transition-all
                      duration-300

                      ${
                        isScrolled
                          ? "border-slate-200 bg-white hover:bg-slate-50"
                          : "border-white/25 bg-white/15 hover:bg-white/25"
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-gradient-to-br
                        from-orange-400
                        to-rose-500
                        text-sm
                        font-bold
                        text-white
                        shadow-sm
                      "
                    >
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="hidden xl:block text-left">
                      <p
                        className={`
                          max-w-[85px]
                          truncate
                          text-xs
                          font-bold

                          ${
                            isScrolled
                              ? "text-slate-800"
                              : "text-white"
                          }
                        `}
                      >
                        {user?.name || "User"}
                      </p>

                      <p
                        className={`
                          text-[10px]

                          ${
                            isScrolled
                              ? "text-slate-400"
                              : "text-white/70"
                          }
                        `}
                      >
                        Account
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      className={`
                        transition-transform
                        duration-300

                        ${
                          isProfileOpen
                            ? "rotate-180"
                            : ""
                        }

                        ${
                          isScrolled
                            ? "text-slate-400"
                            : "text-white"
                        }
                      `}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-full
                        mt-2
                        w-64
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-2xl
                        animate-profile-dropdown
                      "
                    >
                      {/* User Info */}
                      <div
                        className="
                          bg-gradient-to-br
                          from-orange-50
                          to-rose-50
                          p-4
                        "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-gradient-to-br
                              from-orange-400
                              to-rose-500
                              text-lg
                              font-bold
                              text-white
                            "
                          >
                            {user?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {user?.name || "User"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Options */}
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-700
                            transition
                            hover:bg-slate-50
                            hover:text-orange-500
                          "
                        >
                          <User size={17} />
                          My Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            font-semibold
                            text-red-500
                            transition
                            hover:bg-red-50
                          "
                        >
                          <LogOut size={17} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="
                    rounded-xl
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-orange-600
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-yellow-50
                    hover:shadow-lg
                    active:scale-95
                  "
                >
                  Login
                </Link>
              )}
            </div>

            {/* =====================================
                MOBILE BUTTONS
            ====================================== */}

            <div
              className="
                flex
                md:hidden
                items-center
                gap-1.5
                sm:gap-2
              "
            >
              {/* =====================================
                  MOBILE SEARCH BUTTON
              ====================================== */}

              <button
                type="button"
                aria-label="Open search"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsMobileOpen(false);
                }}
                className={`
                  flex
                  h-10
                  w-10
                  sm:h-11
                  sm:w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  transition-all
                  duration-300
                  active:scale-95

                  ${
                    isScrolled
                      ? "border-slate-200 bg-slate-100 text-slate-700 shadow-sm hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
                      : "border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                  }
                `}
              >
                {isSearchOpen ? (
                  <X size={20} />
                ) : (
                  <Search size={20} />
                )}
              </button>

              {/* =====================================
                  MOBILE MENU BUTTON
              ====================================== */}

              <button
                type="button"
                aria-label="Open menu"
                onClick={() => {
                  setIsMobileOpen(!isMobileOpen);
                  setIsSearchOpen(false);
                }}
                className={`
                  flex
                  h-10
                  w-10
                  sm:h-11
                  sm:w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  transition-all
                  duration-300
                  active:scale-95

                  ${
                    isScrolled
                      ? "border-slate-200 bg-slate-100 text-slate-700 shadow-sm hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500"
                      : "border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                  }
                `}
              >
                {isMobileOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>
            </div>
          </div>

          {/* =====================================
              MOBILE SEARCH
          ====================================== */}

          {isSearchOpen && (
            <div
              className="
                pb-3
                md:hidden
                animate-slide-down
              "
            >
              <form
                onSubmit={handleSearch}
                className="relative"
              >
                <Search
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search for dishes..."
                  autoFocus
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-orange-100
                    bg-white
                    py-3
                    pl-11
                    pr-12
                    text-sm
                    text-slate-800
                    outline-none
                    shadow-lg
                    focus:border-orange-400
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    rounded-xl
                    bg-orange-500
                    p-2
                    text-white
                    transition
                    hover:bg-orange-600
                    active:scale-95
                  "
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}

          {/* =====================================
              MOBILE MENU
          ====================================== */}

          <div
            className={`
              overflow-hidden
              transition-all
              duration-500
              md:hidden

              ${
                isMobileOpen
                  ? "max-h-[700px] opacity-100 pb-4"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-2xl
              "
            >
              {/* =====================================
                  MOBILE LOCATION
              ====================================== */}

              <button
                type="button"
                onClick={detectLocation}
                disabled={isLocating}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  border-b
                  border-slate-100
                  px-4
                  py-4
                  text-left
                  transition
                  hover:bg-orange-50
                  active:bg-orange-100
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100
                    text-orange-500
                  "
                >
                  {isLocating ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Navigation size={18} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-400">
                    Delivery location
                  </p>

                  <p className="truncate text-sm font-bold text-slate-800">
                    {isLocating
                      ? "Detecting location..."
                      : locationText}
                  </p>
                </div>

                <MapPin
                  size={17}
                  className="shrink-0 text-orange-500"
                />
              </button>

              {/* =====================================
                  MOBILE NAVIGATION
              ====================================== */}

              <div className="p-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          active
                            ? "bg-orange-50 text-orange-600 shadow-sm"
                            : "text-slate-700 hover:bg-slate-50 hover:text-orange-500"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg

                          ${
                            active
                              ? "bg-orange-100 text-orange-500"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        <Icon size={17} />
                      </div>

                      {link.name}

                      {active && (
                        <span
                          className="
                            ml-auto
                            h-2
                            w-2
                            rounded-full
                            bg-orange-500
                          "
                        />
                      )}
                    </Link>
                  );
                })}

                {/* =====================================
                    MOBILE CART
                ====================================== */}

                <Link
                  to="/cart"
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-orange-50
                    hover:text-orange-500
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-100
                        text-slate-500
                      "
                    >
                      <ShoppingBag size={17} />
                    </div>

                    Cart
                  </div>

                  {totalItems > 0 && (
                    <span
                      className="
                        flex
                        min-w-[24px]
                        h-6
                        items-center
                        justify-center
                        rounded-full
                        bg-gradient-to-r
                        from-orange-500
                        to-rose-500
                        px-2
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {totalItems > 99
                        ? "99+"
                        : totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {/* =====================================
                  MOBILE USER SECTION
              ====================================== */}

              <div
                className="
                  border-t
                  border-slate-100
                  p-3
                "
              >
                {isLoggedIn ? (
                  <>
                    {/* User Information */}
                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        bg-slate-50
                        p-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-gradient-to-br
                          from-orange-400
                          to-rose-500
                          font-bold
                          text-white
                        "
                      >
                        {user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {user?.name || "User"}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Profile */}
                    <Link
                      to="/profile"
                      className="
                        mb-2
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-orange-100
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-orange-600
                        transition
                        hover:bg-orange-50
                      "
                    >
                      <User size={17} />
                      My Profile
                    </Link>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-100
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-red-500
                        transition
                        hover:bg-red-50
                        active:bg-red-100
                      "
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-r
                      from-orange-500
                      to-rose-500
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-md
                      transition
                      hover:shadow-lg
                      active:scale-[0.98]
                    "
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* =====================================
          NAVBAR SPACER
      ====================================== */}

      <div className="h-[68px] sm:h-[76px]" />

      {/* =====================================
          CUSTOM ANIMATIONS
      ====================================== */}

      <style>
        {`
          @keyframes profile-dropdown {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-profile-dropdown {
            animation: profile-dropdown 0.2s ease-out;
          }

          .animate-slide-down {
            animation: slide-down 0.25s ease-out;
          }
        `}
      </style>
    </>
  );
}

export default Navbar;