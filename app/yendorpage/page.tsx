"use client";
import { useRef, useState, useEffect } from 'react';
import FadeInOverlay from '../../components/FadeInOverlay';
import GameLayout, { Tab } from '../../components/GameLayout';
import styles from '../../components/GameLayout.module.css';

export default function YendorPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isGameRunning, setIsGameRunning] = useState(false);

    // 1. Logic to enter Fullscreen
    const handlePlayGame = () => {
        // Request Fullscreen on the CONTAINER div, not the iframe
        // This ensures the iframe fills the container, and the container fills the screen.
        const container = containerRef.current;
        if (container) {
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if ((container as any).webkitRequestFullscreen) {
                (container as any).webkitRequestFullscreen();
            } else if ((container as any).msRequestFullscreen) {
                (container as any).msRequestFullscreen();
            }
        }
    };

    // 2. Logic to handle volume AND Visual Layout fixes
    const handleGameLoad = () => {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow) return;

        try {
            const gameWindow = iframe.contentWindow;
            const gameDoc = gameWindow.document;

            // --- VISUAL FIX: Force Canvas to Center and Fit Screen ---
            // We inject CSS into the game iframe to ensure it stretches
            const style = gameDoc.createElement('style');
            style.textContent = `
                html, body {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    background-color: #000; /* Match background */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* Target the canvas or main element */
                canvas, #game, #canvas {
                    max-width: 100% !important;
                    max-height: 100% !important;
                    width: auto !important;
                    height: auto !important;
                    object-fit: contain; /* Keeps aspect ratio correct */
                    display: block;
                }
            `;
            gameDoc.head.appendChild(style);

            // --- AUDIO FIX ---
            gameWindow.focus();

        } catch (e) {
            console.warn("Could not set game settings:", e);
        }
    };

    // 3. Listen for fullscreen changes to start/stop the game
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (document.fullscreenElement === containerRef.current) {
                setIsGameRunning(true);
            } else {
                setIsGameRunning(false);
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    const yendorTabs: Tab[] = [
        {
            id: 'howtoplay',
            label: 'How to play',
            content: (
                <div className={styles.howToPlayContainer} style={{ flexDirection: 'column' }}>
                    <div className={styles.controlsSection} style={{ flex: '0 0 auto' }}>
                        <p>YENDOR is a rogue/zach-like programming game centered on navigating a bot around NetHack-inspired dungeons. Buy upgrades, iterate on your bot, and uncover the mystery of the Wizard of Yendor...</p>
                        <p>I made this game with 2 other friends for the Langjam Gamejam, building the entire thing (minus shaders!) in a language we created over the first couple days. nh is an evil child of C, Python, and OCaml - best of luck :)</p>
                    </div>

                    <div className={styles.downloadColumnsWrapper} style={{ flex: 1, minHeight: 0 }}>
                        <div className={styles.guideSection} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ margin: 0 }}>Write code in the custom nh language in order to navigate the dungeon, collect gold, and defeat kobolds.</p>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #a0a0a0', borderRadius: '4px', minHeight: '120px' }}>
                                <p style={{ color: '#666', fontStyle: 'italic' }}>Gif of bot navigation goes here</p>
                            </div>
                        </div>
                        <div className={styles.guideSection} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ margin: 0 }}>The skill tree lets you upgrade your bot's speed, the gold it earns, the damage it deals, and more.</p>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #a0a0a0', borderRadius: '4px', minHeight: '120px' }}>
                                <p style={{ color: '#666', fontStyle: 'italic' }}>Gif of upgrades/code goes here</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'credits',
            label: 'Credits',
            content: (
                <div className={styles.creditsContainer}>
                    <div className={styles.creditsTopRow}>
                        <div className={styles.creditBox}>
                            <h3>Seb Hall</h3>
                            <p className={styles.creditRole}>Game Design, Team Lead, Graphic Design, Product Owner</p>
                            <a href="/" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                                You're already on my website
                            </a>
                        </div>
                        <div className={styles.creditBox}>
                            <h3>Oliver Fogelin</h3>
                            <p className={styles.creditRole}>nh language development, game programming, website setup, Chief Stakeholder</p>
                            <a href="https://olifog.com" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                                View Website
                            </a>
                        </div>
                    </div>
                    <div className={`${styles.creditBox} ${styles.bottomBox}`}>
                        <h3>Ken Lin</h3>
                        <p className={styles.creditRole}>Game Programming, Scrum Master</p>
                        <a href="https://github.com/kenL4" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                            View GitHub
                        </a>
                    </div>
                </div>
            )
        },
        {
            id: 'design',
            label: 'Design',
            content: (
                <div className={styles.inspirationsContainer} style={{ overflowY: 'auto', padding: '20px' }}>
                    <div className={styles.inspirationsSplit} style={{ marginBottom: '25px', alignItems: 'center' }}>
                        <div className={styles.textColumn}>
                            <p style={{ margin: 0 }}>This was my first time working on a game with a team, and it was a great learning experience. My role on the team was a game designer, meaning I planned out how the game was going to work alongside my team, and gave feedback and suggestions as the game progressed.</p>
                        </div>
                        <div className={styles.imageColumn} style={{ flex: '0 0 280px', padding: 0 }}>
                            <img src="/yendorpage/proto1.png" alt="Yendor Prototype 1" className={`${styles.sideImage} ${styles.gif}`} style={{ width: '100%', maxHeight: 'none' }} />
                        </div>
                    </div>

                    <div className={styles.inspirationsSplit} style={{ marginBottom: '25px', alignItems: 'center' }}>
                        <div className={styles.textColumn}>
                            <p style={{ margin: 0 }}>I chose not to program for this project, as I was a little burnt out from working on other projects, but I was involved in every decision made. I planned out the skill tree, and wrote all the dialogue in the chats between upgrades.</p>
                        </div>
                        <div className={styles.imageColumn} style={{ flex: '0 0 280px', padding: 0 }}>
                            <img src="/yendorpage/proto2.png" alt="Yendor Prototype 2" className={`${styles.sideImage} ${styles.thumbnail}`} style={{ width: '100%', maxHeight: 'none' }} />
                        </div>
                    </div>

                    <div className={styles.inspirationsSplit} style={{ alignItems: 'center' }}>
                        <div className={styles.textColumn}>
                            <p style={{ margin: 0 }}>This project helped me understand how to give feedback to a team, as often I would have small tweaks I wanted to make to the game, but would have to think about how to tell my teammates without being too pushy. Usually I'm the programmer so I can just make the change I want, so having less control was a good learning experience.</p>
                        </div>
                        <div className={styles.imageColumn} style={{ flex: '0 0 280px', padding: 0 }}>
                            <img src="/yendorpage/proto3.png" alt="Yendor Prototype 3" className={styles.sideImage} style={{ width: '100%', maxHeight: 'none' }} />
                        </div>
                    </div>
                </div>
            ),
            hasNotification: true
        }
    ];

    return (
        <>
            <FadeInOverlay />
            <div className={styles.pageWrapper}>
                <GameLayout
                    headerContent={
                        <img src="/yendorlogo2.png" alt="Hexa Logo" className={styles.logo} />
                    }
                    githubLink='https://github.com/olifog/YENDOR'
                    tabs={yendorTabs}
                >
                    {/* GAME CONTAINER with Relative Positioning */}
                    <div
                        ref={containerRef}
                        style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000' }}
                    >

                        {/* PLAY BUTTON OVERLAY - Only visible when game is NOT running */}
                        {!isGameRunning && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundImage: `repeating-linear-gradient(to bottom, #dbdbdb, #dbdbdb 2px, #b3b3b3 5px, #b3b3b3 5px)`,
                                backgroundSize: '100% 0.625rem',
                                zIndex: 10,
                            }}>
                                <button
                                    onClick={handlePlayGame}
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '100px',
                                        backgroundColor: '#dbdbdb',
                                        border: '5px solid #7c7c7c',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        paddingLeft: '10px' // Visually center the triangle
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                    aria-label="Play Game"
                                >
                                    {/* SVG Triangle Icon - Now in Dark Grey to match theme */}
                                    <svg width="60" height="60" viewBox="2 0 24 24" fill="#444">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                                <p style={{
                                    color: '#444',
                                    marginTop: '5px',
                                    fontSize: '1.4rem',
                                    fontWeight: '600',
                                    textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5)',
                                    fontFamily: '"Open Sans", sans-serif'
                                }}>
                                    Play
                                </p>
                            </div>
                        )}

                        {/* THE GAME IFRAME */}
                        {/* We conditionally render the SRC. If game isn't running, src is undefined */}
                        <iframe
                            ref={iframeRef}
                            src={isGameRunning ? "/yendorpage/index.html" : undefined}
                            onLoad={handleGameLoad}
                            width="100%"
                            height="100%"
                            style={{
                                border: 'none',
                                display: 'block',
                                backgroundColor: 'black',
                                opacity: isGameRunning ? 1 : 0 // Hide iframe completely until running
                            }}
                            allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope; clipboard-write"
                            title="Yendor"
                        />
                    </div>
                </GameLayout>
            </div>
        </>
    );
}