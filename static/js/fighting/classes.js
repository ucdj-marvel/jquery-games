class Drawing {
  constructor({
    position,
    scale = 1,
    framesMax = 1,
    imageSrcArray,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.framesMax = framesMax
    this.imageSrcArray = imageSrcArray
    this.image = new Image()
    this.image.src = this.imageSrcArray[0]
    this.scale = scale
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
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

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Humanoid extends Drawing {
  constructor({
    position,
    velocity,
    attackRangeStartPosition,
    imageSrcArray,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites
  }) {
    super({
      position,
      imageSrcArray,
      scale,
      framesMax,
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
      height: 50,
    }
    this.isAttacking
    this.health = 100
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 10
    this.sprites = sprites
  }

  update() {
    this.draw()
    this.animateFrames()

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

  idle() {
    this.sprites.idle.image = new Image()
    this.framesMax = this.sprites.idle.framesMax
    if (this.framesCurrent > this.framesMax -1) {
      this.framesCurrent = 0
    }
    this.sprites.idle.image.src = this.sprites.idle.imageSrcArray[this.framesCurrent]
    this.image = this.sprites.idle.image
  }

  run() {
    if (this.inputKey === 'a') {
      this.velocity.x = -5;
    } else if (this.inputKey === 'd') {
      this.velocity.x = 5;
    }
    this.sprites.run.image = new Image()
    this.framesMax = this.sprites.run.framesMax
    if (this.framesCurrent > this.framesMax -1) {
      this.framesCurrent = 0
    }
    this.sprites.run.image.src = this.sprites.run.imageSrcArray[this.framesCurrent]
    this.image = this.sprites.run.image
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
}