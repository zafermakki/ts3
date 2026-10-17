import { motion } from "framer-motion";

const orbs = [
  {
    className: "aurora-orb aurora-orb-purple",
    animate: {
      x: ["-4%", "10%", "-4%"],
      y: ["0%", "10%", "0%"],
      scale: [1, 1.14, 1],
    },
    duration: 22,
  },
  {
    className: "aurora-orb aurora-orb-blue",
    animate: {
      x: ["5%", "-8%", "5%"],
      y: ["-4%", "8%", "-4%"],
      scale: [1.08, 0.92, 1.08],
    },
    duration: 27,
  },
  {
    className: "aurora-orb aurora-orb-cyan",
    animate: {
      x: ["0%", "12%", "0%"],
      y: ["8%", "-9%", "8%"],
      scale: [0.95, 1.13, 0.95],
    },
    duration: 25,
  },
  {
    className: "aurora-orb aurora-orb-pink",
    animate: {
      x: ["8%", "-5%", "8%"],
      y: ["0%", "-12%", "0%"],
      scale: [1, 1.16, 1],
    },
    duration: 30,
  },
];

function AnimatedBackground() {
  return (
    <div className="animated-background" aria-hidden="true">
      <div className="aurora-base" />
      <div className="aurora-grid" />

      {orbs.map((orb, index) => (
        <motion.div
          key={orb.className}
          className={orb.className}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.8,
          }}
        />
      ))}

      <motion.div
        className="aurora-highlight"
        animate={{
          opacity: [0.25, 0.5, 0.25],
          scale: [1, 1.12, 1],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export default AnimatedBackground;