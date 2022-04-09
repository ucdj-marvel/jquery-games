$(document).ready(function() {
  const canvas = $('canvas')[0],
        c = canvas.getContext('2d'),
        gravity = 0.7;

  canvas.width = 1024;
  canvas.height = 576;

  let Background = function({ position, imageSrc, scale=1 }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;

    this.drawing = function() {
      c.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width * this.scale,
        this.image.height * this.scale
      );
    };

    this.update = function() {
      this.drawing();
    };
  };

  let Humanoid = function({ position, velocity, color, attackRangeStartPosition }) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.width = 50;
    this.height = 150;
    this.inputKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      attackRangeStartPosition,
      width: 100,
      height: 50
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;

    this.drawing = function() {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);

      if (this.isAttacking) {
        c.fillStyle = 'green';
        c.fillRect(
          this.attackBox.position.x,
          this.attackBox.position.y,
          this.attackBox.width,
          this.attackBox.height
        );
      }
    };

    this.update = function() {
      this.drawing();
      this.attackBox.position.x = this.position.x + this.attackBox.attackRangeStartPosition.x;
      this.attackBox.position.y = this.position.y;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.y + this.height + this.velocity.y >= canvas.height) {
        this.velocity.y = 0;
      } else {
        this.velocity.y += gravity;
      }
    };

    this.attack = function() {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
    };
  };

  const background = new Background({
          position: {
            x: 0,
            y: 0
          },
          imageSrc: 'static/image/craftpix/backgrounds/PNG/City1/Bright/City1.png',
          scale: 0.7,
        }),
        player1 = new Humanoid({
          position: {
            x: 300,
            y: 0
          },
          velocity: {
            x: 0,
            y: 0
          },
          color: 'yellow',
          attackRangeStartPosition: {
            x: 0,
            y: 0
          }
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
          color: 'red',
          attackRangeStartPosition: {
            x: -50,
            y: 0
          }
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

  function attackSuccessJudgment({ attackPlayer, targetPlayer }) {
    return (
      attackPlayer.attackBox.position.x + attackPlayer.attackBox.width >=
        targetPlayer.position.x &&
      attackPlayer.attackBox.position.x <=
        targetPlayer.position.x + targetPlayer.width &&
      attackPlayer.attackBox.position.y + attackPlayer.attackBox.height >=
        targetPlayer.position.y &&
      attackPlayer.attackBox.position.y <= targetPlayer.position.y + targetPlayer.height
    )
  };

  function gameset({ player1, player2, timerId }) {
    clearTimeout(timerId);
    $('#displayText').css('display', 'flex');
    if (player1.health === player2.health) {
      $('#displayText').text('Draw');
    } else if (player1.health > player2.health) {
      $('#displayText').text('Player 1 Wins');
    } else if (player1.health < player2.health) {
      $('#displayText').text('Player 2 Wins');
    };
  };

  let timer = 60;
  let timerId;
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      $('#timer').text(timer);
    };
    if (timer === 0) {
      gameset({ player, player2, timerId });
    };
  };

  decreaseTimer();

  function animate() {
    game = window.requestAnimationFrame(animate);
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player1.update();
    player2.update();

    player1.velocity.x = 0;
    player2.velocity.x = 0;

    if (keys.a.pressed && player1.inputKey === 'a') {
      player1.velocity.x = -5;
    } else if (keys.d.pressed && player1.inputKey === 'd') {
      player1.velocity.x = 5;
    };

    if (keys.ArrowLeft.pressed && player2.inputKey === 'ArrowLeft') {
      player2.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && player2.inputKey === 'ArrowRight') {
      player2.velocity.x = 5;
    };

    if (
      attackSuccessJudgment({
        attackPlayer: player1,
        targetPlayer: player2
      }) && player1.isAttacking
    ) {
      player1.isAttacking = false;
      player2.health -= 20;
      $('#player2Health').css('width', player2.health + '%');
    };

    if (
      attackSuccessJudgment({
        attackPlayer: player2,
        targetPlayer: player1
      }) && player2.isAttacking
    ) {
      player2.isAttacking = false;
      player1.health -= 20;
      $('#player1Health').css('width', player1.health + '%');
    };

    if (player1.health <= 0 || player2.health <= 0) {
      gameset({ player1, player2, timerId });
      cancelAnimationFrame(game);
    };
  };

  animate();

  $(document).keydown(function(event) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player1.inputKey = 'd';
        break
      case 'a':
        keys.a.pressed = true;
        player1.inputKey = 'a';
        break
      case 'w':
        player1.velocity.y = -15;
        break
      case ' ':
        player1.attack();
        break
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        player2.inputKey = 'ArrowRight';
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        player2.inputKey = 'ArrowLeft';
        break
      case 'ArrowUp':
        player2.velocity.y = -15;
        break
      case 'ArrowDown':
        player2.attack();
        break
    };
  });

  $(document).keyup(function(event) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false;
        break
      case 'a':
        keys.a.pressed = false;
        break
    }
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = false;
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break
    };
  });
});