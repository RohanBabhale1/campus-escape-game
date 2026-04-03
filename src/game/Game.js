import Phaser from "phaser";
import config from "./config";
import MainScene from "./scenes/MainScene";

export default function initGame(parent) {
  return new Phaser.Game({
    ...config,
    parent,
    scene: [MainScene]
  });
}