import React from "react";
import { useLocation, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * AnimatedSwitch wraps routes with page transitions (fade/slide).
 * Usage: <AnimatedSwitch><Route.../></AnimatedSwitch>
 */
function AnimatedSwitch({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.27, type: "tween", ease: "easeInOut" }}
        style={{ minHeight: "92vh" }}
      >
        <Routes location={location}>{children}</Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedSwitch;
