import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutlet } from "react-router-dom";

import Header from "./Header";
import AnimatedBackground from "./AnimatedBackground";

function AppLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="app-shell">
      <AnimatedBackground />

      <Header />

      <main className="app-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="route-transition"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        <p>
          UserHub &copy; {new Date().getFullYear()} — User Management Dashboard
        </p>
      </footer>
    </div>
  );
}

export default AppLayout;