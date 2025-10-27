"use client";

import dynamic from 'next/dynamic';
import FadeInOverlay from '../../components/FadeInOverlay';
import GameLayout, { Tab } from '../../components/GameLayout';
import styles from '../../components/GameLayout.module.css';

const HexaGame = dynamic(
    () => import('hexa-game-core').then((mod) => mod.Hexa),
    {
        ssr: false,
        loading: () => <p>Loading Game...</p>
    }
);

export default function Hexapage() {
    const hexaTabs: Tab[] = [
        {
            id: 'howtoplay',
            label: 'How To Play',
            content: (
                <div className={styles.howToPlayContainer}>
                    <div className={styles.controlsSection}>
                        <h3>Controls:</h3>
                        <div className={styles.controlImages}>
                            <div className={styles.controlImageItem}>
                                <img src="/controlsWASD.png" alt="WASD Keys for movement" className={styles.controlImage} />
                                <p><strong>Use the WASD Keys to move the cursor.</strong></p>
                            </div>
                            <div className={styles.controlImageItem}>
                                <img src="/controlsJK.png" alt="J and K rotate left and right." className={styles.controlImage} />
                                <p><strong>J and K rotate hexagons left and right.</strong></p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.guideSection}>
                        <h3>How to play:</h3>

                        <div className={styles.guideBlock}>
                            <img src="/hexapage/hexaclip1.gif" alt="GIF showing the main objective" className={styles.gameplayGif} />
                            <p>Rotate triangles found in the grid to make a HEXAGON of all the same colour! When made, it explodes into different colour triangles, giving you score and increasing your timer.</p>
                        </div>
                        <h4></h4>
                        <div className={styles.guideBlock}>
                            <p>The timer, found in the top left, is your main enemy. Making a HEXAGON will increase your time left, but the time given per HEXAGON decreases the more you make them.</p>
                            <img src="/hexapage/hexaclip2.gif" alt="GIF showing a core mechanic in action" className={styles.gameplayGif} />
                        </div>
                        <div className={styles.guideBlock}>
                            <p>How long can you last? Can you get a high score?</p>
                        </div>
                    </div>
                </div >
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
                            <p className={styles.creditRole}>Game programming: title, core gameplay, scoring</p>
                            <a href="/" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                                You're already on my website
                            </a>
                        </div>
                        <div className={styles.creditBox}>
                            <h3>Oliver Fogelin</h3>
                            <p className={styles.creditRole}>Website setup, Hexagon board programming, Leaderboards & Sign in</p>
                            <a href="https://olifog.com" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                                View Website
                            </a>
                        </div>
                    </div>
                    <div className={`${styles.creditBox} ${styles.bottomBox}`}>
                        <h3>Rae</h3>
                        <p className={styles.creditRole}>Original HEXA concept & Design</p>
                        <a href="https://rae.wtf" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                            View Website
                        </a>
                    </div>
                </div>
            )
        },
        {
            id: 'inspirations',
            label: 'Inspirations',
            content: (
                <div className={styles.inspirationsContainer}>
                    <div className={styles.inspirationsSplit}>
                        <div className={styles.textColumn}>
                            <p className={styles.lead}>
                                Last year, a game called HEXA came out for a console called the Playdate.
                                The game completely enraptured me, thanks to its simple design and
                                addictive high score chasing gameplay. I felt like I'd discovered
                                the next Tetris.
                            </p>

                            <p>
                                I immediately climbed to the top of the highscore leaderboard, playing for long stretches every day. The game
                                found a small community of dedicated fans but no matter how hard they tried,
                                nobody could score as well as I could.
                            </p>

                            <p>
                                Therefore, I was longing for a port of HEXA to other platforms, to find
                                someone out there as good as HEXA as I was. Having seen the success of
                                Tetris games on the web, such as jstris and tetr.io, I figured the web would
                                be the best place for a game like this.
                            </p>

                            <p>
                                This prototype was developed between my friend Oli and I to pitch to the
                                game's original developer Rae. Combined we had the technical capabilities
                                to turn HEXA into something much bigger than it is. Sadly they rejected this
                                prototype as they were working on their own PC port (see gif on the right),
                                and the version you can play above has all HEXA assets removed to make it
                                royalty-free.
                            </p>
                        </div>
                        <div className={styles.imageColumn}>
                            <img
                                src="/hexapage/hexaInspiration.gif"
                                alt="Inspiration Gameplay GIF 1"
                                className={`${styles.sideImage} ${styles.gif}`}
                                loading="lazy"
                            />
                            <a
                                href="/hexapage/hexaHighscore.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.thumbnailLink}
                                aria-label="Open highscores image in a new tab"
                            >
                                <img
                                    src="/hexapage/hexaHighscore.png"
                                    alt="HEXA Highscore (click to open full-size)"
                                    className={`${styles.sideImage} ${styles.thumbnail}`}
                                    loading="lazy"
                                />
                            </a>

                            <img
                                src="/hexapage/hexaNew.gif"
                                alt="Inspiration Gameplay GIF 2"
                                className={`${styles.sideImage} ${styles.gif}`}
                                loading="lazy"
                            />
                        </div>

                    </div>
                </div>
            ),
            hasNotification: true
        },
        {
            id: 'design',
            label: 'Design',
            content: (
                <div className={styles.designContainer}>
                    <div className={styles.designTextColumn}>
                        <h4>Since the full game was never made, here's what we had planned:</h4>
                        <p>
                            This initial prototype was created with the idea of just creating a HD version of the black-and-white original. We designed the board layout to be flexible to any amount of hexagons, for some fun modes in the future, but for the prototype just stuck with the basic layout.
                        </p>
                        <p>
                            This was our plan for the main menu. The idea from the original HEXA is that the board is on the underside of the ship, so having the main menu on the top would be a fun idea. Hovering over each part would fill a section of the screen with information about that mode.
                        </p>
                        <p>
                            We had plans for an in depth ranking system too in order to reward players for climbing up in high scores, as well as a multiplayer mode as seen here. Players would use powerups similar to the bomb and 2x in the regular game to attack and debuff other players, to see who's timer could last the longest.
                        </p>
                    </div>
                    <div className={styles.designImageColumn}>
                        <div className={styles.designImageItem}>
                            <img src="/hexapage/hexaproto.gif" alt="Early concept sketch or UI mockup" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/hexapage/playhexamenuconcept.png" alt="Gameplay screenshot showing a specific mechanic" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/hexapage/playhexaonlineconcept.png" alt="Score screen or multiplier effect" className={styles.designImage} />
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
                        <img src="/hexagonHorizontal.png" alt="Hexa Logo" className={styles.logo} />
                    }
                    tabs={hexaTabs} 
                >
                    <div style={{ position: 'relative', width: '1100px', height: '618.75px' }}>
                        <HexaGame
                            initialWidth={1100}
                            initialHeight={618.75}
                            assetPrefix={'/'}
                        />
                    </div>
                </GameLayout>
            </div>
        </>
    );
}