console.log("currentPlayerTurnContainer.js loaded")

function updateTurnDiv(playerName){
  console.log("updateTurnDiv function called")
  // target turn span
  let currentTurnSpan = $('.turn-player')

  currentTurnSpan.text(playerName)


}
