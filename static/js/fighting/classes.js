class Drawing {
  constructor({
    background = false,
    position,
    scale = 1,
    framesMax = 1,
    imageSrcArray,
    offset = { x: 0, y: 0 },
  }) {
    this.background = background
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
    let drawingPosition = 0;
    if (!this.background) drawingPosition = this.image.width * this.scale
    c.drawImage(
      this.image,
      0,  // 元イメージ使用範囲の矩形のx座標（初期値は0）
      0,  // 元イメージ使用範囲の矩形のy座標（初期値は0）
      this.image.width,  // 元イメージ使用範囲の矩形の幅（初期値はイメージ本来の幅）
      this.image.height,  // 元イメージ使用範囲の矩形の高さ（初期値はイメージ本来の高さ）
      this.position.x - drawingPosition,  // 描画イメージ矩形のx座標
      this.position.y - this.offset.y,  // 描画イメージ矩形のy座標
      this.image.width * this.scale,  // イメージを描画する幅（初期値はイメージ本来の幅）
      this.image.height * this.scale  // イメージを描画する高さ（初期値はイメージ本来の高さ）
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
    position,
    velocity,
    imageSrcArray,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: 0,
      height: 0,
    }
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
    this.jumped
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
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

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  switchDrawing(motion) {
    this.sprites[motion].image = new Image()
    this.framesMax = this.sprites[motion].framesMax
    if (this.framesCurrent > this.framesMax -1) {
      this.framesCurrent = 0
    }
    this.sprites[motion].image.src = this.sprites[motion].imageSrcArray[this.framesCurrent]
    this.image = this.sprites[motion].image
    if (motion === 'attack1') {
      this.framesHold = 2
    } else {
      this.framesHold = 10
    }
  }
}