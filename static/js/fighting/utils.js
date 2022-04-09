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