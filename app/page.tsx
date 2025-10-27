// app/page.js
'use client'; // This MUST be the first line

import { useState, useEffect, useRef } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import SceneBackground from '../components/SceneBackground';
import ModelViewer from '../components/ModelViewer';
import ImageOverlay from '../components/ImageOverlay';
import { select } from 'three/tsl';
import MiniModelViewer from '../components/MiniModelViewer';



interface App {
  id: string;
  name: string;
  icon: string;
  page: string;
  modelSrc: string;
  imageSrc: string;
  soundEffect: React.MutableRefObject<HTMLAudioElement | null>
}

export default function Home() {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startCount, setStartCount] = useState(0);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const selectSound = useRef<HTMLAudioElement | null>(null);
  const deselectSound = useRef<HTMLAudioElement | null>(null);
  const hoverSound = useRef<HTMLAudioElement | null>(null);
  const hover2Sound = useRef<HTMLAudioElement | null>(null);
  const startSound = useRef<HTMLAudioElement | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hexaSFX = useRef<HTMLAudioElement | null>(null);
  const balatroSFX = useRef<HTMLAudioElement | null>(null);
  const threeypSFX = useRef<HTMLAudioElement | null>(null);
  const noexcusesSFX = useRef<HTMLAudioElement | null>(null);


  const handleIconMouseEnter = () => {
    playAudio(hoverSound)
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      playAudio(hover2Sound);
    }, 300);
  };

  const handleIconMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
  };

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedPortfolio');

    if (!hasVisitedBefore) {
      setHelpModalOpen(true);
      localStorage.setItem('hasVisitedPortfolio', 'true');
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    selectSound.current = new Audio('/sfx/select.wav');
    selectSound.current.volume = 0.3;
    deselectSound.current = new Audio('/sfx/deselect.wav');
    deselectSound.current.volume = 0.3;
    hoverSound.current = new Audio('/sfx/hover.wav')
    hoverSound.current.volume = 0.2
    hover2Sound.current = new Audio('/sfx/hoverSecond.wav');
    hover2Sound.current.volume = 0.2;
    startSound.current = new Audio('/sfx/start.wav')
    startSound.current.volume = 0.3

    //Game Sounds
    hexaSFX.current = new Audio('/sfx/hexaSFX.mp3')
    hexaSFX.current.volume = 0.1;
    balatroSFX.current = new Audio('/sfx/balatroSFX.mp3')
    balatroSFX.current.volume = 0.25;
    threeypSFX.current = new Audio('/sfx/threeypSFX.mp3')
    threeypSFX.current.volume = 0.05;
    noexcusesSFX.current = new Audio('/sfx/noexcusesSFX.mp3')
    noexcusesSFX.current.volume = 0.1;
  }, []);

  const playAudio = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.warn("Sound blocked", e));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedCount = localStorage.getItem('appStartCount');
    if (savedCount) {
      setStartCount(JSON.parse(savedCount));
    }
  }, []);

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const apps: (App | null)[] = [
    {
      id: 'app1',
      name: 'Hexagon Game',
      icon: '/hexagongame.gif',
      page: '/hexapage',
      modelSrc: '/models/hexagon2.glb',
      imageSrc: '/hexagon-logo.png',
      soundEffect: hexaSFX
    },
    {
      id: 'app2',
      name: 'Balatro for Playdate',
      icon: '/balatro-icon.png',
      page: '/balatropage',
      modelSrc: '/models/balatroplaydate3.glb',
      imageSrc: '/notquitebalatrologo.png',
      soundEffect: balatroSFX
    },
    {
      id: 'app3',
      name: 'Uni 3rd year Project',
      icon: '/carIcon.png',
      page: '/carpage',
      modelSrc: '/models/car.glb',
      imageSrc: '/carLogo.png',
      soundEffect: threeypSFX
    },
    {
      id: 'app4',
      name: 'no excuses.',
      icon: '/noexcusesicon.png',
      page: '/noexcusespage',
      modelSrc: '/models/noexcuses.glb',
      imageSrc: '/noexcuseslogo.png',
      soundEffect: noexcusesSFX
    }, null, null,
    null, null, null, null,
    null, null,
  ];

  const stopCurrentAppSound = () => {
    if (selectedApp && selectedApp.soundEffect && selectedApp.soundEffect.current) {
      selectedApp.soundEffect.current.pause();
      selectedApp.soundEffect.current.currentTime = 0;
    }
  };
  const handleIconClick = (app: App | null) => {

    stopCurrentAppSound();
    if (app) {
      if (selectedApp?.id === app.id) {
        return;
      }
      playAudio(selectSound);
      setSelectedApp(app);
      playAudio(app.soundEffect)
    } else {
      setSelectedApp(null);
      playAudio(deselectSound);
    }
  };
  const handleStartClick = () => {
    if (selectedApp) {

      const newCount = startCount + 1;
      setStartCount(newCount);
      localStorage.setItem('appStartCount', JSON.stringify(newCount));
      playAudio(startSound);
      document.body.classList.add('fade-out');
      setTimeout(() => {
        stopCurrentAppSound();
        router.push(selectedApp.page);
        setTimeout(() => {
          document.body.classList.remove('fade-out');
        }, 500); 
      }, 500);
    }
  };

  const modalClick = () => {
    setAboutModalOpen(true)
    playAudio(startSound)
  };

  return (
    <main className={styles.mainContainer}>


      <div className={styles.imageDisplay}>
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <div className={styles.wifiIcon}>
              <span></span><span></span><span></span>
            </div>
            <div className={styles.internetButton}>Internet</div>
          </div>
          <div className={styles.topRight}>
            <span className={styles.date}>{formatDate(currentTime)}</span>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <div className={styles.batteryIcon}>
              <div className={styles.batteryLevel}></div>
            </div>
          </div>
        </div>

        <div className={styles.bgLayer}>
          <SceneBackground />
        </div>

        <div className={styles.fgLayer}>
          <ModelViewer modelSrc={selectedApp?.modelSrc} />
        </div>

        {selectedApp && (
          <ImageOverlay src={selectedApp.imageSrc} y={-150} scale={0.7} />
        )}
        <div className={styles.bottomBar}>
          <div className={styles.bottomLeft}>
            <div className={styles.playIcon}>▶</div>
            <span className={styles.startCounter}>{startCount}</span>

          </div>
          <div className={styles.bottomRight}>
            <a
              href="https://github.com/GreenMan891"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
              aria-label="My GitHub Profile"
              onClick={() => {
                playAudio(startSound);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.appGrid}>
        <h2 className={styles.gridTitle}>Projects:</h2>
        {apps.map((app, index) => {
          const isSelected = selectedApp && app && selectedApp.id === app.id;
          const iconClassName = `${app ? styles.appIcon : styles.appIconEmpty} ${isSelected ? styles.appIconSelected : ''}`;

          return (
            <div key={index} className={styles.appIconContainer} onMouseEnter={app ? handleIconMouseEnter : undefined}
              onMouseLeave={app ? handleIconMouseLeave : undefined}>
              <div
                className={iconClassName}
                onClick={() => handleIconClick(app)}
                data-app-name={app?.name}
              >
                {app ? (
                  <div className={`${styles.appIconImageWrapper} ${isSelected ? styles.appIconImageWrapperSelected : ''}`}>
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={80}
                      height={80}
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className={styles.emptyIconImageWrapper}>
                    <Image
                      src="/wiichannel.gif"
                      alt="Empty slot"
                      width={80}
                      height={80}
                      unoptimized={true}
                      className={styles.emptyIconImage}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.startButtonContainer}>
        <button
          className={styles.startButton}
          onClick={handleStartClick}
          disabled={!selectedApp}
        >
          Start
        </button>
      </div>

      <button
        className={`${styles.floatingButton} ${styles.bottomLeftFloat}`}
        onClick={() => {
          setAboutModalOpen(true);
          playAudio(startSound);
        }}
        aria-label="About Me"
        onMouseEnter={handleIconMouseEnter}
        onMouseLeave={handleIconMouseLeave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        className={`${styles.floatingButton} ${styles.bottomRightFloat}`}
        onClick={() => {
          setHelpModalOpen(true);
          playAudio(startSound);
        }}
        aria-label="Help"
        onMouseEnter={handleIconMouseEnter}
        onMouseLeave={handleIconMouseLeave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>


      {isAboutModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setAboutModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseButton} onClick={() => setAboutModalOpen(false)}>×</button>
            <div className={styles.modalLayout}>
              <div className={styles.profileColumn}>
                <div className={styles.profilePicture}>
                  <Image
                    src="/path/to/your/profile-picture.jpg"
                    alt="Seb Hall"
                    width={150}
                    height={150}
                    className={styles.profileImage}
                  />
                </div>
                <div className={styles.favoriteGamesContainer}>

                  <h4 className={styles.favoritesTitle}>Favourite Games:</h4>

                  <div className={styles.viewerGrid}>
                    {isMounted && (
                      <>
                        <div className={styles.miniViewerBox}>
                          <MiniModelViewer modelSrc="/models/galaxycase.glb" />
                        </div>
                        <div className={styles.miniViewerBox}>
                          <MiniModelViewer modelSrc="/models/p5rcase.glb" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.textColumn}>
                <h2>About Me</h2>
                <p>Hello! My name is Seb Hall, and I made this website. I'm a computer science graduate looking to get into the games industry as a programmer or a designer.</p>
                <p>I've played games all my life, from the DS and the Wii (I was born in 2003 ok) I fell in love with playing games and spent all day dreaming about someday making them myself. I think games have the power to connect people that no other medium has. My goal felt out of reach for most of my life. I spent a LOT of time playing games and thinking about games, and not much time actually making them. It was only until I went to University that I really honed in on making games, using tools like Unity and the Playdate SDK.</p>
                <p>I chose to study Computer Science at University, as I felt specialising in Game Design or something similar wouldn't give me the programming chops needed to get me a Game Industry job. It also kept my options open, allowing me to branch out into a Computer Science role if working in the Game Industry didn't work out.</p>
                <p>I graduated from University in June of 2025, and found that while I had a few games under my belt and some basic Unity experience, I didn't really have skills that would let me jump right into a job in the Game Industry. In addition, the Job Market was brutal for University Graduates at the time. So I took a year out, just to work on purely my own projects and build up my own skills, with a focus on working on games collaboratively with other people.</p>

                <h4>Skills Mastered:</h4>
                <ul className={styles.skillsList}>
                  <li>Programming in Lua for the Playdate</li>
                  <li>Unity fundamentals & C# (Enough for me to learn anything else required with ease)</li>
                  <li>Java Programming</li>
                  <li>React Web Development, Typescript, JavaScript, HTML, CSS</li>
                  <li>Working in a team</li>
                  <li>Agile</li>
                </ul>

                <h4>Skills With Some Proficiency:</h4>
                <ul className={styles.skillsList}>
                  <li>Python programming</li>
                  <li>Programming in C++ and C</li>
                  <li>Game Design</li>
                  <li>OpenGL</li>
                </ul>

                <h4>Skills I want to learn in the Future:</h4>
                <ul className={styles.skillsList}>
                  <li>Unreal Engine</li>
                  <li>Shaders</li>
                  <li>Blender & 3D Modelling tools</li>
                  <li>Godot</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

      {isHelpModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setHelpModalOpen(false)}>
          <div
            className={`${styles.modalContent} ${styles.helpModalLayout}`}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.modalCloseButton} onClick={() => setHelpModalOpen(false)}>×</button>
            <h2>Welcome to my portfolio!</h2>

            <p className={styles.modalIntroText}>
              It's designed after the home screens of the Wii and 3DS, two consoles I grew up playing.
            </p>

            <h4>How to Use:</h4>
            <ul className={styles.instructionList}>
              <li>Click on any of the apps in the "Projects" section below.</li>
              <li>The top screen will show a 3D model and logo for the selected project.</li>
              <li>Click the "Start" button to visit that project's dedicated page.</li>
            </ul>

            <h4>Other Controls:</h4>
            <ul className={styles.instructionList}>
              <li>Click the person icon in the bottom-left to learn more about me.</li>
              <li>Click the '?' icon in the bottom-right to see this message again.</li>
            </ul>
            <h3>Credits:</h3>
            <ul className={styles.instructionList}>
              <li>Hexagon model for Untitled Hexagon Game: iamsosha (textured by me).</li>
              <li>Car Model for U3YP: Kenney.</li>
              <li>Jingles for each app by MusMus.</li>
              <li>Playdate Model by CB3D.</li>
              <li>Sound effects from the Wii BIOS.</li>
            </ul>

          </div>
        </div>
      )}
    </main>
  );
}

