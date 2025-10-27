import { Input, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { externalApi } from "../externalApi";
import { Board } from "../lib/board";
export class Game extends Scene {
    constructor() {
        super("Game");
    }
    alternateMode = false;
    hexagons = [];
    init(data) {
        this.score = 0;
        this.totalHexas = 0;
        this.timeLeft = 45;
        this.isGameOver = false;
        this.lastHorizontalLeft = undefined;
        this.comboMult = 0;
        this.movesBonus = 5;
        this.alternateMode = data.alternateMode || false;
    }
    wKey;
    aKey;
    sKey;
    dKey;
    jKey;
    kKey;
    graphics;
    cursor;
    twox;
    twoxgroup;
    score = 0;
    scoreText;
    bestText;
    totalHexas = 0;
    board;
    comboMult = 0;
    movesBonus = 5;
    timerText;
    timerEvent;
    timeLeft = 45;
    gameStartTime = 0;
    totalTimePlayed = 0;
    //gameOver: boolean = false;
    lastHorizontalLeft;
    highScore = 0;
    isGameOver = false;
    gameOverContainer;
    gameOverScreenShownAt = null;
    volumeSliderContainer;
    volumeSliderHandle;
    //backgroundFar!: Phaser.GameObjects.TileSprite;
    create() {
        if (this.alternateMode) {
            this.hexagons = [1, 4];
        }
        else {
            this.hexagons = [2, 3];
        }
        if (!this.input.keyboard) {
            throw new Error("Need a keyboard to play");
        }
        this.wKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.D);
        this.jKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.J);
        this.kKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.K);
        this.graphics = this.add.graphics();
        const _anim = this.anims.create({
            key: "wild_anim",
            frames: this.anims.generateFrameNumbers("wild-anim-sheet", {
                start: 0,
                end: -1,
            }),
            frameRate: 4,
            repeat: -1,
        });
        this.cursor = this.add.image(0, 0, "cursor");
        const twoxgroup = [];
        const bombgroup = [];
        const wildgroup = [];
        let num2x = 0;
        this.hexagons.forEach((number) => {
            num2x += number * 6;
        });
        for (let i = 0; i < num2x; i++) {
            const twox = this.add.image(-50, -50, "2x");
            twoxgroup.push(twox);
            const bomb = this.add.image(-50, -50, "Bomb");
            bombgroup.push(bomb);
            const wild = this.add.sprite(-150, -150, "wild-anim-sheet");
            wild.play("wild_anim");
            wildgroup.push(wild);
        }
        this.board = new Board(this.graphics, this.cursor, twoxgroup, bombgroup, wildgroup, this.hexagons, 100, 100, this.time, Array.from({ length: 5000 }, () => Math.floor(Math.random() * 3)), Array.from({ length: 5000 }, () => {
            const rand = Math.random() * 50;
            if (rand < 3)
                return "2x";
            if (rand < 4)
                return "Bomb";
            if (rand < 5)
                return "Wild";
            return undefined;
        }));
        const savedScore = localStorage.getItem("hexa-highscore");
        this.highScore = savedScore ? parseInt(savedScore, 10) : 0;
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
            color: "#FFFFFF",
            fontFamily: "Impact",
            fontSize: "48px",
        });
        this.bestText = this.add.text(20, 80, `Best: ${this.highScore}`, {
            color: "#AAAAAA",
            fontFamily: "Impact",
            fontSize: "36px",
        });
        void (async () => {
            try {
                const getScores = externalApi.getScores;
                if (getScores) {
                    const rows = await getScores({ limit: 1, orderBy: "score", orderDirection: "desc" });
                    const best = rows?.[0]?.score ?? this.highScore;
                    if (typeof best === "number" && Number.isFinite(best)) {
                        this.highScore = best;
                        this.bestText.setText(`Best: ${this.highScore}`);
                    }
                }
            }
            catch (_e) {
                // ignore errors, fall back to local storage value
            }
        })();
        this.timerText = this.add.text(400, 15, `${this.timeLeft}`, {
            color: "#FFFFFF",
            fontFamily: "Impact",
            fontSize: "75px",
        });
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });
        this.createVolumeSlider();
        this.scale.on("resize", this.onResize, this);
        this.onResize({ width: this.scale.width, height: this.scale.height });
        this.gameStartTime = this.time.now;
        EventBus.emit("current-scene-ready", this);
    }
    onResize(gameSize) {
        const centerX = gameSize.width / 2;
        const centerY = gameSize.height / 2;
        if (this.board) {
            this.board.center.x = centerX;
            this.board.center.y = centerY;
        }
        if (this.scoreText) {
            this.scoreText.setPosition(20, 20);
        }
        if (this.bestText) {
            this.bestText.setPosition(20, 80);
        }
        if (this.timerText) {
            this.timerText.setPosition(gameSize.width - 20, 20);
        }
        if (this.volumeSliderContainer) {
            const sliderWidth = this.volumeSliderContainer.getBounds().width;
            this.volumeSliderContainer.x = gameSize.width - sliderWidth / 2 - 30;
            this.volumeSliderContainer.y = 45;
        }
        if (this.isGameOver && this.gameOverContainer) {
            this.gameOverContainer.setPosition(centerX, centerY);
        }
    }
    updateScore = (hexagon, comboMult) => {
        let currentColour = 0xff0000;
        const powerups = [];
        let scoreToAdd = 0;
        let scoreToMult = 1;
        // this.board
        //   .getHexagon(this.board.cursor.x, this.board.cursor.y)
        hexagon.forEach((triangle) => {
            currentColour = triangle.colour ?? 0;
            //if (triangle.powerup != undefined) {
            //  powerups.push(triangle.powerup); what is blud on about?!
            //}
            if (triangle.powerup !== undefined) {
                powerups.push(triangle.powerup);
            }
        });
        console.log(currentColour);
        if (currentColour === 0) {
            scoreToAdd += 200;
        }
        else if (currentColour === 1) {
            scoreToAdd += 150;
        }
        else if (currentColour === 2) {
            scoreToAdd += 100;
        }
        for (let i = 0; i < powerups.length; i++) {
            if (powerups[i] === "2x") {
                scoreToMult = 2;
            }
            else if (powerups[i] === "Bomb") {
                this.board.explode();
                break;
            }
        }
        //moves bonus
        scoreToAdd *= scoreToMult;
        scoreToAdd *= comboMult;
        scoreToAdd += this.movesBonus * 10;
        this.score += scoreToAdd;
        this.scoreText.setText(`Score: ${this.score}`);
        this.movesBonus = 5;
        if (scoreToMult === 2) {
            this.resetTimer(true);
        }
        else {
            this.resetTimer(false);
        }
    };
    updateTimer() {
        this.timeLeft--;
        this.timerText.setText(`${this.timeLeft}`);
        if (this.timeLeft === 0) {
            this.timerEvent.paused = true;
        }
    }
    resetTimer = (twox) => {
        if (twox === true) {
            this.timeLeft = Math.floor(Math.min(this.timeLeft * 1000 +
                11000 * Math.exp(-0.105 * this.totalHexas) +
                2750, 60000) / 1000);
        }
        else {
            this.timeLeft = Math.floor(Math.min(this.timeLeft * 1000 + 7000 * Math.exp(-0.105 * this.totalHexas) + 1750, 60000) / 1000);
        }
        this.timerText.setText(`${this.timeLeft}`);
    };
    hexa = (hexas, hexagon) => {
        this.sound.play("hexa");
        let has2x = false;
        let hasBomb = false;
        hexagon.forEach((Triangle) => {
            if (Triangle.powerup === "2x") {
                has2x = true;
            }
            if (Triangle.powerup === "Bomb") {
                hasBomb = true;
            }
        });
        if (has2x) {
            this.sound.play("select");
        }
        if (hasBomb) {
            this.sound.play("boom");
        }
        this.comboMult += 1;
        const center = new Phaser.Math.Vector2(this.cameras.main.centerX, this.cameras.main.centerY);
        const logo = this.add
            .image(center.x, center.y, "web_logo")
            .setDepth(200)
            .setAlpha(1)
            .setScale(0.6);
        this.tweens.add({
            targets: logo,
            scale: 0.7,
            duration: 400,
            ease: "Sine.easeInOut",
        });
        this.tweens.add({
            targets: logo,
            alpha: 0,
            duration: 800,
            ease: "Sine.easeIn",
            onComplete: () => {
                logo.destroy();
            },
        });
        console.log("HEXA!!!!", hexas);
        this.cameras.main.shake(100, 0.01);
        this.totalHexas += 1;
        this.updateScore(hexagon, this.comboMult);
    };
    update(time, _delta) {
        this.graphics.clear();
        time = this.time.now / 1000;
        if (!this.board.scoringHexa && !this.isGameOver) {
            this.readInput();
        }
        if (!this.isGameOver && this.timeLeft === 0) {
            this.isGameOver = true;
            const gameEndTime = this.time.now;
            this.totalTimePlayed = gameEndTime - this.gameStartTime;
            const _rect = this.add
                .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5)
                .setOrigin(0, 0);
            this.time.delayedCall(2000, () => {
                this.gameOverScreen();
            });
        }
        if (this.isGameOver &&
            Input.Keyboard.JustDown(this.jKey) &&
            this.gameOverScreenShownAt !== null &&
            this.time.now - this.gameOverScreenShownAt >= 2000) {
            this.scene.start("MainMenu");
            return;
        }
        this.timerText.setPosition(this.scale.width * 0.65, this.scale.height * 0.25);
        if (this.alternateMode === true) {
            const scaleXOscillation = 0.1 * Math.sin(time * 1.4);
            const scaleYOscillation = 0.1 * Math.cos(time * 0.8);
            this.board.scale.x = 1 + scaleXOscillation;
            this.board.scale.y = 1 + scaleYOscillation;
        }
        this.board.scale.x = 2.5;
        this.board.scale.y = 2.5;
        this.board.draw();
    }
    gameOverScreen() {
        this.timerEvent.paused = true;
        const postScore = externalApi.postScore;
        if (postScore) {
            void postScore(this.score);
        }
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("hexa-highscore", this.highScore.toString());
        }
        const panelWidth = this.scale.width * 0.5;
        const panelHeight = this.scale.height * 0.65;
        const centerX = this.cameras.main.centerX;
        this.gameOverScreenShownAt = this.time.now;
        const titleStyle = {
            fontFamily: "Impact",
            fontSize: "64px",
            color: "#ffffff",
            align: "center",
        };
        const labelStyle = {
            fontFamily: "Impact",
            fontSize: "48px",
            color: "#dddddd",
            align: "center",
        };
        this.gameOverContainer = this.add.container(centerX, this.scale.height + panelHeight / 2);
        this.gameOverContainer.setDepth(100);
        const background = this.add.rectangle(0, 0, panelWidth, panelHeight, 0x000000, 1);
        background.setStrokeStyle(15, 0xffffff);
        const totalSeconds = this.totalTimePlayed / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const displaySeconds = (Math.floor(totalSeconds) % 60).toString().padStart(2, '0');
        const formattedTime = `${minutes}:${displaySeconds}`;
        const titleText = this.add
            .text(0, -panelHeight / 2 + 60, "GAME OVER", titleStyle)
            .setOrigin(0.5);
        const labelCount = 4;
        const labelSpacing = 80;
        const totalLabelsHeight = (labelCount - 1) * labelSpacing;
        const startY = -totalLabelsHeight / 2;
        const scoreLabel = this.add
            .text(0, startY + 0 * labelSpacing, `Score: ${this.score.toString()}`, labelStyle)
            .setOrigin(0.5);
        const hexasLabel = this.add
            .text(0, startY + 1 * labelSpacing, `Hexas: ${this.totalHexas.toString()}`, labelStyle)
            .setOrigin(0.5);
        const highLabel = this.add
            .text(0, startY + 2 * labelSpacing, `Best: ${this.highScore.toString()}`, labelStyle)
            .setOrigin(0.5);
        const timePlayedLabel = this.add
            .text(0, startY + 3 * labelSpacing, `Time Played: ${formattedTime}`, labelStyle)
            .setOrigin(0.5);
        const restartPromptStyle = {
            fontFamily: "Impact",
            fontSize: "58px",
            color: "#dddddd",
            align: "center",
        };
        const restartText = this.add
            .text(0, panelHeight / 2 - 60, "Press J to Restart", restartPromptStyle)
            .setOrigin(0.5);
        this.gameOverContainer.add([
            background,
            titleText,
            scoreLabel,
            hexasLabel,
            highLabel,
            timePlayedLabel,
            restartText,
        ]);
        this.tweens.add({
            targets: this.gameOverContainer,
            y: this.cameras.main.centerY,
            duration: 700,
            ease: "Back.easeOut",
        });
    }
    resetCombo() {
        this.comboMult = 0;
    }
    readInput() {
        const movements = [
            {
                key: this.aKey,
                lastLeft: true,
                checks: [
                    {
                        deltaX: () => -1,
                        deltaY: () => 0,
                    },
                ],
            },
            {
                key: this.dKey,
                lastLeft: false,
                checks: [
                    {
                        deltaX: () => 1,
                        deltaY: () => 0,
                    },
                ],
            },
            {
                key: this.wKey,
                checks: [
                    {
                        deltaX: () => 0,
                        deltaY: () => -1,
                    },
                    {
                        deltaX: (y) => (y % 2 === 0 ? 1 : -1),
                        deltaY: () => -1,
                    },
                ],
            },
            {
                key: this.sKey,
                checks: [
                    {
                        deltaX: (x) => {
                            return x % 2 !== 0 ? 1 : 0;
                        },
                        deltaY: () => 1,
                    },
                ],
            },
        ];
        movements.forEach(({ key, lastLeft, checks }) => {
            if (key === this.wKey)
                return;
            if (Input.Keyboard.JustDown(key)) {
                checks.some(({ deltaX, deltaY }, _idx) => {
                    const curX = this.board.cursor.x;
                    const curY = this.board.cursor.y;
                    const newY = curY + deltaY();
                    const newX = curX + deltaX(curX);
                    if (this.board.checkCursorPos(newX, newY)) {
                        this.board.cursor.x = newX;
                        this.board.cursor.y = newY;
                        this.sound.play("move");
                        if (typeof lastLeft !== "undefined") {
                            this.lastHorizontalLeft = lastLeft;
                        }
                        return true;
                    }
                    return false;
                });
            }
        });
        if (Input.Keyboard.JustDown(this.wKey)) {
            if (typeof this.lastHorizontalLeft === "undefined") {
                const upChecks = movements.find((m) => m.key === this.wKey)?.checks;
                upChecks?.some(({ deltaX, deltaY }) => {
                    const newY = this.board.cursor.y + deltaY();
                    const newX = this.board.cursor.x + deltaX(this.board.cursor.y);
                    if (this.board.checkCursorPos(newX, newY)) {
                        this.board.cursor.x = newX;
                        this.board.cursor.y = newY;
                        this.sound.play("move");
                        return true;
                    }
                    return false;
                });
            }
            else {
                const parityDiag = this.board.cursor.y % 2 === 0 ? 1 : -1;
                const preferredDiagDx = this.lastHorizontalLeft
                    ? parityDiag
                    : -parityDiag;
                const prefNewX = this.board.cursor.x + preferredDiagDx;
                const prefNewY = this.board.cursor.y - 1;
                if (this.board.checkCursorPos(prefNewX, prefNewY)) {
                    this.board.cursor.x = prefNewX;
                    this.board.cursor.y = prefNewY;
                    this.sound.play("move");
                }
                else {
                    const straightX = this.board.cursor.x;
                    const straightY = this.board.cursor.y - 1;
                    if (this.board.checkCursorPos(straightX, straightY)) {
                        this.board.cursor.x = straightX;
                        this.board.cursor.y = straightY;
                        this.sound.play("move");
                    }
                    else {
                        const otherDiagDx = -preferredDiagDx;
                        const otherNewX = this.board.cursor.x + otherDiagDx;
                        const otherNewY = this.board.cursor.y - 1;
                        if (this.board.checkCursorPos(otherNewX, otherNewY)) {
                            this.board.cursor.x = otherNewX;
                            this.board.cursor.y = otherNewY;
                            this.sound.play("move");
                        }
                    }
                }
            }
        }
        if (Input.Keyboard.JustDown(this.jKey)) {
            this.resetCombo();
            if (this.movesBonus > 0) {
                this.movesBonus -= 1;
            }
            this.board.rotate(false);
            this.sound.play("swap");
            this.board.checkHexa(this.hexa, this.comboMult);
        }
        else if (Input.Keyboard.JustDown(this.kKey)) {
            if (this.movesBonus > 0) {
                this.movesBonus -= 1;
            }
            this.resetCombo();
            this.board.rotate(true);
            this.sound.play("swap");
            this.board.checkHexa(this.hexa, this.comboMult);
        }
    }
    createVolumeSlider() {
        const sliderWidth = 200;
        const sliderHeight = 10;
        const _handleWidth = 16;
        const handleHeight = 30;
        const containerX = this.scale.width - sliderWidth / 2 - 30;
        const containerY = 45;
        this.volumeSliderContainer = this.add.container(containerX, containerY);
        const leftTrack = this.add
            .rectangle(0, 0, sliderWidth / 2, sliderHeight, 0xffffff)
            .setOrigin(0, 0.5);
        const rightTrack = this.add
            .rectangle(0, 0, sliderWidth / 2, sliderHeight, 0x888888)
            .setOrigin(0, 0.5);
        this.volumeSliderContainer.add([leftTrack, rightTrack]);
        const outerCircle = this.add
            .circle(0, 0, handleHeight / 2.5, 0xffffff)
            .setOrigin(0.5);
        const innerCircle = this.add
            .circle(0, 0, handleHeight / 4.5, 0x888888)
            .setOrigin(0.5);
        this.volumeSliderHandle = this.add.container(0, 0, [
            outerCircle,
            innerCircle,
        ]);
        this.volumeSliderHandle.setSize(handleHeight, handleHeight);
        this.volumeSliderHandle.setInteractive();
        this.input.setDraggable(this.volumeSliderHandle);
        this.volumeSliderContainer.add(this.volumeSliderHandle);
        const savedVolume = localStorage.getItem("hexa-volume");
        const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.5;
        this.sound.volume = initialVolume;
        const minX = -sliderWidth / 2;
        const maxX = sliderWidth / 2;
        const handleX = Phaser.Math.Linear(minX, maxX, initialVolume);
        this.volumeSliderHandle.x = handleX;
        const updateTracks = () => {
            const percent = Phaser.Math.Percent(this.volumeSliderHandle.x, minX, maxX);
            leftTrack.width = sliderWidth * percent;
            leftTrack.x = minX;
            rightTrack.width = sliderWidth * (1 - percent);
            rightTrack.x = minX + leftTrack.width;
        };
        updateTracks();
        this.input.on("drag", (_pointer, gameObject, dragX) => {
            if (gameObject !== this.volumeSliderHandle)
                return;
            gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);
            const volume = Phaser.Math.Percent(gameObject.x, minX, maxX);
            this.sound.volume = volume;
            localStorage.setItem("hexa-volume", volume.toString());
            updateTracks();
        });
        this.events?.on("resize", updateTracks, this);
    }
}
