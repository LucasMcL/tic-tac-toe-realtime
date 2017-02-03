console.log("currentPlayerTurnContainer.js loaded")

function updateTurnDiv(playerName/*, playerLetter*/){
  console.log("updateTurnDiv function called")
  // target turn span
  let currentTurnSpan = $('.turn-player')

  currentTurnSpan.text(playerName)

  // let userLetterSpan $('.turn-letter')

  // userLetterSpan.text(playerLetter)

}
