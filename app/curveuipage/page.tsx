"use client";
import { useRef, useState, useEffect } from 'react';
import FadeInOverlay from '../../components/FadeInOverlay';
import GameLayout, { Tab } from '../../components/GameLayout';
import styles from '../../components/GameLayout.module.css';

export default function CurveUIPage() {
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

    const curveUITabs: Tab[] = [
        {
            id: 'whatisit',
            label: 'What is Curve UI?',
            content: (
                <div className={styles.howToPlayContainer} style={{ flexDirection: 'column' }}>
                    <div className={styles.controlsSection} style={{ flex: '0 0 auto' }}>
                        <p>Curve UI is a custom theme for the Android frontend Cocoon. It is designed to be used on Dual-Screen Android devices such as the AYN Thor.</p>
                        <p>Cocoon is an Android app designed to act similar to homescreens found on the DS/3DS, allowing you to launch emulators and games from a single interface. As of writing this, it has 2,265 downloads on the Cocoon theme store.</p>
                        <p>The theme is designed to take advantage of Cocoon's Hero Gradient tool, as setting it as low as possible allows game images to perfectly fit into the center ring of the top wallpaper (See Video).</p>
                    </div>

                    <div className={styles.downloadColumnsWrapper} style={{ flex: 1, minHeight: 0 }}>
                        <div className={styles.guideSection} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ margin: 0 }}>I created two animated backgrounds for the theme, Echoing the Frutiger Aero aesthetic, that when synced up show light flowing seamlessly from one screen to the other.</p>
                            <img src="/curveuipage/curveUIWallpaper.png" alt="Navigating the Dungeon" className={styles.sideImage} style={{ flex: 1, objectFit: 'cover', minHeight: 0 }} />
                        </div>
                        <div className={styles.guideSection} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ margin: 0 }}>I also created custom icons and heroes for every console playable on Android, from the NES all the way to the Switch. The designs use UsagiShade's iiSU icons as a template, with each console's primary colours in the background.</p>
                            <img src="/curveuipage/curveUIIcons.png" alt="Coding & Upgrades" className={styles.sideImage} style={{ flex: 1, objectFit: 'cover', minHeight: 0 }} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'ondevice',
            label: 'On Device',
            content: (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding: '0px' }}>
                    <img
                        src="/curveuipage/ondevice.jpg"
                        alt="On Device"
                        style={{ aspectRatio: '3/4', maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
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
                            <p style={{ margin: 0 }}>This was my moodboard. As you can see from this website, I love the Wii, Wii U, and 3DS aesthetics and I wanted to combine the cleanliness of those with the futurism of the Windows Vista background. I love that background as a graphic design challenge, as being a junior designer, I didn't know where to start in recreating it before creating this theme. I also love a cluttered home screen with tons of icons, as seen in the 3DS picture on the right. The idea of that many amazing games cluttered together like that just excites me, so I wanted to bring a similar kind of busy colourful pop to the icons.</p>
                        </div>
                        <div className={styles.imageColumn} style={{ flex: '0 0 280px', padding: 0 }}>
                            <img src="/curveuipage/moodboard.png" alt="Moodboard" className={`${styles.sideImage} ${styles.gif}`} style={{ width: '100%', maxHeight: 'none' }} />
                        </div>
                    </div>

                    <div className={styles.inspirationsSplit} style={{ marginBottom: '25px', alignItems: 'center' }}>
                        <div className={styles.textColumn}>
                            <p style={{ margin: 0 }}>I used Canva's motion animation tool Cavalry for this project, since it was recently touted as a free alternative to After Effects and I'd seen someone make a Frutiger Aurora animation with it. It was easy to pick up and use, and fun to experiment with the tool as I didn't have a final idea of what it would look like in my head. I started wanting the lines to be white, but I struggled to give them the glass-like texture I wanted, so I decided most of the colour would come from the lines instead.</p>
                        </div>
                        <div className={styles.imageColumn} style={{ flex: '0 0 280px', padding: 0 }}>
                            <img src="/curveuipage/version1.png" alt="Version1.png" className={`${styles.sideImage} ${styles.thumbnail}`} style={{ width: '100%', maxHeight: 'none' }} />
                        </div>
                    </div>

                    <div className={styles.inspirationsSplit} style={{ alignItems: 'center' }}>
                        <div className={styles.textColumn}>
                            <p style={{ margin: 0 }}>I also made these orbs, which you can see a selection of in the right hand image. They were designed to replace the console heroes but instead I decided to make them fullscreen so that with the gradient they would match the game heroes, which have faded edges rather than look round like an orb.</p>
                            <p>Overall, I enjoyed this project a lot. It taught me a lot about graphic design and motion design. I'd like to make a version 2 sometime though, as I felt my skills improved between the top and bottom wallpapers, and neither image has the depth I wanted to achieve. It looks like a 2D image rather than a 3D space.</p>
                        </div>
                        <div className={styles.imageColumn} style={{ flex: '0 0 280px', padding: 0 }}>
                            <img src="/curveuipage/orbs.png" alt="Orbs" className={styles.sideImage} style={{ width: '100%', maxHeight: 'none' }} />
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
                        <img src="/curveUILogo2.png" alt="CurveUI Logo" className={styles.logo} />
                    }
                    githubLink='https://cocoon-shell.com/themes/?type=theme&id=curve-ui-d09000'
                    githubText='Theme Store'
                    tabs={curveUITabs}
                >
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/jNgdkKAs_ec?autoplay=1&loop=1&playlist=jNgdkKAs_ec&mute=1" title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen>
                    </iframe>
                </GameLayout>
            </div>
        </>
    );
}