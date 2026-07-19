import React, { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  trigger: any;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Crossfade({ children, trigger, duration = 500, className, style }: Props) {
  const [prevChildren, setPrevChildren] = useState<React.ReactNode | null>(null);
  const [currentChildren, setCurrentChildren] = useState<React.ReactNode>(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentVisible, setCurrentVisible] = useState(true);
  const timerRef = useRef<number | null>(null);
  const lastTrigger = useRef(trigger);

  useEffect(() => setCurrentChildren(children), [children]);

  useEffect(() => {
    if (lastTrigger.current === trigger) return;
    lastTrigger.current = trigger;

    // Start crossfade: keep previous visible, hide new initially, then fade in
    setPrevChildren(currentChildren);
    setCurrentChildren(children);
    setIsTransitioning(true);
    setCurrentVisible(false);

    // allow next tick for CSS to pick up initial hidden state then show
    const showTimer = window.setTimeout(() => setCurrentVisible(true), 20);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setPrevChildren(null);
      setIsTransitioning(false);
      timerRef.current = null;
    }, duration + 40);

    // cleanup
    return () => {
      window.clearTimeout(showTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    ...style,
  };

  const layerStyle = (visible: boolean): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(6px)',
    pointerEvents: visible ? 'auto' : 'none',
  });

  return (
    <div className={className} style={containerStyle}>
      {prevChildren && (
        <div style={layerStyle(isTransitioning ? true : false)} aria-hidden>
          {prevChildren}
        </div>
      )}
      <div style={layerStyle(currentVisible)}>
        {currentChildren}
      </div>
    </div>
  );
}
