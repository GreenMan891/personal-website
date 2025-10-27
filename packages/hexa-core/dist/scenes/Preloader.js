import { Scene } from "phaser";
import { asset } from "../main";
export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }
    init() {
        this.add
            .image(window.innerWidth / 2, window.innerHeight / 3, "web_logo")
            .setScale(0.5);
    }
    preload() {
        this.load.setPath(asset("assets"));
        this.load.image("cursor", "cursor.png");
        this.load.image("2x", "2xart.png");
        this.load.image("Bomb", "bomb.png");
        this.load.spritesheet("wild-anim-sheet", "wildtiles.png", {
            frameWidth: 560,
            frameHeight: 470,
        });
        this.load.image("stars", "stars.png");
        this.load.audio("flash", "hexaprep.wav");
        this.load.audio("move", "move.wav");
        this.load.audio("swap", "swap2.wav");
        this.load.audio("hexa", "hexa.wav");
        this.load.audio("select", "select.wav");
        this.load.audio("boom", "boom.wav");
        //this.load.image("web_logo", "web_logo.png");
    }
    create() {
        if (!this.scene.isActive("Stars")) {
            this.scene.launch("Stars");
        }
        this.scene.start("MainMenu");
    }
}
