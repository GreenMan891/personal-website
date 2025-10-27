import * as Phaser from 'phaser';
import { type GameObjects, Input, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  buttons: Phaser.GameObjects.Container[] = [];
  buttonIndex: number = 0;
  logo!: GameObjects.Image;
  text!: Phaser.GameObjects.Text;

  aKey!: Input.Keyboard.Key;
  dKey!: Input.Keyboard.Key;
  jKey!: Input.Keyboard.Key;

  constructor() {
    super("MainMenu");
  }

  init() {
    this.buttons = [];
    this.buttonIndex = 0;
  }

  create() {
    // Responsive scaling factors
    const { centerX, centerY, width, height } = this.cameras.main;

    // Logo: biggest element, scales to 30% of screen width
    const logoScale = Math.min(width * 0.3 / 1024, 1); // assuming logo's native width ~1024px
    this.logo = this.add
      .image(centerX, height * 0.22, "mainmenulogo")
      .setDepth(100)
      .setOrigin(0.5)
      .setScale(logoScale);

    // Play button: second biggest, scales to 18% of screen width
    // Button size will be set in createButton, but you can adjust its position here if needed

    // Controls header: below play button, smaller font
    const controlsHeaderFontSize = Math.round(height * 0.055); // ~5.5% of screen height
    // Move controls text further down the page by increasing the base Y position
    const controlsBaseY = height * 0.65;

    this.text = this.add
      .text(centerX, controlsBaseY, "Controls:", {
      fontSize: `${controlsHeaderFontSize}px`,
      fontFamily: "Impact",
      color: "#ffffff",
      align: "center",
      })
      .setOrigin(0.5);

    // Controls details: even smaller font, spaced below header
    const controlsDetailFontSize = Math.round(height * 0.045); // ~4.5% of screen height
    const controlsSpacing = controlsDetailFontSize + 10;

    this.add
      .text(centerX, controlsBaseY + controlsSpacing, "WASD = Move", {
      fontSize: `${controlsDetailFontSize}px`,
      fontFamily: "Impact",
      color: "#ffffff",
      align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, controlsBaseY + controlsSpacing * 2, "J/K = Rotate Left/Right", {
      fontSize: `${controlsDetailFontSize}px`,
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

    const normalButton = this.createButton(
      "Play",
      this.cameras.main.centerX,
      () => this.scene.start("Game", { alternateMode: false }),
    );

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

  createButton(text: string, x: number, action: () => void) {
    const buttonWidth = 280;
    const buttonHeight = 60;

    const buttonContainer = this.add.container(x, this.cameras.main.centerY);

    const background = this.add.rectangle(
      0,
      0,
      buttonWidth,
      buttonHeight,
      0x000000,
    );
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

  selectButton(index: number) {
    this.buttonIndex = index;

    this.buttons.forEach((button, i) => {
      const background = button.first as Phaser.GameObjects.Rectangle;
      if (i === index) {
        // Style for the selected button
        background.setFillStyle(0x4a5568); // Highlighted color
        button.setScale(1.05);
      } else {
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
    const newIndex =
      (this.buttonIndex - 1 + this.buttons.length) % this.buttons.length;
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

    const action = selectedButton?.getData("action") as () => void;
    if (action) {
      action();
    }
  }
}
