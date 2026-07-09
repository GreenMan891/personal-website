'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface VolumeContextType {
  volumeMultiplier: number;
  setVolumeMultiplier: (value: number) => void;
}

const VolumeContext = createContext<VolumeContextType>({
  volumeMultiplier: 1,
  setVolumeMultiplier: () => {},
});

export function VolumeProvider({ children }: { children: React.ReactNode }) {
  const [volumeMultiplier, setVolumeMultiplierState] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('global-volume');
    if (saved !== null) {
      setVolumeMultiplierState(parseFloat(saved));
    }
  }, []);

  const setVolumeMultiplier = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    setVolumeMultiplierState(clamped);
    localStorage.setItem('global-volume', clamped.toString());
  }, []);

  return (
    <VolumeContext.Provider value={{ volumeMultiplier, setVolumeMultiplier }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  return useContext(VolumeContext);
}
