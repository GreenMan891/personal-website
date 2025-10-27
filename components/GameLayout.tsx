'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './GameLayout.module.css';

export interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    hasNotification?: boolean;
}
interface GameLayoutProps {
    children: React.ReactNode;
    headerContent: React.ReactNode;
    tabs: Tab[];
}

const GameLayout: React.FC<GameLayoutProps> = ({
    children,
    headerContent,
    tabs = [] 
}) => {
    const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id);
    const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({});
    const selectSound = useRef<HTMLAudioElement | null>(null);
    const deselectSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        selectSound.current = new Audio('/sfx/buttonIn.wav');
        selectSound.current.volume = 0.2;
        deselectSound.current = new Audio('/sfx/buttonOut.wav')
        deselectSound.current.volume = 0.3
    }, []);

    const playAudio = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.warn("Sound blocked", e));
        }
    };

    const handleTabClick = (tabId: string) => {
        if(tabId == activeTabId) {
            return;
        }
        setActiveTabId(tabId);
        playAudio(selectSound)
        if (!visitedTabs[tabId]) {
            setVisitedTabs(prev => ({ ...prev, [tabId]: true }));
        }
    };

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    return (
        <div className={styles.container}>
            <header className={styles.topBar}>
                {headerContent}
            </header>

            <main className={styles.gameArea}>
                {children}
            </main>

            <footer className={styles.bottomSection}>
                <nav className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={activeTabId === tab.id ? styles.active : ''}
                        >
                            {tab.label}
                            {tab.hasNotification && !visitedTabs[tab.id] && (
                                <span className={styles.notificationDot}></span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className={styles.content}>
                    {activeTab ? activeTab.content : null}
                </div>
            </footer>
        </div>
    );
};

export default GameLayout;