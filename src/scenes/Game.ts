import Phaser from 'phaser';
import Paddle from '../game/Paddle'

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private paddle!: Paddle
  private ball!: Phaser.Physics.Matter.Image
  private lives = 3
  private livesLabel!: Phaser.GameObjects.Text
  private blocks: Phaser.Physics.Matter.Image[] = []
  constructor()
  {
    super('game')
  }

  init()
  {
    this.cursors = this.input.keyboard.createCursorKeys()

    this.lives = 3
  }

  create()
  {
    const { width, height } = this.scale

    this.ball = this.matter.add.image(400, 300, 'ball', undefined, {
      circleRadius: 10,
    })
    this.ball.setFriction(0, 0)
    this.ball.setBounce(1)
    const body = this.ball.body as MatterJS.BodyType;
    this.matter.body.setInertia(body, Infinity)
    this.ball.setOnCollide(this.handleBallCollide.bind(this))

    this.paddle = new Paddle(this.matter.world, width * 0.5, height * 0.9, 'paddle', {
      vertices: this.cache.json.get('shape').vertices[0],
      render: { sprite: { xOffset: 0.165, yOffset: 0.15 } },
      isStatic: true
    })
    this.paddle.attachBall(this.ball)

    let x = 128
    for (let i = 0; i < 5; i++) 
    {
      const block = this.matter.add.image(x, 200, 'block', undefined, {
        isStatic: true
      })
      .setTint(0xff0000)
      this.blocks.push(block)
      x += block.width
    }
    

    this.livesLabel = this.add.text(10, 10, `Lives:  ${this.lives}`)
  }
  
  private handleBallCollide(data: Phaser.Types.Physics.Matter.MatterCollisionData)
  {
    if (data.bodyA.gameObject?.texture.key === 'block') {
      data.bodyA.gameObject.destroy()
      this.blocks.splice(this.blocks.indexOf(data.bodyA.gameObject), 1)
    }
    if (data.bodyB.gameObject?.texture.key === 'block') {
      data.bodyB.gameObject.destroy()
      this.blocks.splice(this.blocks.indexOf(data.bodyB.gameObject), 1)
    }    
    console.log(this.blocks)
  }

  update(t: number, dt: number) {
    const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
    if (this.ball.y > this.scale.height + 100) {
      --this.lives
      this.livesLabel.text = `Lives:  ${this.lives}`
      this.paddle.attachBall(this.ball)
      return
    }
    if (spaceJustDown) {
      this.paddle.launch()
    }
    this.paddle.update(this.cursors)
  }
}