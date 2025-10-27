import * as Phaser from 'phaser';
import { Scene } from "phaser";
import { asset } from "../main";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("web_logo", asset("assets/web_logo.png"));
  }

  create() {
    this.scene.start("Preloader");
  }
}
