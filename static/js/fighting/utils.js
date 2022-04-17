function attackSuccessJudgment({ attackPlayer, targetPlayer }) {
  const direction = attackPlayer.direction;
  return (
    attackPlayer.attackBox[direction].position.x + attackPlayer.attackBox[direction].width >=
      targetPlayer.position.x - targetPlayer.hitBox.offset.x &&
    attackPlayer.attackBox[direction].position.x <=
      targetPlayer.position.x - targetPlayer.hitBox.offset.x + targetPlayer.hitBox.width &&
    attackPlayer.attackBox[direction].position.y + attackPlayer.attackBox[direction].height >=
      targetPlayer.position.y &&
    attackPlayer.attackBox[direction].position.y <= targetPlayer.position.y + targetPlayer.hitBox.height
  )
}

function gameset({ player1, player2, timerId }) {
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex'
  if (player1.health === player2.health) {
    document.querySelector('#displayText').innerHTML = 'Draw'
  } else if (player1.health > player2.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player1.health < player2.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    gameset({ player1, player2, timerId })
  }
}