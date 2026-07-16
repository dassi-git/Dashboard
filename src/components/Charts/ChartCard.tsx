import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const cardStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: 'auto',
  maxHeight: 'none',
  minHeight: '30px',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  padding: '1px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const titleStyle: React.CSSProperties = {
  fontSize: '0.55rem',
  fontWeight: 700,
  marginBottom: '0',
  color: '#0f172a',
  textAlign: 'right',
};

const chartWrapperStyle: React.CSSProperties = {
  flex: 1,
  height: '100%',
  minHeight: 0,
  position: 'relative',
  display: 'flex',
  alignItems: 'stretch',
  overflow: 'hidden',
};

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  animationDelay?: number;
  animationDuration?: number;
};

export default function ChartCard({ title, children, style, animationDelay = 0, animationDuration = 700 }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.985 }}
      animate={prefersReducedMotion ? false : { opacity: 1, y: 0, scale: 1 }}
      whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.01, boxShadow: '0 16px 36px rgba(15, 23, 42, 0.08)' }}
      transition={{
        duration: Math.max(0.3, Math.min(0.5, animationDuration / 1000)),
        delay: animationDelay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        ...cardStyle,
        ...style,
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0px)',
        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.04)',
        willChange: 'opacity, transform, filter, box-shadow',
        transition: 'opacity 360ms ease, transform 360ms ease, box-shadow 360ms ease',
      }}
    >
      <div style={titleStyle}>{title}</div>
      <div style={chartWrapperStyle}>{children}</div>
    </motion.div>
  );
}
