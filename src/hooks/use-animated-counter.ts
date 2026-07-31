'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Easing function: easeOutExpo
 * Provides a satisfying fast-start, slow-finish feel.
 */
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Determines how many decimal places to preserve based on the number.
 */
function getDecimalPlaces(value: number): number {
  if (Number.isInteger(value)) return 0;
  const str = value.toString();
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) return 0;
  return Math.min(str.length - decimalIndex - 1, 1);
}

/**
 * useAnimatedCounter — Animates a numeric value from its previous (or 0) to the target.
 *
 * @param target  — The target number to animate toward
 * @param duration — Animation duration in ms (default: 1500)
 * @param enabled — Only animate when true (default: true)
 * @returns The current animated number value
 */
export function useAnimatedCounter(
  target: number,
  duration: number = 1500,
  enabled: boolean = true
): number {
  const [currentValue, setCurrentValue] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(0);
  const decimalsRef = useRef<number>(0);

  useEffect(() => {
    // If disabled, just set the target immediately (deferred to avoid sync setState in effect)
    if (!enabled) {
      const raf = requestAnimationFrame(() => setCurrentValue(target));
      return () => cancelAnimationFrame(raf);
    }

    startValueRef.current = currentValue;
    decimalsRef.current = getDecimalPlaces(target);
    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const value =
        startValueRef.current + (target - startValueRef.current) * easedProgress;

      // Round to appropriate decimal places
      const factor = Math.pow(10, decimalsRef.current);
      setCurrentValue(Math.round(value * factor) / factor);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Ensure we land exactly on the target
        setCurrentValue(target);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target, duration, enabled]);

  return currentValue;
}
