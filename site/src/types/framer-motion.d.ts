import 'framer-motion';

declare module 'framer-motion' {
  interface MotionProps {
    // Patch missing Motion props in framer-motion v12 types.
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
    variants?: unknown;
    transition?: unknown;
    layout?: boolean | 'position' | 'size' | 'preserve-aspect';
    whileHover?: unknown;
    whileTap?: unknown;
    whileInView?: unknown;
    viewport?: unknown;
  }
}
