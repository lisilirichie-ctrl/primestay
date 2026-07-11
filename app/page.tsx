"use client";

import { supabase } from "@/lib/supabase";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin, ShieldCheck, MessageCircle, Award,
  Menu, X, Home, Compass, Info, Mail,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import PropertyCard from "@/components/PropertyCard";
import {
  Property, WhatsAppCTA, WhatsAppIcon, whatsappLink, SITE_NAME,
} from "@/components/whatsapp";

// TODO: badilisha na jina halisi la host/admin
const HOST_NAME = "Brian";
const HOST_PHOTO = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=400&q=80";

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "#host" },
      { name: "Stays", href: "#stays" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Homepage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const logoClickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Single click on logo -> go home. Double click -> discreet admin access.
  const handleLogoClick = () => {
    if (logoClickTimeout.current) {
      clearTimeout(logoClickTimeout.current);
      logoClickTimeout.current = null;
      return; // this click was part of a double-click, handled by onDoubleClick
    }
    logoClickTimeout.current = setTimeout(() => {
      router.push("/");
      logoClickTimeout.current = null;
    }, 250);
  };

  const handleLogoDoubleClick = () => {
    if (logoClickTimeout.current) {
      clearTimeout(logoClickTimeout.current);
      logoClickTimeout.current = null;
    }
    router.push("/auth");
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(
            `id, title, city, country, property_type, price_per_night, property_images ( image_url, is_primary )`
          )
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error.message);
          return;
        }
        setProperties((data as Property[]) || []);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0B1020] min-h-screen text-white font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav
        className={`fixed w-full top-0 left-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#0B1020]/95 backdrop-blur-md py-3 border-b border-white/10"
            : "bg-[#0B1020]/40 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={handleLogoClick}
            onDoubleClick={handleLogoDoubleClick}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-500 rounded-xl flex items-center justify-center font-bold text-white italic shadow-lg text-sm">
              {SITE_NAME.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">{SITE_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="/" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors text-white">
              <Home size={14} /> Home
            </a>
            <a href="#stays" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
              <Compass size={14} /> Stays
            </a>
            <a href="#host" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
              <Info size={14} /> About
            </a>
            <a href="#contact" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
              <Mail size={14} /> Contact
            </a>
          </div>
          <div className="hidden md:block">
            <WhatsAppCTA className="bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:brightness-110 hover:shadow-[0_0_16px_rgba(37,211,102,0.5)] text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.35)] ring-1 ring-white/10 transition-all">
              <WhatsAppIcon size={16} className="wa-icon-slide" /> Chat With Me
            </WhatsAppCTA>
          </div>
          <button className="md:hidden text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B1020]/98 backdrop-blur-xl border-t border-white/10 px-4 py-5 flex flex-col gap-4">
            {[
              { icon: Home, label: "Home", href: "/" },
              { icon: Compass, label: "Stays", href: "#stays" },
              { icon: Info, label: "About", href: "#host" },
              { icon: Mail, label: "Contact", href: "#contact" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 text-slate-300 hover:text-amber-500 transition-colors py-1 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={16} /> {label}
              </a>
            ))}
            <WhatsAppCTA className="mt-1 w-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_rgba(37,211,102,0.35)] ring-1 ring-white/10">
              <WhatsAppIcon size={16} className="wa-icon-slide" /> Chat With Me
            </WhatsAppCTA>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] sm:h-[65vh] sm:min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover"
            alt={`${SITE_NAME} Hero`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/85 via-[#0B1020]/50 to-[#0B1020]" />
        </div>

        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px] float-orb-1 pointer-events-none" />
        <div className="absolute top-1/3 -right-10 w-56 h-56 rounded-full bg-amber-500/15 blur-[80px] float-orb-2 pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center pt-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3"
          >
            Personally managed by {HOST_NAME}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight"
          >
            Handpicked Stays, <span className="shimmer-text">Booked Directly</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-slate-300 mb-7 max-w-xl mx-auto"
          >
            No middlemen, no booking fees — just message me on WhatsApp and I'll sort you out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <WhatsAppCTA className="bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,211,102,0.5)] text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(37,211,102,0.4)] ring-1 ring-white/10 mx-auto transition-all">
              <WhatsAppIcon size={18} className="wa-icon-slide" /> Message {HOST_NAME}
            </WhatsAppCTA>
          </motion.div>
        </div>
      </section>

      {/* MEET THE HOST */}
      <section className="py-14 px-4 sm:px-6" id="host">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          <img
            src={HOST_PHOTO}
            alt={HOST_NAME}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-2 ring-amber-500/40 shrink-0"
          />
          <div className="text-center sm:text-left">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-1">Meet Your Host</p>
            <h3 className="text-xl font-bold mb-2">Hi, I'm {HOST_NAME} </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              I personally manage every property listed here — from cleaning to check-in.
              When you message me, you're talking directly to the person who knows the place best.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ALL STAYS */}
      <section className="py-6 pb-16 px-4 sm:px-6" id="stays">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold">Available Stays</h2>
          <p className="text-slate-400 text-sm mt-1">Every listing here is checked and managed by me personally.</p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-square rounded-xl shimmer mb-2" />
                  <div className="h-3 shimmer rounded mb-1" />
                  <div className="h-3 w-2/3 shimmer rounded" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg mb-2">No stays listed yet</p>
              <p className="text-slate-600 text-sm">Check back soon — new listings are added regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {properties.map((prop, i) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                >
                  <PropertyCard prop={prop} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY BOOK DIRECT */}
      <section className="py-14 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2">Why Book Direct</h2>
            <p className="text-2xl sm:text-3xl font-bold">No Platform, No Games</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: "Verified by Me", desc: "I inspect every home myself." },
              { icon: MapPin, title: "Prime Locations", desc: "Handpicked, sought-after spots." },
              { icon: MessageCircle, title: "Direct Contact", desc: "You're talking to me, not a bot." },
              { icon: Award, title: "No Hidden Fees", desc: "The price you see is the price you pay." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-amber-500/20 hover:shadow-[0_10px_30px_rgba(245,158,11,0.08)] transition-all"
              >
                <f.icon className="text-amber-500 size-6 sm:size-8 mb-3" />
                <h4 className="text-sm sm:text-base font-bold mb-1">{f.title}</h4>
                <p className="text-slate-400 text-xs hidden sm:block">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-10 px-4 sm:px-6" id="contact">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden min-h-[200px] sm:min-h-[280px]"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Contact"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-[#0B1020]/20" />
          <div className="relative z-10 py-10 sm:py-16 px-6 sm:px-16 max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-3">Found a Place You Like?</h2>
            <p className="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
              Message me on WhatsApp and I'll confirm availability and help you book.
            </p>
            <WhatsAppCTA className="bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,211,102,0.5)] text-white px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-[0_6px_20px_rgba(37,211,102,0.4)] ring-1 ring-white/10">
              <WhatsAppIcon size={18} className="wa-icon-slide" /> Message {HOST_NAME}
            </WhatsAppCTA>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="mt-8 pt-12 pb-8 border-t border-white/5 bg-[#070B16]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic text-xs">
                {SITE_NAME.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Handpicked stays across Kenya, personally managed by {HOST_NAME}.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-amber-500 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-white/5 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-xs">
            <p>© 2026 {SITE_NAME}. All rights reserved.</p>
            <p>Managed by {HOST_NAME} in Kenya.</p>
          </div>
        </div>
      </motion.footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group fixed bottom-6 right-6 z-50 flex items-center justify-center"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <span className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-2 ring-white/20 group-hover:shadow-[0_0_30px_rgba(37,211,102,0.7)] group-hover:scale-110 group-active:scale-95 transition-all duration-300">
          <WhatsAppIcon size={30} className="text-white" />
        </span>
      </a>

      <style jsx global>{`
        @keyframes shimmerSweep {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%);
          background-size: 800px 100%;
          animation: shimmerSweep 1.6s ease-in-out infinite;
        }
        @keyframes shimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmerText 3s linear infinite;
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(24px, 30px); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-24px, -20px); }
        }
        .float-orb-1 { animation: floatOrb1 10s ease-in-out infinite; }
        .float-orb-2 { animation: floatOrb2 12s ease-in-out infinite; }
        @keyframes rippleExpand {
          0% { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .wa-ripple {
          position: absolute;
          width: 40px;
          height: 40px;
          margin-left: -20px;
          margin-top: -20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          pointer-events: none;
          animation: rippleExpand 0.6s ease-out forwards;
        }
        .wa-icon-slide { transition: transform 0.25s ease; }
        button:hover .wa-icon-slide, a:hover .wa-icon-slide { transform: translateX(3px); }
      `}</style>
    </div>
  );
}