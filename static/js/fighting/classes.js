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

  // 画像の描画
  draw() {
    let offsetX = this.offset.x;
    if (this.direction) offsetX = this.image.width * this.scale / 2
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.position.x - offsetX,
      this.position.y - this.offset.y,
      this.image.width * this.scale,
      this.image.height * this.scale
    )
  }

  // 複数画像をコマ送り
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
    direction = '',
    position,
    velocity,
    imageSrcArray,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      right: {
        position: {
          x: 0,
          y: 0
        },
        offset: {
          x: 0, y: 0,
        },
        width: 0,
        height: 0,
      },
      left: {
        position: {
          x: 0,
          y: 0
        },
        offset: {
          x: 0, y: 0,
        },
        width: 0,
        height: 0,
      },
    }
  }) {
    super({
      position,
      imageSrcArray,
      scale,
      framesMax,
      offset,
    })
    this.direction = direction
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.inputKey
    this.jumped
    this.attackBox = {
      right: {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        offset: attackBox['right'].offset,
        width: attackBox['right'].width,
        height: attackBox['right'].height,
      },
      left: {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        offset: attackBox['left'].offset,
        width: attackBox['left'].width,
        height: attackBox['left'].height,
      },
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

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  switchDrawing(motion) {
    this.attackBox[this.direction].position.x = this.position.x + this.attackBox[this.direction].offset.x
    this.attackBox[this.direction].position.y = this.position.y + this.attackBox[this.direction].offset.y

    c.fillStyle = "rgba(" + [0, 0, 255, 0.5] + ")";
    c.fillRect(this.attackBox[this.direction].position.x, this.attackBox[this.direction].position.y, this.attackBox[this.direction].width, this.attackBox[this.direction].height)

    this.sprites[this.direction][motion].image = new Image()
    this.framesMax = this.sprites[this.direction][motion].framesMax
    if (this.framesCurrent > this.framesMax -1) {
      this.framesCurrent = 0
    }
    this.sprites[this.direction][motion].image.src = this.sprites[this.direction][motion].imageSrcArray[this.framesCurrent]
    this.image = this.sprites[this.direction][motion].image
    if (this.sprites[this.direction][motion].framesHold) {
      this.framesHold = this.sprites[this.direction][motion].framesHold;
    } else {
      this.framesHold = 10;
    }
  }
}