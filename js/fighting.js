$(document).ready(function() {
  const canvas = $('canvas')[0],
        background = 'black',
        c = canvas.getContext('2d'),
        gravity = 0.7;

  canvas.width = 1024;
  canvas.height = 576;

  let Humanoid = function({ position, velocity, color }) {
    this.position = position
    this.velocity = velocity
    this.color = color
    this.height = 150
    this.inputKey

    this.draw = function() {
      c.fillStyle = this.color
      c.fillRect(this.position.x, this.position.y, 50, this.height)
    };

    this.update = function() {
      this.draw();

      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      if (this.position.y + this.height + this.velocity.y >= canvas.height) {
        this.velocity.y = 0
      } else {
        this.velocity.y += gravity
      }
    };
  };

  const player1 = new Humanoid({
          position: {
            x: 300,
            y: 0
          },
          velocity: {
            x: 0,
            y: 0
          },
          color: 'yellow'
        }),
        player2 = new Humanoid({
          position: {
            x: 600,
            y: 0
          },
          velocity: {
            x: 0,
            y: 0
          },
          color: 'red'
        }),
        keys = {
          a: {
            pressed: false
          },
          d: {
            pressed: false
          },
          ArrowRight: {
            pressed: false
          },
          ArrowLeft: {
            pressed: false
          }
        };

  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = background;
    c.fillRect(0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();

    player1.velocity.x = 0
    player2.velocity.x = 0

    if (keys.a.pressed && player1.inputKey === 'a') {
      player1.velocity.x = -5
    } else if (keys.d.pressed && player1.inputKey === 'd') {
      player1.velocity.x = 5
    }

    if (keys.ArrowLeft.pressed && player2.inputKey === 'ArrowLeft') {
      player2.velocity.x = -5
    } else if (keys.ArrowRight.pressed && player2.inputKey === 'ArrowRight') {
      player2.velocity.x = 5
    }
  }

  animate();

  $(document).keydown(function(event) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player1.inputKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player1.inputKey = 'a'
        break
      case 'w':
        player1.velocity.y = -15
        break
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        player2.inputKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        player2.inputKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        player2.velocity.y = -15
        break
    }
  });
  $(document).keyup(function(event) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break
    }
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
    }
  });
});