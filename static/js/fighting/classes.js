class Drawing {
  constructor({
    position,
    imageSrc,
    scale = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.offset = offset
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      this.image.width * this.scale,
      this.image.height * this.scale
    )
  }

  update() {
    this.draw()
  }
}

class Humanoid extends Drawing {
  constructor({
    position,
    velocity,
    attackRangeStartPosition,
    imageSrc,
    scale = 1,
    offset = { x: 0, y: 0 },
    sprites
  }) {
    super({
      position,
      imageSrc,
      scale,
      offset,
    })
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.inputKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      attackRangeStartPosition,
      width: 100,
      height: 50
    }
    this.isAttacking
    this.health = 100
    this.sprites = sprites

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.attackRangeStartPosition.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}