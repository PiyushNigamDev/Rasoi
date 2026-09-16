import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you soon.",
        icon: "success",
        timer: 2200,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  const contactInfo = [
    {
      emoji: "📍",
      title: "Our Location",
      detail: "123 Food Street, Cloud City, India 400001",
    },
    {
      emoji: "📞",
      title: "Phone Number",
      detail: "+91 98765 43210",
    },
    {
      emoji: "✉️",
      title: "Email Address",
      detail: "hello@rasoi.com",
    },
    {
      emoji: "🕒",
      title: "Working Hours",
      detail: "Mon - Sun: 9:00 AM - 11:00 PM",
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            📬 Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Contact <span className="text-orange-500">Us</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-orange-100/40 border border-white
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center text-2xl shadow-md">
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white">
              <h3 className="font-bold text-gray-900 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
                  <button
                    key={i}
                    className="w-11 h-11 bg-orange-50 hover:bg-orange-100 rounded-xl flex items-center justify-center text-xl
                      transition-all hover:scale-110 active:scale-95"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-100/50 border border-white">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                Send us a Message 💬
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div
                    className={`rounded-2xl border-2 bg-white transition-all duration-300 ${
                      focusedField === "name"
                        ? "border-orange-400 shadow-lg shadow-orange-100"
                        : errors.name
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">⚠️ {errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div
                    className={`rounded-2xl border-2 bg-white transition-all duration-300 ${
                      focusedField === "email"
                        ? "border-orange-400 shadow-lg shadow-orange-100"
                        : errors.email
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">⚠️ {errors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <div
                    className={`rounded-2xl border-2 bg-white transition-all duration-300 ${
                      focusedField === "subject"
                        ? "border-orange-400 shadow-lg shadow-orange-100"
                        : errors.subject
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl"
                    />
                  </div>
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-red-500">⚠️ {errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message
                  </label>
                  <div
                    className={`rounded-2xl border-2 bg-white transition-all duration-300 ${
                      focusedField === "message"
                        ? "border-orange-400 shadow-lg shadow-orange-100"
                        : errors.message
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3.5 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 rounded-2xl resize-none"
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-500">⚠️ {errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-semibold text-white
                    bg-gradient-to-r from-orange-500 to-rose-500
                    shadow-lg shadow-orange-500/30
                    hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                    transition-all duration-300 mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <span>→</span>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default Contact;