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
      }),
      player1 = new Humanoid({
        direction: 'right',
        position: {
          x: 300,
          y: 0
        },
        velocity: {
          x: 0,
          y: 0
        },
        imageSrcArray: police1RightIdles,
        framesMax: police1RightIdles.length,
        offset: {
          x: 100,
          y: 0
        },
        scale: 0.2,
        sprites: {
          right: {
            idle: {
              imageSrcArray: police1RightIdles,
              framesMax: police1RightIdles.length,
            },
            run: {
              imageSrcArray: police1RightRuns,
              framesMax: police1RightRuns.length,
            },
            jump: {
              imageSrcArray: police1RightJumps,
              framesMax: police1RightJumps.length,
            },
            attack1: {
              imageSrcArray: police1RightAttack1,
              framesMax: police1RightAttack1.length,
              framesHold: 2,
            },
            takeDamage: {
              imageSrcArray: police1RightTakeDamage,
              framesMax: police1RightTakeDamage.length,
            },
            dead: {
              imageSrcArray: police1RightDead,
              framesMax: police1RightDead.length,
            }
          },
          left: {
            idle: {
              imageSrcArray: police1LeftIdles,
              framesMax: police1LeftIdles.length,
            },
            run: {
              imageSrcArray: police1LeftRuns,
              framesMax: police1LeftRuns.length,
            },
            jump: {
              imageSrcArray: police1LeftJumps,
              framesMax: police1LeftJumps.length,
            },
            attack1: {
              imageSrcArray: police1LeftAttack1,
              framesMax: police1LeftAttack1.length,
              framesHold: 2,
            },
            takeDamage: {
              imageSrcArray: police1LeftTakeDamage,
              framesMax: police1LeftTakeDamage.length,
            },
            dead: {
              imageSrcArray: police1LeftDead,
              framesMax: police1LeftDead.length,
            }
          },
        },
        attackBox: {
          right: {
            offset: {
              x: 0,
              y: 80,
            },
            width: 110,
            height: 80,
          },
          left: {
            offset: {
              x: -95,
              y: 80,
            },
            width: 110,
            height: 80,
          },
        },
      }),
      player2 = new Humanoid({
        direction: 'left',
        position: {
          x: 800,
          y: 0
        },
        velocity: {
          x: 0,
          y: 0
        },
        imageSrcArray: alien1LeftIdles,
        framesMax: alien1LeftIdles.length,
        offset: {
          x: 0,
          y: 0
        },
        scale: 0.6,
        sprites: {
          right: {
            idle: {
              imageSrcArray: alien1RightIdles,
              framesMax: alien1RightIdles.length,
            },
            run: {
              imageSrcArray: alien1RightRuns,
              framesMax: alien1LeftRuns.length,
            },
            jump: {
              imageSrcArray: alien1RightJumps,
              framesMax: alien1RightJumps.length,
            },
            attack1: {
              imageSrcArray: alien1RightAttack1,
              framesMax: alien1RightAttack1.length,
            },
            takeDamage: {
              imageSrcArray: alien1RightTakeDamage,
              framesMax: alien1RightTakeDamage.length,
            },
            dead: {
              imageSrcArray: alien1RightDead,
              framesMax: alien1RightDead.length,
            }
          },
          left: {
            idle: {
              imageSrcArray: alien1LeftIdles,
              framesMax: alien1LeftIdles.length,
            },
            run: {
              imageSrcArray: alien1LeftRuns,
              framesMax: alien1LeftRuns.length,
            },
            jump: {
              imageSrcArray: alien1LeftJumps,
              framesMax: alien1LeftJumps.length,
            },
            attack1: {
              imageSrcArray: alien1LeftAttack1,
              framesMax: alien1LeftAttack1.length,
            },
            takeDamage: {
              imageSrcArray: alien1LeftTakeDamage,
              framesMax: alien1LeftTakeDamage.length,
            },
            dead: {
              imageSrcArray: alien1LeftDead,
              framesMax: alien1LeftDead.length,
            }
          }
        },
        attackBox: {
          right: {
            offset: {
              x: 20,
              y: 100,
            },
            width: 160,
            height: 40,
          },
          left: {
            offset: {
              x: -200,
              y: 100,
            },
            width: 160,
            height: 40,
          },
        },
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
  game = window.requestAnimationFrame(animate);
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  if (player1.dead) {
    player1.switchDrawing('dead');
  } else if (player1.isTakeDamage) {
    player1.switchDrawing('takeDamage');
  } else if (player1.isAttacking) {
    player1.switchDrawing('attack1');
  } else if (player1.velocity.y < 0) {
    player1.switchDrawing('jump');
  } else {
    player1.jumped = false;
  }
  if (keys.a.pressed && player1.inputKey === 'a') {
    player1.velocity.x = -5;
    player1.direction = 'left';
    if (!player1.jumped && !player1.isAttacking && !player1.isTakeDamag) player1.switchDrawing('run');
  } else if (keys.d.pressed && player1.inputKey === 'd') {
    player1.velocity.x = 5;
    player1.direction = 'right';
    if (!player1.jumped && !player1.isAttacking && !player1.isTakeDamag) player1.switchDrawing('run');
  } else if (!player1.jumped && !player1.isAttacking && !player1.isTakeDamage && !player1.dead) {
    player1.switchDrawing('idle');
  }

  if (player2.dead) {
    player2.switchDrawing('dead');
  } else if (player2.isTakeDamage) {
    player2.switchDrawing('takeDamage');
  } else if (player2.isAttacking) {
    player2.switchDrawing('attack1');
  } else if (player2.velocity.y < 0) {
    player2.switchDrawing('jump');
  } else {
    player2.jumped = false;
  }
  if (keys.ArrowLeft.pressed && player2.inputKey === 'ArrowLeft') {
    player2.velocity.x = -5;
    player2.direction = 'left';
    if (!player2.jumped && !player2.isAttackingg && !player2.isTakeDamage) player2.switchDrawing('run');
  } else if (keys.ArrowRight.pressed && player2.inputKey === 'ArrowRight') {
    player2.velocity.x = 5;
    player2.direction = 'right';
    if (!player2.jumped && !player2.isAttackingg && !player2.isTakeDamage) player2.switchDrawing('run');
  } else if (!player2.jumped && !player2.isAttacking && !player2.isTakeDamage && !player2.dead) {
    player2.switchDrawing('idle');
  }

  if (
    attackSuccessJudgment({
      attackPlayer: player1,
      targetPlayer: player2
    }) &&
    player1.isAttacking && player1.framesCurrent === (police1RightAttack1.length - 1)
  ) {
    player2.health -= 5;
    if (player2.health <= 0) {
      player2.dead = true;
    } else {
      player2.isTakeDamage = true;
    }
    document.querySelector('#player2Health').style.width = player2.health + '%';
  };

  if (
    attackSuccessJudgment({
      attackPlayer: player2,
      targetPlayer: player1
    }) &&
    player2.isAttacking && player2.framesCurrent === (alien1LeftAttack1.length - 1)
  ) {
    player1.health -= 50;
    if (player1.health <= 0) {
      player1.dead = true;
    } else {
      player1.isTakeDamage = true;
    }
    document.querySelector('#player1Health').style.width = player1.health + '%';
  };

  if (player1.isAttacking && player1.framesCurrent === (police1RightAttack1.length - 1)) {
    player1.isAttacking = false;
  }

  if (player2.isAttacking && player2.framesCurrent === (alien1LeftAttack1.length - 1)) {
    player2.isAttacking = false;
  }

  if (player1.health <= 0 || player2.health <= 0) {
    gameset({ player1, player2, timerId });
  };
}

window.onload = function() {
  decreaseTimer();
  animate();
};

window.addEventListener('keydown', (event) => {
  if (!player1.dead) {
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
    }
  }
  if (!player2.dead) {
    switch (event.key) {
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