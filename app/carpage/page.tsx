"use client";
import dynamic from 'next/dynamic';
import FadeInOverlay from '../../components/FadeInOverlay';
import GameLayout, { Tab } from '../../components/GameLayout';
import styles from '../../components/GameLayout.module.css';
import UnityGame from '../../components/UnityGame';
const PDFViewer = dynamic(() => import('../../components/PDFViewer'), {
    ssr: false,
    loading: () => <p>Loading PDF...</p>
});

export default function Carpage() {

    const carTabs: Tab[] = [
        {
            id: 'tutorial',
            label: 'Tutorial',
            content: (
                <div className={styles.pdfContainer}>
                    <PDFViewer file="carPage/3ypTutorial.pdf" />
                </div>
            )
        },

        {
            id: 'report',
            label: 'University Report',
            content: (
                <div className={styles.pdfContainer}>
                    <PDFViewer file="carPage/3ypOverallReport.pdf" />
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
                        <h4>Here are my design choices when making this game:</h4>
                        <p>
                            When the project's description only specified that the game needed to be a racing game, I knew I wanted to make a game less similar to the Forza franchise and closer to Mario Kart.
                            I grew up playing Mario Kart Wii and have played every subsequent entry since. They are easily my favourite kind of racing games, so I wanted to make a Mario Kart-styled racing game, with proper drifting mechanics and physics. 
                            Initially, I imported a model of Mario Kart Wii's Luigi Circuit, the first track in that game. I did this just to test how the physics of my car compared to driving in Mario Kart. I would then
                            tweak values accordingly, to try and get my car to feel as close to the cars found in Mario Kart.
                        </p>
                        <p>
                            My biggest mistake for the project was not communicating enough with my supervisor. I was under the impression that the tutorial part of the project was the most important, so spent hours upon hours
                            making sure it was understandable and clear, and keeping the game small so it was within the scope of a tutorial. Meanwhile the main part of the project was actually the game, with the tutorial being much less important.
                            My supervisor never mentioned that when we discussed, but it's my fault for not clarifying on something I assumed to be the case. Either way I'm still happy with the way the game turned out.
                        </p>
                    </div>
                    <div className={styles.designImageColumn}>
                        <div className={styles.designImageItem}>
                            <img src="/carpage/carPageProto.png" alt="Early concept sketch or UI mockup" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/carpage/carPageLuigi.png" alt="Gameplay screenshot showing a specific mechanic" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/carpage/carPageFinal.png" alt="Score screen or multiplier effect" className={styles.designImage} />
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
                        <img src="/carpage/carLogoForPage2.png" alt="Logo" className={styles.logo} />
                    }
                    tabs={carTabs}
                >
                    <UnityGame buildPath="/unity/WebBuild" />
                </GameLayout>
            </div>
        </>
    );
}