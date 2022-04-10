const canvas = document.querySelector('canvas'),
      c = canvas.getContext('2d'),
      gravity = 0.7;

canvas.width = 1024
canvas.height = 576

const rect = canvas.getBoundingClientRect();

const background = new Drawing({
        position: {
          x: 0,
          y: 0
        },
        imageSrcArray: backGroundCity1,
        framesMax: backGroundCity1.length,
        scale: 0.7,
        background: true,
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
        imageSrcArray: policeCharacter1Idles,
        framesMax: policeCharacter1Idles.length,
        offset: {
          x: 100,
          y: 0
        },
        scale: 0.2,
        sprites: {
          idle: {
            imageSrcArray: policeCharacter1Idles,
            framesMax: policeCharacter1Idles.length,
          },
          run: {
            imageSrcArray: policeCharacter1Runs,
            framesMax: policeCharacter1Runs.length,
          },
          jump: {
            imageSrcArray: policeCharacter1Jumps,
            framesMax: policeCharacter1Jumps.length,
          },
          attack1: {
            imageSrcArray: policeCharacter1Attack1,
            framesMax: policeCharacter1Attack1.length,
          }
        },
        attackBox: {
          offset: {
            x: -20,
            y: 50,
          },
          width: 115,
          height: 100,
        }
      }),
      player2 = new Humanoid({
        position: {
          x: 800,
          y: 0
        },
        velocity: {
          x: 0,
          y: 0
        },
        imageSrcArray: alienCharacter1Idles,
        framesMax: alienCharacter1Idles.length,
        offset: {
          x: 0,
          y: 0
        },
        scale: 0.6,
        sprites: {
          idle: {
            imageSrcArray: alienCharacter1Idles,
            framesMax: alienCharacter1Idles.length,
          },
          run: {
            imageSrcArray: alienCharacter1Runs,
            framesMax: alienCharacter1Runs.length,
          },
          jump: {
            imageSrcArray: alienCharacter1Jumps,
            framesMax: alienCharacter1Jumps.length,
          },
          attack1: {
            imageSrcArray: alienCharacter1Attack1,
            framesMax: alienCharacter1Attack1.length,
          }
        },
        attackBox: {
          offset: {
            x: -300,
            y: 100,
          },
          width: 195,
          height: 40,
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
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  if (player1.isAttacking) {
    player1.switchDrawing('attack1');
  } else if (player1.velocity.y < 0) {
    player1.switchDrawing('jump');
  } else {
    player1.jumped = false;
  }
  if (keys.a.pressed && player1.inputKey === 'a') {
    player1.velocity.x = -5;
    if (!player1.jumped && !player1.isAttacking) player1.switchDrawing('run');
  } else if (keys.d.pressed && player1.inputKey === 'd') {
    player1.velocity.x = 5;
    if (!player1.jumped && !player1.isAttacking) player1.switchDrawing('run');
  } else if (!player1.jumped && !player1.isAttacking) {
    player1.switchDrawing('idle');
  }

  if (player2.isAttacking) {
    player2.switchDrawing('attack1');
  } else if (player2.velocity.y < 0) {
    player2.switchDrawing('jump');
  } else {
    player2.jumped = false;
  }
  if (keys.ArrowLeft.pressed && player2.inputKey === 'ArrowLeft') {
    player2.velocity.x = -5;
    if (!player2.jumped && !player2.isAttacking) player2.switchDrawing('run');
  } else if (keys.ArrowRight.pressed && player2.inputKey === 'ArrowRight') {
    player2.velocity.x = 5;
    if (!player2.jumped && !player2.isAttacking) player2.switchDrawing('run');
  } else if (!player2.jumped && !player2.isAttacking) {
    player2.switchDrawing('idle');
  }

  if (
    attackSuccessJudgment({
      attackPlayer: player1,
      targetPlayer: player2
    }) &&
    player1.isAttacking && player1.framesCurrent === (policeCharacter1Attack1.length - 1)
  ) {
    player1.isAttacking = false;
    player2.health -= 2;
    document.querySelector('#player2Health').style.width = player2.health + '%';
  };

  if (
    attackSuccessJudgment({
      attackPlayer: player2,
      targetPlayer: player1
    }) && player2.isAttacking
  ) {
    player2.isAttacking = false;
    player1.health -= 50;
    document.querySelector('#player1Health').style.width = player1.health + '%';
  };

  if (player1.isAttacking && player1.framesCurrent === (policeCharacter1Attack1.length - 1)) {
    player1.isAttacking = false;
  }

  if (player2.isAttacking && player2.framesCurrent === (alienCharacter1Attack1.length - 1)) {
    player2.isAttacking = false;
  }

  if (player1.health <= 0 || player2.health <= 0) {
    gameset({ player1, player2, timerId });
    cancelAnimationFrame(game);
  };
}

window.onload = animate();

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
      player1.jumped = true;
      player1.velocity.y = -15;
      break
    case ' ':
      player1.isAttacking = true;
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
      player2.jumped = true;
      player2.velocity.y = -15;
      break
    case 'ArrowDown':
      player2.isAttacking = true;
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