'use client';

import { useState, useEffect } from 'react';
import styles from './FadeInOverlay.module.css';

const FadeInOverlay = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 600); 

    return () => clearTimeout(timer);
  }, []);

  return <div className={`${styles.overlay} ${show ? '' : styles.hidden}`} />;
};

export default FadeInOverlay;