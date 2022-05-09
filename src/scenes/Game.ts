import Phaser from 'phaser';

export default class Game extends Phaser.Scene
{
  constructor()
  {
    super('game')
  }

  create()
  {
    const { width, height } = this.scale

    const ball = this.matter.add.image(400, 300, 'ball')
    ball.setVelocity(10, 10)
    ball.setFriction(0, 0)
    ball.setBounce(1)
    const body = ball.body as MatterJS.BodyType;
    this.matter.body.setInertia(body, Infinity)

    const paddle = this.matter.add.image(width * 0.5, height * 0.9, 'paddle', undefined, {
      isStatic: true
    })
  }
}