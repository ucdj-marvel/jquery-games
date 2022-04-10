const canvas = document.querySelector('canvas'),
      c = canvas.getContext('2d'),
      gravity = 0.7;

canvas.width = 1024
canvas.height = 576

const background = new Drawing({
        position: {
          x: 0,
          y: 0
        },
        imageSrcArray: lastPoliceBackGroundCity1,
        framesMax: lastPoliceBackGroundCity1.length,
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
        attackRangeStartPosition: {
          x: 0,
          y: 0
        },
        imageSrcArray: lastPoliceCharacter1Idles,
        framesMax: lastPoliceCharacter1Idles.length,
        offset: {
          x: 100,
          y: 0
        },
        scale: 0.2,
        sprites: {
          idle: {
            imageSrcArray: lastPoliceCharacter1Idles,
            framesMax: lastPoliceCharacter1Idles.length,
          },
          run: {
            imageSrcArray: lastPoliceCharacter1Runs,
            framesMax: lastPoliceCharacter1Runs.length,
          }
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
        attackRangeStartPosition: {
          x: -50,
          y: 0
        },
        imageSrcArray: lastPoliceCharacter1Idles,
        framesMax: lastPoliceCharacter1Idles.length,
        offset: {
          x: 100,
          y: 0
        },
        scale: 0.2,
        sprites: {
          idle: {
            imageSrcArray: lastPoliceCharacter1Idles,
            framesMax: lastPoliceCharacter1Idles.length,
          },
          run: {
            imageSrcArray: lastPoliceCharacter1Runs,
            framesMax: lastPoliceCharacter1Runs.length,
          }
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

decreaseTimer();

function animate() {
  game = window.requestAnimationFrame(animate);
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player1.update();
  // player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  player1.idle();
  if (keys.a.pressed && player1.inputKey === 'a') {
    player1.run();
  } else if (keys.d.pressed && player1.inputKey === 'd') {
    player1.run();
  }

  if (keys.ArrowLeft.pressed && player2.inputKey === 'ArrowLeft') {
    player2.velocity.x = -5;
    player2.image = player2.sprites.run.image
  } else if (keys.ArrowRight.pressed && player2.inputKey === 'ArrowRight') {
    player2.velocity.x = 5;
    player2.image = player2.sprites.run.image
  };

  if (
    attackSuccessJudgment({
      attackPlayer: player1,
      targetPlayer: player2
    }) && player1.isAttacking
  ) {
    player1.isAttacking = false;
    player2.health -= 20;
    document.querySelector('#player2Health').style.width = player2.health + '%';
  };

  if (
    attackSuccessJudgment({
      attackPlayer: player2,
      targetPlayer: player1
    }) && player2.isAttacking
  ) {
    player2.isAttacking = false;
    player1.health -= 20;
    document.querySelector('#player1Health').style.width = player1.health + '%';
  };

  if (player1.health <= 0 || player2.health <= 0) {
    gameset({ player1, player2, timerId });
    cancelAnimationFrame(game);
  };
}

animate();

window.addEventListener('keydown', (event) => {
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
  }
})

window.addEventListener('keyup', (event) => {
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
  }
})