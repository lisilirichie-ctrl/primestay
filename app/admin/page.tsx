"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  PlusCircle,
  Globe,
  LogOut,
  Menu,
  X,
  Plus,
  MapPin,
  Pencil,
  Eye,
  EyeOff,
  Trash2,
  Upload,
  Star,
  Loader2,
} from "lucide-react";

interface PropertyImage {
  id?: string;
  image_url: string;
  is_primary: boolean;
  sort_order?: number;
}

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  address: string;
  city: string;
  country: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  status: "active" | "inactive"; // matches DB check constraint
  property_images: PropertyImage[];
  created_at: string;
  updated_at: string;
}

const C = {
  bg: "#0B1120",
  card: "#111827",
  cardHover: "#141F35",
  sidebarFrom: "#0D1424",
  sidebarTo: "#0A0F1C",
  text: "#F5F6F7",
  textMuted: "#8B94A6",
  textDim: "#5C6478",
  gold: "#D4AF37",
  goldLight: "#E8CC6B",
  goldDark: "#C79B2E",
  goldDeep: "#9c7a1f",
  emerald: "#34D399",
  red: "#F87171",
  border: "rgba(255,255,255,0.1)",
  borderGold: "rgba(212,175,55,0.35)",
  borderGoldSoft: "rgba(212,175,55,0.2)",
};

const goldGradient = "linear-gradient(155deg, #E8CC6B, #D4AF37 55%, #C79B2E)";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-KE").format(amount);
}

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [view, setView] = useState<"dashboard" | "properties" | "add" | "edit">("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth guard — redirects to /auth if not logged in.
  // (Harmless to keep even if app/admin/layout.tsx already guards this.)
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth");
        return;
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  const loadProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select(`*, property_images ( id, image_url, is_primary, sort_order )`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProperties((data as Property[]) || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const target = properties.find((p) => p.id === id);
    const confirmed = window.confirm(
      `Una uhakika unataka kufuta "${target?.title}"? Hatua hii haiwezi kurudishwa.`
    );
    if (!confirmed) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    loadProperties();
  };

  const handleToggleVisibility = async (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (!property) return;

    const newStatus = property.status === "active" ? "inactive" : "active";

    const { error } = await supabase
      .from("properties")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    loadProperties();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  useEffect(() => {
    if (!checkingAuth) loadProperties();
  }, [checkingAuth]);

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const dateLine =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }) + " • Welcome back";

  const stats = {
    total: properties.length,
    published: properties.filter((p) => p.status === "active").length,
    hidden: properties.filter((p) => p.status === "inactive").length,
  };

  const recentProperties = properties.slice(0, 5);

  function goTo(next: "dashboard" | "properties" | "add" | "edit") {
    setView(next);
    setDrawerOpen(false);
  }

  function openEdit(property: Property) {
    setSelectedProperty(property);
    goTo("edit");
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: C.bg }}>
        <Loader2 className="animate-spin" style={{ color: C.gold }} size={28} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: C.bg, color: C.text }}>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col p-4 pt-6 transition-transform duration-300 ease-out md:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: `linear-gradient(180deg, ${C.sidebarFrom}, ${C.sidebarTo})`,
          borderRight: `1px solid ${C.border}`,
        }}
      >
        <div
          className="mb-5 flex items-center justify-between gap-3 px-2 pb-6"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold"
              style={{
                background: `linear-gradient(155deg, ${C.goldLight}, ${C.gold} 60%, ${C.goldDeep})`,
                color: "#1a1508",
              }}
            >
              TS
            </div>
            <div>
              <div className="text-base font-medium leading-tight">Tulia Stays</div>
              <div className="mt-0.5 text-xs uppercase tracking-wide" style={{ color: C.textDim }}>
                Administrator
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg md:hidden"
            style={{ color: C.textMuted, border: `1px solid ${C.border}` }}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavItem label="Dashboard" icon={Home} active={view === "dashboard"} onClick={() => goTo("dashboard")} />
          <NavItem
            label="Properties"
            icon={Building2}
            active={view === "properties"}
            onClick={() => goTo("properties")}
          />
          <NavItem
            label="Add property"
            icon={PlusCircle}
            active={view === "add"}
            onClick={() => { setSelectedProperty(null); goTo("add"); }}
          />

          <div className="mx-1 my-3" style={{ borderTop: `1px solid ${C.border}` }} />

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            style={{ color: C.textMuted }}
          >
            <Globe size={17} strokeWidth={1.8} className="opacity-85" />
            View website
          </a>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          style={{ color: C.textMuted }}
        >
          <LogOut size={17} strokeWidth={1.8} className="opacity-85" />
          Logout
        </button>
      </aside>

      <AnimatePresence>
        {drawerOpen && (
          <motion.button
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          />
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <div
          className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 pb-4 pt-5 sm:px-6 sm:pt-7 lg:px-10 lg:pt-8"
          style={{ background: `linear-gradient(180deg, ${C.bg}e6, transparent)` }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg md:hidden"
              style={{ border: `1px solid ${C.border}`, backgroundColor: C.card, color: C.textMuted }}
            >
              <Menu size={17} />
            </button>

            {view === "dashboard" && (
              <div className="min-w-0">
                <div className="mb-1 truncate text-xs" style={{ color: C.textDim }}>
                  {dateLine}
                </div>
                <div className="flex items-center gap-2 text-xl font-normal sm:text-2xl lg:text-3xl">
                  <span>{greeting}</span>
                </div>
              </div>
            )}
            {view === "properties" && (
              <div className="min-w-0">
                <div className="mb-1 text-xs" style={{ color: C.textDim }}>
                  {properties.length} {properties.length === 1 ? "property" : "properties"} total
                </div>
                <div className="text-xl font-normal sm:text-2xl lg:text-3xl">Properties</div>
              </div>
            )}
            {view === "add" && (
              <div className="min-w-0">
                <div className="mb-1 text-xs" style={{ color: C.textDim }}>New listing</div>
                <div className="text-xl font-normal sm:text-2xl lg:text-3xl">Add property</div>
              </div>
            )}
            {view === "edit" && (
              <div className="min-w-0">
                <div className="mb-1 text-xs" style={{ color: C.textDim }}>Editing</div>
                <div className="text-xl font-normal sm:text-2xl lg:text-3xl truncate">
                  {selectedProperty?.title}
                </div>
              </div>
            )}
          </div>

          {(view === "dashboard" || view === "properties") && (
            <button
              type="button"
              onClick={() => { setSelectedProperty(null); goTo("add"); }}
              className="inline-flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto sm:justify-start sm:px-5 sm:py-3"
              style={{ background: goldGradient, color: "#191305" }}
            >
              <Plus size={15} strokeWidth={2.4} />
              Add property
            </button>
          )}
        </div>

        <main className="px-4 pb-16 pt-2 sm:px-6 lg:px-10">
          <AnimatePresence mode="wait">
            {view === "dashboard" && (
              <motion.section
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="my-5 grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                  <StatCard label="Properties" value={stats.total} tone="gold" />
                  <StatCard label="Published" value={stats.published} tone="emerald" />
                  <StatCard label="Hidden" value={stats.hidden} tone="slate" />
                </div>

                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="text-lg font-medium sm:text-xl">Recent properties</h2>
                  <button
                    type="button"
                    onClick={() => goTo("properties")}
                    className="text-xs transition-colors sm:text-sm"
                    style={{ color: C.textMuted }}
                  >
                    View all →
                  </button>
                </div>

                {loading ? (
                  <LoadingGrid />
                ) : recentProperties.length === 0 ? (
                  <EmptyState onAdd={() => { setSelectedProperty(null); goTo("add"); }} />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recentProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onToggleVisibility={handleToggleVisibility}
                        onDelete={handleDelete}
                        onEdit={() => openEdit(property)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {view === "properties" && (
              <motion.section
                key="properties"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {loading ? (
                  <LoadingGrid />
                ) : properties.length === 0 ? (
                  <EmptyState onAdd={() => { setSelectedProperty(null); goTo("add"); }} />
                ) : (
                  <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onToggleVisibility={handleToggleVisibility}
                        onDelete={handleDelete}
                        onEdit={() => openEdit(property)}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {view === "add" && (
              <motion.section
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PropertyForm
                  mode="create"
                  onCancel={() => goTo("dashboard")}
                  onSaved={() => { loadProperties(); goTo("properties"); }}
                />
              </motion.section>
            )}

            {view === "edit" && selectedProperty && (
              <motion.section
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <PropertyForm
                  mode="edit"
                  existingProperty={selectedProperty}
                  onCancel={() => goTo("properties")}
                  onSaved={() => { loadProperties(); goTo("properties"); }}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function NavItem({ label, icon: Icon, active, onClick }: { label: string; icon: any; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors"
      style={
        active
          ? { backgroundColor: "rgba(212,175,55,0.14)", color: C.gold, border: `1px solid ${C.borderGoldSoft}` }
          : { color: C.textMuted, border: "1px solid transparent" }
      }
    >
      <Icon size={17} strokeWidth={1.8} className={active ? "opacity-100" : "opacity-85"} />
      {label}
    </button>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone: string }) {
  const toneBg =
    tone === "gold"
      ? "rgba(212,175,55,0.14)"
      : tone === "emerald"
      ? "rgba(52,211,153,0.12)"
      : "rgba(255,255,255,0.06)";

  return (
    <div
      className="rounded-3xl p-5 h-44 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
      style={{ border: `1px solid ${C.border}`, backgroundColor: C.card }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: toneBg }} />
      <div>
        <h2 className="text-3xl font-bold">{value}</h2>
        <p className="mt-1 text-sm" style={{ color: C.textMuted }}>{label}</p>
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, backgroundColor: C.card }}>
          <div className="h-36" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
          <div className="p-4 sm:p-5 space-y-2">
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PropertyCard({
  property,
  onToggleVisibility,
  onDelete,
  onEdit,
}: {
  property: Property;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}) {
  const isPublished = property.status === "active";
  const primaryImage =
    property.property_images?.find((i) => i.is_primary)?.image_url ||
    property.property_images?.[0]?.image_url;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onEdit}
      className="overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      style={{ border: `1px solid ${C.border}`, backgroundColor: C.card }}
    >
      <div
        className="relative flex h-36 items-end p-3"
        style={{
          backgroundImage: primaryImage ? `url(${primaryImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#111827",
        }}
      >
        <span
          className="relative z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide"
          style={
            isPublished
              ? { border: "1px solid rgba(52,211,153,0.3)", backgroundColor: "rgba(52,211,153,0.16)", color: C.emerald }
              : { border: "1px solid rgba(148,163,184,0.25)", backgroundColor: "rgba(148,163,184,0.16)", color: "#cbd5e1" }
          }
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isPublished ? "Published" : "Hidden"}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-1 text-base font-medium sm:text-lg">{property.title}</div>
        <div className="mb-3 flex items-center gap-1.5 text-xs" style={{ color: C.textMuted }}>
          <MapPin size={12} className="opacity-70" />
          {property.address ? `${property.address}, ` : ""}{property.city}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold" style={{ color: C.gold }}>
            KES {formatPrice(property.price_per_night)}
            <span className="ml-1 text-xs font-normal" style={{ color: C.textDim }}>/ night</span>
          </div>

          <div className="flex gap-1.5">
            <IconButton label="Edit" onClick={onEdit}>
              <Pencil size={14} />
            </IconButton>
            <IconButton label={isPublished ? "Hide" : "Publish"} onClick={() => onToggleVisibility(property.id)}>
              {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
            </IconButton>
            <IconButton label="Delete" onClick={() => onDelete(property.id)}>
              <Trash2 size={14} />
            </IconButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:brightness-125"
      style={{ border: `1px solid ${C.border}`, backgroundColor: "rgba(255,255,255,0.03)", color: C.textMuted }}
    >
      {children}
    </button>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-5 py-16 text-center"
      style={{ border: `1px dashed ${C.border}`, backgroundColor: "rgba(255,255,255,0.012)" }}
    >
      <div className="mb-5 opacity-90">
        <Home size={64} strokeWidth={1.3} style={{ color: C.gold }} />
      </div>
      <div className="mb-1.5 text-lg">No properties yet</div>
      <p className="mb-5 max-w-xs text-sm" style={{ color: C.textMuted }}>
        Once you add a property, it will appear here for guests to discover.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
        style={{ background: goldGradient, color: "#191305" }}
      >
        <Plus size={15} strokeWidth={2.4} />
        Add first property
      </button>
    </div>
  );
}

/* ============================================================
   PROPERTY FORM — used for both Add and Edit (full backend)
   ============================================================ */

function Field({
  label, placeholder, value, onChange, type = "text",
}: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium" style={{ color: C.textMuted }}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg p-3 text-sm outline-none transition-colors"
        style={{ border: `1px solid ${C.border}`, backgroundColor: "#0E1526", color: C.text }}
      />
    </div>
  );
}

function PropertyForm({
  mode,
  existingProperty,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  existingProperty?: Property;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(existingProperty?.title || "");
  const [description, setDescription] = useState(existingProperty?.description || "");
  const [propertyType, setPropertyType] = useState(existingProperty?.property_type || "apartment");
  const [address, setAddress] = useState(existingProperty?.address || "");
  const [city, setCity] = useState(existingProperty?.city || "");
  const [pricePerNight, setPricePerNight] = useState(existingProperty?.price_per_night?.toString() || "");
  const [bedrooms, setBedrooms] = useState(existingProperty?.bedrooms?.toString() || "1");
  const [bathrooms, setBathrooms] = useState(existingProperty?.bathrooms?.toString() || "1");
  const [maxGuests, setMaxGuests] = useState(existingProperty?.max_guests?.toString() || "1");
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>(existingProperty?.amenities || []);

  const [existingImages, setExistingImages] = useState<PropertyImage[]>(existingProperty?.property_images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAmenity = () => {
    const val = amenityInput.trim();
    if (val && !amenities.includes(val)) setAmenities((prev) => [...prev, val]);
    setAmenityInput("");
  };
  const removeAmenity = (a: string) => setAmenities((prev) => prev.filter((x) => x !== a));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (img: PropertyImage) => {
    if (!img.id) return;
    await supabase.from("property_images").delete().eq("id", img.id);
    setExistingImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  const setPrimaryExisting = async (img: PropertyImage) => {
    if (!img.id || !existingProperty?.id) return;
    await supabase.from("property_images").update({ is_primary: false }).eq("property_id", existingProperty.id);
    await supabase.from("property_images").update({ is_primary: true }).eq("id", img.id);
    setExistingImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === img.id })));
  };

  const uploadNewImages = async (propertyId: string, alreadyHasPrimary: boolean) => {
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const ext = file.name.split(".").pop();
      const path = `${propertyId}/${Date.now()}-${i}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("property-images").upload(path, file);
      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        continue;
      }

      const { data: urlData } = supabase.storage.from("property-images").getPublicUrl(path);

      await supabase.from("property_images").insert({
        property_id: propertyId,
        image_url: urlData.publicUrl,
        is_primary: !alreadyHasPrimary && i === 0,
      });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !city.trim() || !pricePerNight) {
      setError("Jaza Title, City, na Price kabla ya kusave.");
      return;
    }
    setError(null);
    setSaving(true);

    const payload = {
      title: title.trim(),
      description,
      property_type: propertyType,
      address,
      city,
      country: "Kenya",
      price_per_night: Number(pricePerNight) || 0,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      max_guests: Number(maxGuests) || 1,
      amenities,
    };

    try {
      if (mode === "create") {
        const { data, error: insertError } = await supabase
          .from("properties")
          .insert({ ...payload, status: "active" })
          .select()
          .single();

        if (insertError) throw insertError;
        if (newFiles.length > 0) await uploadNewImages(data.id, false);
      } else {
        if (!existingProperty?.id) throw new Error("Missing property id");

        const { error: updateError } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", existingProperty.id);

        if (updateError) throw updateError;

        if (newFiles.length > 0) {
          const hasPrimary = existingImages.some((i) => i.is_primary);
          await uploadNewImages(existingProperty.id, hasPrimary);
        }
      }

      onSaved();
    } catch (err: any) {
      setError(err.message || "Kuna shida imetokea. Jaribu tena.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl rounded-2xl p-5 sm:p-8"
      style={{ border: `1px solid ${C.border}`, backgroundColor: C.card }}
    >
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Property title" placeholder="e.g. Tulia Executive Suite" value={title} onChange={setTitle} />
        <Field label="Address" placeholder="e.g. 123 Main Street" value={address} onChange={setAddress} />
        <Field label="City" placeholder="e.g. Mombasa" value={city} onChange={setCity} />

        <div>
          <label className="mb-2 block text-xs font-medium" style={{ color: C.textMuted }}>Property type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full rounded-lg p-3 text-sm outline-none transition-colors"
            style={{ border: `1px solid ${C.border}`, backgroundColor: "#0E1526", color: C.text }}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Price per night (KES)" placeholder="15000" value={pricePerNight} onChange={setPricePerNight} type="number" />
        <Field label="Bedrooms" value={bedrooms} onChange={setBedrooms} type="number" />
        <Field label="Bathrooms" value={bathrooms} onChange={setBathrooms} type="number" />
      </div>

      <div className="mb-4">
        <Field label="Max guests" value={maxGuests} onChange={setMaxGuests} type="number" />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium" style={{ color: C.textMuted }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short, elegant description guests will read first."
          className="min-h-[84px] w-full rounded-lg p-3 text-sm outline-none transition-colors"
          style={{ border: `1px solid ${C.border}`, backgroundColor: "#0E1526", color: C.text }}
        />
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium" style={{ color: C.textMuted }}>Amenities</label>
        <div className="flex gap-2 mb-2">
          <input
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
            placeholder="e.g. wifi, parking, pool"
            className="flex-1 rounded-lg p-3 text-sm outline-none transition-colors"
            style={{ border: `1px solid ${C.border}`, backgroundColor: "#0E1526", color: C.text }}
          />
          <button
            type="button"
            onClick={addAmenity}
            className="px-4 rounded-lg transition-colors"
            style={{ border: `1px solid ${C.border}`, color: C.textMuted }}
          >
            <Plus size={16} />
          </button>
        </div>
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full capitalize"
                style={{ backgroundColor: "rgba(212,175,55,0.12)", color: C.gold }}
              >
                {a}
                <button type="button" onClick={() => removeAmenity(a)}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium" style={{ color: C.textMuted }}>Property photos</label>

        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                {img.is_primary && (
                  <span
                    className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: C.gold, color: "#191305" }}
                  >
                    PRIMARY
                  </span>
                )}
                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.is_primary && (
                    <button type="button" onClick={() => setPrimaryExisting(img)} className="p-1.5 bg-white/20 rounded-full hover:bg-white/30" title="Set as primary">
                      <Star size={13} />
                    </button>
                  )}
                  <button type="button" onClick={() => removeExistingImage(img)} className="p-1.5 bg-red-500/80 rounded-full hover:bg-red-500" title="Remove">
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {newPreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {newPreviews.map((preview, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">NEW</span>
                <button type="button" onClick={() => removeNewFile(i)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-xl p-5 text-center text-xs transition-colors flex items-center justify-center gap-2"
          style={{ border: `1px dashed ${C.border}`, color: C.textDim }}
        >
          <Upload size={14} />
          Drop images here, or click to upload
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
        </label>
      </div>

      {error && (
        <p className="mb-4 text-xs rounded-lg px-3 py-2" style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: C.red }}>
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse justify-end gap-2.5 pt-5 sm:flex-row" style={{ borderTop: `1px solid ${C.border}` }}>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:w-auto"
          style={{ border: `1px solid ${C.border}`, color: C.textMuted }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: goldGradient, color: "#191305" }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {mode === "create" ? "Save property" : "Save changes"}
        </button>
      </div>
    </form>
  );
}