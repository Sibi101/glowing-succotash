"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.14),transparent_35%),linear-gradient(180deg,#04050a_0%,#070a16_45%,#03040a_100%)]" />

      <motion.div
        aria-hidden
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl"
        animate={{ x: [0, 26, -8, 0], y: [0, 20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-0 top-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ x: [0, -20, 12, 0], y: [0, -12, 16, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
