"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Plane,
  Ship,
  ShieldCheck,
  Search,
  Globe,
  Clock,
  ChevronRight,
} from "lucide-react";
import VisualStepper from "@/components/VisualStepper";

export default function Home() {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = () => {
    if (trackingId.length > 3) setIsTracking(true);
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen">
      {/* 1. DYNAMIC HERO SECTION */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-[#002147]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000"
            className="w-full h-full object-cover opacity-50 scale-105"
            alt="Logistics"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002147] via-[#002147]/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-6">
              Moving World <br />
              <span className="text-emerald-400 text-5xl md:text-6xl">
                Connecting Afghanistan.
              </span>
            </h1>

            {/* INTERACTIVE TRACKING BAR */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-xl mt-10">
              <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full py-4 text-slate-900 outline-none text-lg"
                  placeholder="Enter Tracking ID..."
                />
              </div>
              <button
                onClick={handleTrack}
                className="bg-[#10b981] hover:bg-[#059669] text-white px-10 py-4 rounded-xl font-bold transition-all transform active:scale-95"
              >
                TRACK
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SHIPMENT RESULT AREA (Interactive) */}
      <AnimatePresence>
        {isTracking && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-slate-200"
          >
            <div className="container mx-auto px-6 py-16">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                    Active Shipment
                  </h2>
                  <p className="text-3xl font-bold text-[#002147]">
                    {trackingId}
                  </p>
                </div>
                <button
                  onClick={() => setIsTracking(false)}
                  className="text-slate-400 hover:text-red-500 text-sm font-bold"
                >
                  CLOSE
                </button>
              </div>
              <VisualStepper currentStatus="transit" />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 3. LIVE STATS (Fills Empty Space) */}
      <section className="py-12 bg-[#00172f]">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Daily Shipments", val: "1.2k+", icon: Box },
            { label: "Global Partners", val: "450+", icon: Globe },
            { label: "Active Routes", val: "85+", icon: Map },
            { label: "On-Time Rate", val: "99.2%", icon: Clock },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center border-r border-white/10 last:border-0"
            >
              <p className="text-3xl font-black text-white">{stat.val}</p>
              <p className="text-emerald-400 text-xs font-bold uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ANIMATED SERVICES GRID */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#002147] mb-4">
            Our Operations
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Enterprise-grade logistics infrastructure designed for the Afghan
            market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Plane,
              title: "Air Express",
              desc: "Express delivery from Dubai, Turkey, and China to Kabul Airport.",
            },
            {
              icon: Ship,
              title: "Ocean Freight",
              desc: "Reliable FCL/LCL shipments via Karachi and Bandar Abbas ports.",
            },
            {
              icon: Truck,
              title: "Regional Road",
              desc: "Secure heavy-duty trucking connecting major Afghan provinces.",
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#002147] mb-3">
                {service.title}
              </h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                {service.desc}
              </p>
              <div className="flex items-center text-[#10b981] font-bold text-sm">
                View Rates <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Box({ size }: { size: number }) {
  return <Truck size={size} />;
} // Placeholder for Box icon
function Map({ size }: { size: number }) {
  return <Globe size={size} />;
} // Placeholder for Map icon
