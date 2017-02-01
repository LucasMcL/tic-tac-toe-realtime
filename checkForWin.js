console.log("checkForWin.js loaded")

function checkForWin(letter){
  console.log("checkForWin function called")

  let currentGameBoardState;

  $.when($.get(gameBoardUrl, data => {
    currentGameBoardState = data
    // console.log(currentGameBoardState)
  }))

    .then(() => {
    // check for horizontal wins
      // check top row

      if(currentGameBoardState.a1 === letter &&
         currentGameBoardState.a2 === letter &&
         currentGameBoardState.a3 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
      // check middle row
      if(currentGameBoardState.b1 === letter &&
         currentGameBoardState.b2 === letter &&
         currentGameBoardState.b3 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
      // check bottom row
      if(currentGameBoardState.c1 === letter &&
         currentGameBoardState.c2 === letter &&
         currentGameBoardState.c3 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
    // check vertical wins
      // check left column
      if(currentGameBoardState.a1 === letter &&
         currentGameBoardState.b1 === letter &&
         currentGameBoardState.c1 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
      // check middle column
      if(currentGameBoardState.a2 === letter &&
         currentGameBoardState.b2 === letter &&
         currentGameBoardState.c2 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
      // check right column
      if(currentGameBoardState.a3 === letter &&
         currentGameBoardState.b3 === letter &&
         currentGameBoardState.c3 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
    // check diagonal wins
      // check top left to bottom right
      if(currentGameBoardState.a1 === letter &&
         currentGameBoardState.b2 === letter &&
         currentGameBoardState.c3 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
      // check top right to bottom left
      if(currentGameBoardState.a3 === letter &&
         currentGameBoardState.b2 === letter &&
         currentGameBoardState.c1 === letter) {

        // break out of function
        return console.log(`${letter} has won!`)
      }
    })
}
