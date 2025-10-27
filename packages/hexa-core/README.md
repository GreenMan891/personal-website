# Hexa Core

This is the core game code for HEXA!!! It is imported by the web app and discord activity.

## Overview

The game is built with [Phaser 3](https://phaser.io/phaser3) and [TypeScript](https://www.typescriptlang.org/). It has a small amount of [React](https://reactjs.org/) code to serve as a wrapper for the game, making it easier to use in the web app and discord activity.

The entry point for the game itself is `src/main.ts`. This file sets up the Phaser config and starts the game by entering the `Boot` scene. This scene is responsible for preloading assets that are used in the actual `Preloader` scene -- the `Preloader` scene is where the game assets are loaded.

After the assets are loaded, the game enters the `MainMenu` scene, which is responsible for displaying the main menu UI. Then finally the actual game is in the `Game` scene.

All assets are loaded from the `assets` folder!

## Development

To develop the game, follow the setup instructions in the root README.md. It's probably easiest to develop it by running the discord activity client in the browser -- you can do this by running `pnpm run dev` in the project root, and going to whatever url is produced for the `discord` app.

I don't think Hot Module Reloading works within the Phaser game context, so you'll have to refresh the page to see changes.
