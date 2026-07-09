'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useVolume } from './VolumeContext';
import styles from './VolumeSlider.module.css';

export default function VolumeSlider() {
  const { volumeMultiplier, setVolumeMultiplier } = useVolume();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateVolumeFromY = useCallback((clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const ratio = 1 - Math.max(0, Math.min(1, y / rect.height));
    setVolumeMultiplier(ratio);
  }, [setVolumeMultiplier]);

  const handleTrackMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    updateVolumeFromY(e.clientY);
  }, [updateVolumeFromY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        updateVolumeFromY(e.clientY);
      }
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updateVolumeFromY]);

  // Speaker icon with dynamic waves based on volume
  const speakerIcon = volumeMultiplier === 0 ? (
    // Muted icon
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    // Volume icon
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      {volumeMultiplier > 0.01 && (
        <path d="M15.54 8.46a5 5 0 010 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
      {volumeMultiplier > 0.5 && (
        <path d="M19.07 4.93a10 10 0 010 14.14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );

  const fillHeight = `${volumeMultiplier * 100}%`;
  const thumbBottom = `${volumeMultiplier * 100}%`;

  return (
    <div className={styles.volumeContainer} ref={containerRef}>
      <div className={`${styles.sliderPanel} ${isOpen ? styles.sliderPanelOpen : ''}`}>
        <div
          className={styles.sliderTrack}
          ref={trackRef}
          onMouseDown={handleTrackMouseDown}
        >
          <div className={styles.sliderFill} style={{ height: fillHeight }} />
          <div className={styles.sliderThumb} style={{ bottom: thumbBottom }} />
        </div>
      </div>
      <button
        className={styles.volumeButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Volume control"
      >
        {speakerIcon}
      </button>
    </div>
  );
}
