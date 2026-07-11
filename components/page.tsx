"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Property = {
  id: string | number;
  title: string;
  city: string;
  country: string;
  price_per_night?: number;
  property_images?: Array<{ url?: string }>;
};

function getPrimaryImage(property_images?: Array<{ url?: string }>) {
  return property_images?.[0]?.url ?? "";
}

function WhatsAppCTA({
  children,
  className,
  property,
}: {
  children: ReactNode;
  className?: string;
  property: Property;
}) {
  return <div className={className}>{children}</div>;
}

function WhatsAppIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1, display: "inline-flex" }}
      aria-hidden="true"
    >
      📱
    </span>
  );
}

export default function PropertyCard({ prop }: { prop: Property }) {
  const router = useRouter();
  const imgSrc = getPrimaryImage(prop.property_images);

  return (
    <motion.div
      data-card
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => router.push(`/property/${prop.id}`)}
      className="cursor-pointer group w-full"
    >
      <div className="p-[1.5px] rounded-xl bg-gradient-to-br from-amber-500/30 via-white/10 to-blue-500/30 group-hover:from-amber-500/60 group-hover:to-blue-500/60 transition-colors duration-300 shadow-lg group-hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)]">
        <div className="relative w-full aspect-square rounded-[10px] overflow-hidden">
          <img
            src={imgSrc}
            alt={prop.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
          <WhatsAppCTA
            property={prop}
            className="absolute top-2 right-2 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[0_2px_10px_rgba(37,211,102,0.5)] ring-1 ring-white/20 hover:scale-110 hover:shadow-[0_0_18px_rgba(37,211,102,0.7)] active:scale-95 transition-all"
          >
            <WhatsAppIcon size={17} className="text-white" />
          </WhatsAppCTA>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-white text-xs sm:text-sm font-semibold leading-tight truncate">{prop.title}</p>
        <p className="text-slate-400 text-xs mt-0.5 truncate">{prop.city}, {prop.country}</p>
        <p className="text-white text-xs sm:text-sm mt-1">
          <span className="font-bold">KSh {prop.price_per_night?.toLocaleString()}</span>
          <span className="text-slate-400 font-normal"> / night</span>
        </p>
      </div>
    </motion.div>
  );
}