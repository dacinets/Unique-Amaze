import { useState, useEffect } from 'react';
import { scrollEngine, ScrollEngineState } from './scrollEngine';

/**
 * Hook to access normalized scroll engine state
 */
export function useScrollEngine() {
  const [state, setState] = useState<ScrollEngineState>(scrollEngine.getState());

  useEffect(() => {
    const unsubscribe = scrollEngine.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  return state;
}

/**
 * Hook to access clamped scroll velocity for subtle tilt/skew physics
 */
export function useScrollVelocity(maxClamp = 40) {
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollEngine.subscribe((state) => {
      // Clamp velocity between -maxClamp and maxClamp
      const clamped = Math.max(-maxClamp, Math.min(maxClamp, state.velocity));
      setVelocity(clamped);
    });
    return unsubscribe;
  }, [maxClamp]);

  return velocity;
}
