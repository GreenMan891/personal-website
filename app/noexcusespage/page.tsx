"use client";

import dynamic from 'next/dynamic';
import FadeInOverlay from '../../components/FadeInOverlay';
import GameLayout, { Tab } from '../../components/GameLayout';
import styles from '../../components/GameLayout.module.css';

const PDFViewer = dynamic(() => import('../../components/PDFViewer'), {
    ssr: false,
    loading: () => <p>Loading PDF...</p>
});


export default function Noexcusespage() {
    const noexcusesTabs: Tab[] = [
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
                                <p><strong>Use the WASD Keys to move around.</strong></p>
                            </div>
                            <div className={styles.controlImageItem}>
                                <img src="/controlsMouseRight.png" alt="Left Click to Shoot" className={styles.controlImage} />
                                <p><strong>Left Click to Shoot.</strong></p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.guideSection}>
                        <h3>How to play:</h3>

                        <div className={styles.guideBlock}>
                            <img src="/noexcusespage/noexcusesshotclip.gif" alt="GIF showing the main objective" className={styles.gameplayGif2} />
                            <p>You are placed into an arena with one other person. You have nothing but a Desert Eagle. Your goal? Shoot them in the head. First to do that three times wins the game.</p>
                        </div>
                        <h4></h4>
                        <div className={styles.guideBlock}>
                            <p>The obstacles placed around the arena change every time someone dies, so the level is different every kill. You can't learn map advantages here.</p>
                            <img src="/noexcusespage/layout.gif" alt="GIF showing a core mechanic in action" className={styles.gameplayGif} />
                        </div>
                        <div className={styles.guideBlock}>
                            <p>Will you prove that you have the best aim, and that you don't need excuses?</p>
                        </div>
                    </div>
                </div >
            )
        },
        {
            id: 'credits',
            label: 'University Report',
            content: (
                <div className={styles.pdfContainer}>
                    <PDFViewer file="noexcusespage/noexcusesdesignreport.pdf" />
                </div>
            ),
        },
        {
            id: 'design',
            label: 'Design',
            content: (
                <div className={styles.designContainer}>

                    <div className={styles.designTextColumn}>
                        <h4>Here are the design decisions that lead to this game's creation.</h4>
                        <p>
                            For our Game Development module, the final project was creating a game in Unity that was 3D. My initial idea was a 3D platformer, but after deciding that the scope would be too large, I switched gears to making a first person shooter.
                            My goal was to hone in on the aim, movement, and networking, which I consider the fundamentals of an FPS game. The map layout changing every kill was a fun and simple way to not have to design map layouts for this project.
                        </p>
                        <p>
                            I chose a 1v1 format as I'd wanted a game that pits people against eachother in an FPS for a while, and always felt other FPS games didn't have a fair and fun version of this. After creating this game, games such as STRAFTAT and Valorant's Skirmish mode released,
                            providing a fair format for 1v1 battles. 
                        </p>
                        <p>
                            I wanted the movement and aiming to be precise but unrealistic. The aiming uses Hitscan, and there's no movement error, because it's so fun to jumpshoot. The movement is designed after the Quake 3 movement, which I always considered to be some of the
                            best FPS movement out there; floaty and fast but not over the top.
                        </p>
                    </div>

                    <div className={styles.designImageColumn}>
                        <div className={styles.designImageItem}>
                            <img src="/noexcusespage/concept.png" alt="Early concept sketch or UI mockup" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/noexcusespage/prototype.png" alt="Gameplay screenshot showing a specific mechanic" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/noexcusespage/finalproduct.png" alt="Score screen or multiplier effect" className={styles.designImage} />
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
                        <img src="/noexcusespagelogo.png" alt="Hexa Logo" className={styles.logo} />
                    }
                    tabs={noexcusesTabs}
                >
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/ummPFC2t3iA?si=rzrS0lxegVLJisXY" title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share" referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen> 
                    </iframe>
                </GameLayout>
            </div>
        </>
    );
}