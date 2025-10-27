import { Input, Scene } from "phaser";
import { EventBus } from "../EventBus";
export class MainMenu extends Scene {
    buttons = [];
    buttonIndex = 0;
    logo;
    text;
    aKey;
    dKey;
    jKey;
    constructor() {
        super("MainMenu");
    }
    init() {
        this.buttons = [];
        this.buttonIndex = 0;
    }
    create() {
        this.logo = this.add
            .image(this.cameras.main.centerX, this.scale.height / 3.5, "web_logo")
            .setDepth(100);
        this.logo.setScale(0.5);
        this.text = this.add
            .text(this.cameras.main.centerX, this.scale.height / 2.6, "(prototype)", {
            fontSize: "20px",
            fontFamily: "Impact",
            color: "#ffffff",
            align: "center",
        })
            .setOrigin(0.5);
        this.text = this.add
            .text(this.cameras.main.centerX, this.scale.height / 1.6, "Controls:", {
            fontSize: "48px",
            fontFamily: "Impact",
            color: "#ffffff",
            align: "center",
        })
            .setOrigin(0.5);
        this.text = this.add
            .text(this.cameras.main.centerX, this.scale.height / 1.6 + 80, "WASD = Move", {
            fontSize: "42px",
            fontFamily: "Impact",
            color: "#ffffff",
            align: "center",
        })
            .setOrigin(0.5);
        this.text = this.add
            .text(this.cameras.main.centerX, this.scale.height / 1.6 + 160, "J/K = Rotate Left/Right", {
            fontSize: "42px",
            fontFamily: "Impact",
            color: "#ffffff",
            align: "center",
        })
            .setOrigin(0.5);
        if (!this.input.keyboard) {
            throw new Error("Need a keyboard to play");
        }
        this.jKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.J);
        this.aKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.D);
        const normalButton = this.createButton("Play", this.cameras.main.centerX, () => this.scene.start("Game", { alternateMode: false }));
        // const alternateButton = this.createButton(
        //   "Alternate Mode",
        //   this.cameras.main.centerX + 200,
        //   () => this.scene.start("Game", { alternateMode: true }),
        // );
        this.buttons.push(normalButton);
        this.selectButton(0);
        if (!this.scene.isActive("Stars")) {
            this.scene.launch("Stars");
        }
        EventBus.emit("current-scene-ready", this);
    }
    createButton(text, x, action) {
        const buttonWidth = 280;
        const buttonHeight = 60;
        const buttonContainer = this.add.container(x, this.cameras.main.centerY);
        const background = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x000000);
        background.setStrokeStyle(3, 0xffffff);
        const buttonText = this.add
            .text(0, 0, text, {
            fontFamily: "Impact",
            fontSize: "32px",
            color: "#ffffff",
        })
            .setOrigin(0.5);
        buttonContainer.add([background, buttonText]);
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive();
        buttonContainer.setData("action", action);
        buttonContainer.on("pointerover", () => {
            const index = this.buttons.indexOf(buttonContainer);
            this.selectButton(index);
        });
        buttonContainer.on("pointerdown", () => {
            action();
        });
        return buttonContainer;
    }
    selectButton(index) {
        this.buttonIndex = index;
        this.buttons.forEach((button, i) => {
            const background = button.first;
            if (i === index) {
                // Style for the selected button
                background.setFillStyle(0x4a5568); // Highlighted color
                button.setScale(1.05);
            }
            else {
                // Style for unselected buttons
                background.setFillStyle(0x000000); // Default color
                button.setScale(1.0);
            }
        });
    }
    selectNextButton() {
        const newIndex = (this.buttonIndex + 1) % this.buttons.length;
        this.selectButton(newIndex);
    }
    selectPreviousButton() {
        const newIndex = (this.buttonIndex - 1 + this.buttons.length) % this.buttons.length;
        this.selectButton(newIndex);
    }
    update() {
        if (Input.Keyboard.JustDown(this.jKey)) {
            this.confirmSelection();
        }
        if (Input.Keyboard.JustDown(this.aKey)) {
            this.selectPreviousButton();
        }
        if (Input.Keyboard.JustDown(this.dKey)) {
            this.selectNextButton();
        }
    }
    confirmSelection() {
        const selectedButton = this.buttons[this.buttonIndex];
        const action = selectedButton?.getData("action");
        if (action) {
            action();
        }
    }
}
