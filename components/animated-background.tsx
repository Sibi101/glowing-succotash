"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_78%,rgba(223,239,245,0.32),transparent_42%),radial-gradient(circle_at_84%_20%,rgba(5,22,58,0.38),transparent_36%)]" />

      <motion.div
        aria-hidden
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl"
        animate={{ x: [0, 26, -8, 0], y: [0, 20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-0 top-24 h-80 w-80 rounded-full bg-blue-950/20 blur-3xl"
        animate={{ x: [0, -20, 12, 0], y: [0, -12, 16, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-100/30 blur-3xl"
        animate={{ scale: [1, 1.05, 1], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
