$(document).ready(function() {
  const canvas = $('canvas')[0],
        c = canvas.getContext('2d'),
        gravity = 0.7;

  canvas.width = 1024;
  canvas.height = 576;

  c.fillRect(0, 0, canvas.width, canvas.height);

  let Humanoid = function({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.height = 150

    this.draw = function() {
      c.fillStyle = 'red'
      c.fillRect(this.position.x, this.position.y, 50, this.height)
    };

    this.update = function() {
      this.draw();
      this.position.y += this.velocity.y

      if (this.position.y + this.height + this.velocity.y >= canvas.height) {
        this.velocity.y = 0
      } else {
        this.velocity.y += gravity
      }
    };
  };

  const player = new Humanoid({
    position: {
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    }
  });

  const enemy = new Humanoid({
    position: {
      x: 400,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    }
  });

  console.log(player);

  function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
  }

  animate();
});