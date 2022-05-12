import Phaser from 'phaser';
import Paddle from '../game/Paddle'

export default class Game extends Phaser.Scene
{
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private paddle!: Paddle
  private ball!: Phaser.Physics.Matter.Image
  private lives = 3
  private points = 0
  private livesLabel!: Phaser.GameObjects.Text
  private pointsLabel!: Phaser.GameObjects.Text
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

    this.ball = this.matter.add.image(400, 300, 'ball')
    this.ball.setCircle(10)
    this.ball.setBounce(1)
    this.ball.setOnCollide(this.handleBallCollide.bind(this))

    this.paddle = new Paddle(this.matter.world, width * 0.5, height, 'paddle')
    this.paddle.setCircle(100)
    this.paddle.setStatic(true)
    this.paddle.attachBall(this.ball)

    this.livesLabel = this.add.text(10, 10, `Lives:  ${this.lives}`)
    this.livesLabel.setDepth(1)

    this.pointsLabel = this.add.text(10, 30, `Points:  ${this.points}`)
    this.pointsLabel.setDepth(1)

    this.addLine()
  }
  
  private handleBallCollide(data: Phaser.Types.Physics.Matter.MatterCollisionData)
  {
    if (data.bodyA.gameObject?.texture.key === 'block') 
    {
      data.bodyA.gameObject.destroy()
      this.pointsLabel.text = `Points:  ${++this.points}`
    }
    if (data.bodyB.gameObject?.texture.key === 'block') 
    {
      data.bodyB.gameObject.destroy()
      this.pointsLabel.text = `Points:  ${++this.points}`
    }
  }

  private addLine()
  {
    for (let x = 0; x < 10; x++) 
    {
      if (Phaser.Math.Between(0, 3))
      {
        const block = this.matter.add.image(x * 80 + 40, -15, 'block')
        block.setStatic(true)
        block.setTint(0xff0000)
        this.blocks.push(block)
      }
    }    
  }

  update(t: number, dt: number) 
  {
    if (this.ball.y > this.scale.height + 100) 
    {
      --this.lives
      this.livesLabel.text = `Lives:  ${this.lives}`
      this.paddle.attachBall(this.ball)
      return
    }

    const spaceJustDown = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
    if (spaceJustDown || this.input.activePointer.isDown) 
    {
      this.paddle.launch()
    }

    this.paddle.x = this.input.activePointer.x
    this.paddle.update()

    if (!this.paddle.getBall()) 
    {
      const ballVelocity = new Phaser.Math.Vector2(this.ball.body.velocity).normalize().scale(8)
      this.ball.setVelocity(ballVelocity.x, ballVelocity.y)
    }
    
    let newLineRequired = true
    this.blocks.forEach(block => {
      if (!block.body) 
      {
        return
      }
      block.y += 0.1
      if (block.y < block.height * 0.5) {
        newLineRequired = false
      }
    })

    if (newLineRequired) 
    {
      this.addLine()
    }
  }
}