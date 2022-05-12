import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
  constructor()
  {
    super('preloader')
  }

  preload()
  {
    this.load.image('ball', 'assets/ball.png')
    this.load.image('paddle', 'assets/paddle.png')
    this.load.image('block', 'assets/block.png')
  }

  create()
  {
    this.scene.start('game')
  }
}