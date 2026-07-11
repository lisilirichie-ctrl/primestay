"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Property, WhatsAppCTA, WhatsAppIcon, SITE_NAME,
} from "@/components/whatsapp";
import {
  ArrowLeft, MapPin, Users, BedDouble, Bath, Check, ChevronLeft, ChevronRight,
} from "lucide-react";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          id, title, description, city, country, property_type,
          price_per_night, max_guests, bedrooms, bathrooms, amenities,
          property_images ( image_url, is_primary )
        `)
        .eq("id", id)
        .single();

      if (error) { console.error(error.message); setLoading(false); return; }
      setProperty(data as Property);
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1020] pt-28 px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="w-full aspect-[16/9] rounded-2xl shimmer mb-6" />
          <div className="h-6 w-2/3 shimmer rounded mb-3" />
          <div className="h-4 w-1/3 shimmer rounded mb-8" />
          <div className="h-24 w-full shimmer rounded" />
        </div>
        <style jsx global>{`
          @keyframes shimmerSweep { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
          .shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%); background-size: 800px 100%; animation: shimmerSweep 1.6s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0B1020] text-white flex flex-col items-center justify-center px-4">
        <p className="text-lg mb-4">Property haikupatikana.</p>
        <button onClick={() => router.push("/explore")} className="text-amber-500 text-sm underline">
          Rudi kwenye Explore
        </button>
      </div>
    );
  }

  const images = property.property_images?.length
    ? property.property_images
    : [{ image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", is_primary: true }];

  const nextImage = () => setActiveImage((i) => (i + 1) % images.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white pt-24 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        {/* Gallery */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden mb-3 bg-[#131B30]">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={images[activeImage].image_url}
              alt={property.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 flex items-center justify-center transition-colors"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeImage ? "w-6 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === activeImage ? "border-amber-500" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.title}</h1>
            <p className="flex items-center gap-1.5 text-slate-400 text-sm mb-6">
              <MapPin size={14} /> {property.city}, {property.country}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-white/10">
              {property.max_guests && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Users size={16} className="text-amber-500" /> {property.max_guests} guests
                </div>
              )}
              {property.bedrooms && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <BedDouble size={16} className="text-amber-500" /> {property.bedrooms} bedroom{property.bedrooms !== 1 ? "s" : ""}
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Bath size={16} className="text-amber-500" /> {property.bathrooms} bathroom{property.bathrooms !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {property.description && (
              <div className="mb-8 pb-8 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-3">About this place</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <motion.div
                      key={amenity}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-slate-300 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2"
                    >
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      <span className="capitalize">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: sticky booking card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:sticky md:top-24 h-fit"
          >
            <div className="bg-[#131B30]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <p className="text-2xl font-bold mb-1">
                KSh {property.price_per_night.toLocaleString()}
                <span className="text-sm font-normal text-slate-400"> / night</span>
              </p>
              <p className="text-xs text-slate-500 mb-6">No online payment needed — book directly via WhatsApp.</p>

              <WhatsAppCTA
                property={property}
                className="w-full bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:brightness-110 hover:shadow-[0_0_28px_rgba(37,211,102,0.55)] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(37,211,102,0.4)] ring-1 ring-white/10 transition-all"
              >
                <WhatsAppIcon size={19} className="wa-icon-slide" /> Reserve on WhatsApp
              </WhatsAppCTA>

              <p className="text-center text-xs text-slate-500 mt-4">
                Managed directly by {SITE_NAME}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmerSweep { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.14) 37%, rgba(255,255,255,0.06) 63%); background-size: 800px 100%; animation: shimmerSweep 1.6s ease-in-out infinite; }
        @keyframes rippleExpand { 0% { transform: scale(0); opacity: 0.5; } 100% { transform: scale(3.2); opacity: 0; } }
        .wa-ripple { position: absolute; width: 40px; height: 40px; margin-left: -20px; margin-top: -20px; border-radius: 50%; background: rgba(255,255,255,0.6); pointer-events: none; animation: rippleExpand 0.6s ease-out forwards; }
        .wa-icon-slide { transition: transform 0.25s ease; }
        button:hover .wa-icon-slide { transform: translateX(3px); }
      `}</style>
    </div>
  );
}