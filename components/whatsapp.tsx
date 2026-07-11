"use client";

import { useState } from "react";
import React from "react";


export const WHATSAPP_NUMBER = "254795853879";
export const SITE_NAME = "TuliaStays"; 

export type PropertyImage = {
  image_url: string;
  is_primary: boolean;
};

export type Property = {
  id: string;
  title: string;
  description?: string | null;
  city: string;
  country: string;
  property_type: string;
  price_per_night: number;
  max_guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[] | null;
  property_images: PropertyImage[];
};

export function getPrimaryImage(images: PropertyImage[] | undefined): string {
  if (!images || images.length === 0) {
    return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";
  }
  const primary = images.find((img) => img.is_primary);
  return (primary || images[0]).image_url;
}

export function whatsappLink(property?: Property): string {
 let message = `Hello, I'm interested in your available properties on ${SITE_NAME}.`;

if (property) {
  message = `Hello, I'm interested in booking "${property.title}" located in ${property.city}. The listed rate is KSh ${property.price_per_night.toLocaleString()} per night. Could you please confirm its availability and share more details? Thank you.`;
}
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Real WhatsApp glyph (phone-in-bubble logo)
export function WhatsAppIcon({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} fill="currentColor">
      <path d="M16.004 3C9.372 3 4 8.373 4 15.005c0 2.373.664 4.588 1.816 6.474L4 29l7.72-1.775a11.94 11.94 0 0 0 4.284.787h.004c6.632 0 12.004-5.373 12.004-12.005C28.012 8.373 22.64 3 16.004 3zm0 21.79h-.003a9.75 9.75 0 0 1-4.972-1.363l-.357-.212-3.61.83.836-3.518-.232-.362a9.744 9.744 0 0 1-1.494-5.16c0-5.39 4.39-9.778 9.796-9.778 2.617 0 5.077 1.02 6.925 2.87a9.72 9.72 0 0 1 2.867 6.918c-.002 5.39-4.392 9.775-9.756 9.775zm5.362-7.316c-.294-.148-1.74-.858-2.01-.957-.27-.098-.466-.147-.663.148-.196.295-.76.957-.932 1.153-.172.196-.343.221-.637.074-.294-.148-1.24-.457-2.362-1.457-.873-.779-1.462-1.741-1.634-2.036-.171-.295-.018-.454.13-.601.133-.133.294-.344.441-.516.147-.172.196-.295.294-.492.098-.196.049-.369-.024-.516-.074-.148-.663-1.6-.909-2.192-.24-.577-.483-.499-.663-.508l-.564-.01c-.196 0-.516.074-.786.369-.27.295-1.03 1.006-1.03 2.454s1.055 2.848 1.202 3.044c.147.196 2.077 3.172 5.032 4.448.703.303 1.251.484 1.679.62.705.224 1.347.192 1.854.117.566-.084 1.74-.712 1.985-1.4.245-.688.245-1.278.172-1.4-.074-.123-.27-.196-.564-.344z" />
    </svg>
  );
}

// WhatsApp button with ripple + glow micro-interaction before opening chat
export function WhatsAppCTA({
  property,
  className = "",
  children,
}: {
  property?: Property;
  className?: string;
  children: React.ReactNode;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

    setTimeout(() => {
      window.open(whatsappLink(property), "_blank", "noopener,noreferrer");
    }, 220);
  };

  return (
    <button onClick={handleClick} className={`relative overflow-hidden isolate ${className}`}>
      {ripples.map((r) => (
        <span key={r.id} className="wa-ripple" style={{ left: r.x, top: r.y }} />
      ))}
      {children}
    </button>
  );
}