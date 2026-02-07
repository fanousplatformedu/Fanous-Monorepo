import { Variants } from "framer-motion";

export const EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  smooth: [0.22, 1, 0.36, 1] as const,
};

export const MOTION = {
  fadeUpStagger: (opts?: {
    y?: number;
    duration?: number;
    stagger?: number;
    delayChildren?: number;
    ease?: readonly [number, number, number, number];
  }): Variants => {
    const y = opts?.y ?? 14;
    const duration = opts?.duration ?? 0.55;
    const stagger = opts?.stagger ?? 0.06;
    const delayChildren = opts?.delayChildren ?? 0.02;
    const ease = opts?.ease ?? EASE.out;

    return {
      hidden: { opacity: 0, y },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          ease,
          staggerChildren: stagger,
          delayChildren,
        },
      },
    };
  },

  fadeUpItem: (opts?: {
    y?: number;
    duration?: number;
    ease?: readonly [number, number, number, number];
  }): Variants => {
    const y = opts?.y ?? 10;
    const duration = opts?.duration ?? 0.45;
    const ease = opts?.ease ?? EASE.out;

    return {
      hidden: { opacity: 0, y },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration, ease },
      },
    };
  },
};

// =========== Home page ===========

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUpContainer = (
  stagger = 0.06,
  delayChildren = 0.02,
): Variants => ({
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_OUT,
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const fadeUpItem = (y = 10, duration = 0.45): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT } },
});

export const scaleIn = (duration = 0.45): Variants => ({
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration, ease: EASE_OUT } },
});
