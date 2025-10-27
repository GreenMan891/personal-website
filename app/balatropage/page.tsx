"use client";
import FadeInOverlay from '../../components/FadeInOverlay';
import GameLayout, { Tab } from '../../components/GameLayout';
import styles from '../../components/GameLayout.module.css';

export default function Balatropage() {

    const balatroTabs: Tab[] = [
        {
            id: 'download',
            label: 'Download',
            content: (
                <div className={styles.downloadContainer}>
                    <a href="https://greenman891.itch.io/not-quite-balatro?password=balatro" className={styles.mainDownloadButton}>
                        Download the game
                    </a>
                    <div className={styles.downloadColumnsWrapper}>

                        <div className={styles.downloadColumn}>
                            <h3>How to install if you own a Playdate</h3>
                            <ul className={styles.downloadFeatureList}>
                                <li>Download the file from the big button above</li>
                                <li>Go to <a href='https://play.date/account/sideload/' target="_blank" rel="noopener noreferrer" >play.date/account/sideload/</a>  - If you haven't linked your playdate to an account, now is the time to do so.</li>
                                <li>Drag the .zip file downloaded from this website into the "Sideload a Game" area on the website.</li>
                                <li>The game will start installing on your Playdate, you can find it in the Games tab in settings!</li>
                            </ul>
                            <a href="/downloads/my-app-portable.zip" className={styles.creditLink}>
                                Download .zip
                            </a>
                        </div>
                        <div className={styles.downloadColumn}>
                            <h3>How to install if you don't own a playdate</h3>
                            <ul className={styles.downloadFeatureList}>
                                <li>Download the file from the big button above</li>
                                <li>Go to <a href='https://play.date/dev/' target="_blank" rel="noopener noreferrer" >play.date/dev</a>  and download the latest version of the Playdate SDK</li>
                                <li>In there, you'll find an app called the Playdate Simulator. Open it.</li>
                                <li>Extract the Game download from the .zip to get the .pdx file. Drag that on to the Playdate Simulator and the game will start!</li>
                            </ul>
                            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>
                                View on GitHub
                            </a>
                        </div>

                    </div>
                </div>
            )
        },
        
        {
            id: 'story',
            label: 'Story',
            content: (
                <div className={styles.inspirationsContainer}>

                    <div className={styles.inspirationsSplit}>

                        <div className={styles.textColumn2}>
                            <p className={styles.lead2}>
                                In 2024, a game called Balatro released. I had just gotten a playdate for Christmas the year before, and while I enjoyed the console,
                                i found there was a lack of games with real depth and replay value. When Balatro came out, I felt it was a perfect fit for the playdate,
                                so I just thought to myself, why would I wait around for someone else to port it when I could do it myself?
                            </p>

                            <p>
                                So I worked hard on making the port a reality. I had to learn to use the Playdate SDK as well as Lua, on top of making custom art for the borders, the playing cards, all of the tarot cards, planet cards,
                                spectral cards etc. I learned a lot of new skills, but surprisingly it felt manageable. The playdate uses a 1-bit colour 400x240 display. Having those limitations sounds like it would be more difficult, but it made making art
                                a lot easier, and the low resolution taught me to maximise the space I had to the best of my ability - how can I made the cards big while making the UI still readable?
                            </p>

                            <p>
                                The game took me a couple of months to make, inbetween university work and the fact nobody expected the game from me, meaning I could work as fast or as slow on the game as i'd like.
                            </p>

                            <p>
                                I released the game around November of 2024, in the Playdate Squad discord for play-testing and bug-fixing. My plan was to release it there, and then reach out to Balatro's publisher Playstack for permission
                                to release the game on itch.io for free. Unfortunately, despite emailing several times at several email addresses, and trying to contact them on other social media, I never got a reponse.
                                And when they took down a similar port of Balatro to the Commodore 64, I realised my project would most likely never be approved. So now it sits on this website as proof I can complete a project, even if the IP isn't mine.
                            </p>
                        </div>

                        <div className={styles.imageColumn}>
                            <img
                                src="/balatropage/balatrogameplay.gif"
                                alt="Inspiration Gameplay GIF 1"
                                className={`${styles.sideImage} ${styles.gif}`}
                                loading="lazy"
                            />
                            <a
                                href="/balatropage/notquitebalatrotarots.png"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.thumbnailLink}
                                aria-label="Open highscores image in a new tab"
                            >
                                <img
                                    src="/balatropage/notquitebalatrotarots.png"
                                    alt="HEXA Highscore (click to open full-size)"
                                    className={`${styles.sideImage} ${styles.thumbnail}`}
                                    loading="lazy"
                                />
                            </a>

                            <img
                                src="/balatropage/notquitebalatrogameplay.gif"
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
                        <h4>Here were the most difficult design problems I had to solve developing this game:</h4>
                        <p>
                            User Interface - Balatro is a game with a lot of popup windows and resizing font, making full use of modern resolution sizes. Trying to fit
                            all of the information on to the screen while still signaling what was important was a tricky challenge. The Jokers have to appear up top but still leave room for the cards to go up when played,
                            as well as the popup showing the chips or mult from each card/joker. Fitting this all into 400x240 was tough.
                        </p>
                        <p>
                            Visual Identity - I wanted my game to not only look different from balatro but to stand out on Playdate with it's black and white screen. Initially my only plan was to get the game working and then go from there.
                            But once I got to a good point with the game I started to realize how bland it looked. Plan white background, generic playing cards; nothing was interesting visually about the game. Balatro has such a cool and unique
                            style that I felt my game didn't live up to it in that regard. But most of Balatro's visuals rely on it being able to use colour where I couldn't. So I looked at other playdate games to see what they were doing. One game, called
                            Spilled Mushrooms, made use of a dithered background and thick outlines around it's objects for good contrast and a strong visual Identity. I used the same technique in later builds of the game, to give it more character.
                        </p>
                    </div>
                    <div className={styles.designImageColumn}>
                        <div className={styles.designImageItem}>
                            <img src="/balatropage/earlybalatroproto.gif" alt="Early concept sketch or UI mockup" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/balatropage/laterbalatroproto.gif" alt="Gameplay screenshot showing a specific mechanic" className={styles.designImage} />
                        </div>
                        <div className={styles.designImageItem}>
                            <img src="/balatropage/balatrocurrentstate.png" alt="Score screen or multiplier effect" className={styles.designImage} />
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
                        <img src="/balatropage/notquitebalatrologo.png" alt="Logo" className={styles.logo} />
                    }
                    tabs={balatroTabs}
                >
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/aTnK3H9dF1Y?si=cdM4Ea65Krf9-QZ4" title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen>
                    </iframe>
                </GameLayout>
            </div>
        </>
    );
}