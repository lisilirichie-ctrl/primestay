"use client";

import { supabase } from "@/lib/supabase";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, Calendar, Users, Star,
  ShieldCheck, MessageCircle, Award,
  ChevronRight, ChevronLeft, Menu, X,
  Home, Compass, Info, Mail

} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

// TODO: weka namba halisi ya WhatsApp ya client hapa (format: 2547XXXXXXXX, bila +)
const WHATSAPP_NUMBER = "2547XXXXXXXX";
const SITE_NAME = "PrimeStay"; // TODO: badilisha na jina halisi la brand

// Real WhatsApp glyph (the actual phone-in-bubble logo), not a generic chat icon
function WhatsAppIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d="M16.004 3C9.372 3 4 8.373 4 15.005c0 2.373.664 4.588 1.816 6.474L4 29l7.72-1.775a11.94 11.94 0 0 0 4.284.787h.004c6.632 0 12.004-5.373 12.004-12.005C28.012 8.373 22.64 3 16.004 3zm0 21.79h-.003a9.75 9.75 0 0 1-4.972-1.363l-.357-.212-3.61.83.836-3.518-.232-.362a9.744 9.744 0 0 1-1.494-5.16c0-5.39 4.39-9.778 9.796-9.778 2.617 0 5.077 1.02 6.925 2.87a9.72 9.72 0 0 1 2.867 6.918c-.002 5.39-4.392 9.775-9.756 9.775zm5.362-7.316c-.294-.148-1.74-.858-2.01-.957-.27-.098-.466-.147-.663.148-.196.295-.76.957-.932 1.153-.172.196-.343.221-.637.074-.294-.148-1.24-.457-2.362-1.457-.873-.779-1.462-1.741-1.634-2.036-.171-.295-.018-.454.13-.601.133-.133.294-.344.441-.516.147-.172.196-.295.294-.492.098-.196.049-.369-.024-.516-.074-.148-.663-1.6-.909-2.192-.24-.577-.483-.499-.663-.508l-.564-.01c-.196 0-.516.074-.786.369-.27.295-1.03 1.006-1.03 2.454s1.055 2.848 1.202 3.044c.147.196 2.077 3.172 5.032 4.448.703.303 1.251.484 1.679.62.705.224 1.347.192 1.854.117.566-.084 1.74-.712 1.985-1.4.245-.688.245-1.278.172-1.4-.074-.123-.27-.196-.564-.344z" />
    </svg>
  );
}

type PropertyImage = {
  image_url: string;
  is_primary: boolean;
};

type Property = {
  id: string;
  title: string;
  city: string;
  country: string;
  property_type: string;
  price_per_night: number;
  property_images: PropertyImage[];
};

// City groups — case insensitive
const NAIROBI_CITIES = ["nairobi", "westlands", "kilimani", "karen", "parklands", "runda", "lavington", "gigiri", "kileleshwa", "upperhill", "cbd"];
const COAST_CITIES = ["mombasa", "diani", "malindi", "watamu", "nyali", "bamburi", "kilifi", "kwale", "lamu", "ukunda", "msambweni", "kikambala"];

function isNairobi(p: Property) {
  const text = `${p.city}`.toLowerCase();
  return NAIROBI_CITIES.some(c => text.includes(c));
}

function isCoast(p: Property) {
  const text = `${p.city}`.toLowerCase();
  return COAST_CITIES.some(c => text.includes(c));
}

function getPrimaryImage(images: PropertyImage[] | undefined): string {
  if (!images || images.length === 0) {
    return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80';
  }
  const primary = images.find((img) => img.is_primary);
  return (primary || images[0]).image_url;
}

function whatsappLink(property?: Property): string {
  let message = `Habari, nataka kuuliza kuhusu properties zenu kwenye ${SITE_NAME}.`;
  if (property) {
    message = `Habari, nina interest na hii property: *${property.title}* (${property.city}) - KSh ${property.price_per_night.toLocaleString()}/night. Naomba maelezo zaidi na availability.`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function useScrollRow() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) {
      const card = ref.current.querySelector('[data-card]') as HTMLElement;
      const amount = card ? card.offsetWidth + 12 : 260;
      ref.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    }
  };
  return { ref, scroll };
}

function PropertyCard({ prop }: { prop: Property }) {
  const router = useRouter();
  const imgSrc = getPrimaryImage(prop.property_images);

  return (
    <div
      data-card
      onClick={() => router.push(`/property/${prop.id}`)}
      className="flex-shrink-0 w-[48vw] sm:w-[38vw] md:w-[220px] lg:w-[240px] cursor-pointer group"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
        <img src={imgSrc} alt={prop.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <a
          href={whatsappLink(prop)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[0_2px_10px_rgba(37,211,102,0.5)] ring-1 ring-white/20 hover:scale-110 active:scale-95 transition-transform"
        >
          <WhatsAppIcon size={17} className="text-white" />
        </a>
      </div>
      <div>
        <p className="text-white text-xs sm:text-sm font-semibold leading-tight truncate">{prop.title}</p>
        <p className="text-slate-400 text-xs mt-0.5 truncate">{prop.city}, {prop.country}</p>
        <p className="text-white text-xs sm:text-sm mt-1">
          <span className="font-bold">KSh {prop.price_per_night?.toLocaleString()}</span>
          <span className="text-slate-400 font-normal"> / night</span>
        </p>
      </div>
    </div>
  );
}

function PropertyRow({ title, properties, loading }: { title: string; properties: Property[]; loading?: boolean }) {
  const { ref, scroll } = useScrollRow();

  if (loading) {
    return (
      <div className="px-4 sm:px-6 mb-10">
        <div className="h-5 w-48 bg-white/10 rounded mb-3 animate-pulse" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[48vw] sm:w-[38vw] md:w-[220px]">
              <div className="aspect-square rounded-xl bg-white/10 animate-pulse mb-2" />
              <div className="h-3 bg-white/10 rounded animate-pulse mb-1" />
              <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center px-4 sm:px-6 mb-3">
        <h3 className="text-white text-base sm:text-lg font-bold">{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll('left')} className="hidden sm:flex w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 items-center justify-center transition-all active:scale-90">
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => scroll('right')} className="hidden sm:flex w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 items-center justify-center transition-all active:scale-90">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {properties.map((prop) => (
          <div key={prop.id} className="snap-start">
            <PropertyCard prop={prop} />
          </div>
        ))}
      </div>
    </div>
  );
}

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Explore Properties", href: "/explore" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "FAQs", href: "/faqs" },
      { name: "Safety Center", href: "/safety" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export default function Homepage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [nairobiProps, setNairobiProps] = useState<Property[]>([]);
  const [coastProps, setCoastProps] = useState<Property[]>([]);
  const [upcountryProps, setUpcountryProps] = useState<Property[]>([]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            id,
            title,
            city,
            country,
            property_type,
            price_per_night,
            property_images ( image_url, is_primary )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) { console.error('Supabase error:', error.message); return; }

        if (data) {
          const nairobi = data.filter((p) => isNairobi(p as Property));
          const coast = data.filter((p) => !isNairobi(p as Property) && isCoast(p as Property));
          const upcountry = data.filter((p) => !isNairobi(p as Property) && !isCoast(p as Property));

          setNairobiProps(nairobi as Property[]);
          setCoastProps(coast as Property[]);
          setUpcountryProps(upcountry as Property[]);
        }
      } catch (err) {
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0B1020] min-h-screen text-white font-sans overflow-x-hidden">

      {/* NAVBAR */}
      <nav className={`fixed w-full top-0 left-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-[#0B1020]/95 backdrop-blur-md py-3 border-b border-white/10' : 'bg-[#0B1020]/40 backdrop-blur-sm py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-500 rounded-xl flex items-center justify-center font-bold text-white italic shadow-lg text-sm">
              {SITE_NAME.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">{SITE_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="/" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors text-white"><Home size={14} /> Home</a>
            <a href="/explore" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"><Compass size={14} /> Explore</a>
            <a href="/about" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"><Info size={14} /> About</a>
            <a href="/contact" className="flex items-center gap-1.5 hover:text-amber-500 transition-colors"><Mail size={14} /> Contact</a>
          </div>
          <div className="hidden md:block">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <button className="bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:brightness-110 text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.35)] ring-1 ring-white/10 transition-all">
                <WhatsAppIcon size={16} /> Chat With Us
              </button>
            </a>
          </div>
          <button className="md:hidden text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B1020]/98 backdrop-blur-xl border-t border-white/10 px-4 py-5 flex flex-col gap-4">
            {[
              { icon: Home, label: 'Home', href: '/' },
              { icon: Compass, label: 'Explore', href: '/explore' },
              { icon: Info, label: 'About', href: '/about' },
              { icon: Mail, label: 'Contact', href: '/contact' },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="flex items-center gap-3 text-slate-300 hover:text-amber-500 transition-colors py-1 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                <Icon size={16} /> {label}
              </a>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <button className="mt-1 w-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_rgba(37,211,102,0.35)] ring-1 ring-white/10">
                <WhatsAppIcon size={16} /> Chat With Us
              </button>
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative h-[65vh] min-h-[420px] sm:h-[75vh] sm:min-h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt={`${SITE_NAME} Hero`} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/85 via-[#0B1020]/50 to-[#0B1020]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
           Your Perfect 
 <br />
            <span className="text-blue-500">Stay</span> Starts <span className="text-amber-500">Here</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }} className="text-sm sm:text-base md:text-lg text-slate-300 mb-7 max-w-xl mx-auto">
           Discover beautifully designed apartments and exceptional hospitality, all in one place.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="bg-[#131B30]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 max-w-3xl mx-auto shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              <div className="flex flex-col gap-1 bg-white/10 rounded-xl px-3 py-2.5 col-span-2 md:col-span-1">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Destination</span>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-blue-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent outline-none text-white placeholder:text-slate-500 text-xs w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 bg-white/10 rounded-xl px-3 py-2.5">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Check-In</span>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-blue-400 shrink-0" />
                  <input type="date" className="bg-transparent outline-none text-slate-500 text-xs w-full cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-col gap-1 bg-white/10 rounded-xl px-3 py-2.5">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Check-Out</span>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-blue-400 shrink-0" />
                  <input type="date" className="bg-transparent outline-none text-slate-500 text-xs w-full cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-col gap-1 bg-white/10 rounded-xl px-3 py-2.5">
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Guests</span>
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-blue-400 shrink-0" />
                  <input type="number" min={1} max={20} placeholder="1" className="bg-transparent outline-none text-slate-500 text-xs w-full" />
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/explore?destination=${destination}`)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm active:scale-[0.99]"
            >
              <Search size={15} /> Search Properties
            </button>
          </motion.div>
        </div>
      </section>

      {/* PROPERTY ROWS */}
      <div className="pt-4 pb-16">
        <PropertyRow title="Popular homes in Nairobi" properties={nairobiProps} loading={loading} />
        <PropertyRow title="Coastal getaways — Mombasa & Diani" properties={coastProps} loading={loading} />
        <PropertyRow title="Upcountry stays" properties={upcountryProps} loading={loading} />
        {!loading && nairobiProps.length === 0 && coastProps.length === 0 && upcountryProps.length === 0 && (
          <div className="text-center py-20 px-6">
            <p className="text-slate-400 text-lg mb-2">No properties yet</p>
            <p className="text-slate-600 text-sm">Check back soon — new listings are added regularly.</p>
          </div>
        )}
      </div>

      {/* FEATURES */}
      <section className="py-14 border-t border-white/5" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2">The {SITE_NAME} Promise</h2>
            <p className="text-2xl sm:text-3xl font-bold">Unrivaled Excellence in Every Stay</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: 'Verified Properties', desc: 'Every home inspected.' },
              { icon: MapPin, title: 'Prime Locations', desc: 'Most sought-after spots.' },
              { icon: MessageCircle, title: 'Direct WhatsApp Contact', desc: 'Quick replies, anytime.' },
              { icon: Award, title: 'Trusted Service', desc: 'Real feedback from guests.' },
            ].map((f, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                <f.icon className="text-amber-500 size-6 sm:size-8 mb-3" />
                <h4 className="text-sm sm:text-base font-bold mb-1">{f.title}</h4>
                <p className="text-slate-400 text-xs hidden sm:block">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-10 px-4 sm:px-6" id="contact">
        <div className="max-w-7xl mx-auto relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden min-h-[220px] sm:min-h-[320px]">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Contact" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-[#0B1020]/20" />
          <div className="relative z-10 py-12 sm:py-20 px-6 sm:px-16 max-w-lg">
            <h2 className="text-xl sm:text-3xl font-bold mb-3">Found a Place You Like?</h2>
            <p className="text-xs sm:text-sm text-slate-200 mb-6 leading-relaxed">
              Message us on WhatsApp to check availability and book your stay directly.
            </p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <button className="bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:brightness-110 text-white px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-[0_6px_20px_rgba(37,211,102,0.4)] ring-1 ring-white/10">
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-16 pt-16 pb-8 border-t border-white/5 bg-[#070B16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic text-xs">
                {SITE_NAME.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Discover verified apartments, villas, and holiday homes across Kenya.
              Message us directly on WhatsApp to book your stay.
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-slate-500 text-xs">
            <p>© 2026 {SITE_NAME}. All rights reserved.</p>
            <p>Designed for modern travel in Kenya.</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group fixed bottom-6 right-6 z-50 flex items-center justify-center"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <span className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-2 ring-white/20 group-hover:scale-110 group-active:scale-95 transition-transform">
          <WhatsAppIcon size={30} className="text-white" />
        </span>
      </a>
    </div>
  );
}