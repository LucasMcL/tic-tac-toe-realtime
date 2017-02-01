// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAKwiAe0DV9z5EdUMUKQVc5weewhlQHqsg",
  authDomain: "cool-real-time-tic-tac-toe.firebaseapp.com",
  databaseURL: "https://cool-real-time-tic-tac-toe.firebaseio.com",
  storageBucket: "cool-real-time-tic-tac-toe.appspot.com",
  messagingSenderId: "408081498564"
});

const currentPlayerUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gamestate/current_player.json"
const gameStateUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gamestate.json"
const gameBoardUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gameboard.json"

// add event listener on cells
// Things that happen on click:
	// Data at cell# changed in firebase gameboard object
	// Player letter updated in firebase gamestate object

$('.cell').click(evt => {

  let playerLetter;

  // get position of cell
  let position = $(evt.target).data('target')

  // get current player turn
  $.when($.get(currentPlayerUrl, data => {
    playerLetter = data
  }))
    .then(data => {

      // Make object to patch - Lucas, I'm an idiot.  I forgot you had to make keys with variables like this
      let changeLetterPatch = {}
      changeLetterPatch[position] = playerLetter;

      // Make change on gameboard in firebase
      $.ajax({
        url: gameBoardUrl,
        type: 'PATCH',
        data: JSON.stringify(changeLetterPatch),
        success: function(response) {
          console.log("Patch successful?")
        }
      })
    // Change the current players letter in firebase
    .then(data => {
      changePlayerLetter(playerLetter)
    })
  })

  // update firebase with "X" or "O" at selected position in the game?

// update firebase with "X" or "O" at selected position
const gameboardRef = firebase.database().ref('gameboard')
gameboardRef.on('child_changed', onGameStateChange)

// Event listener updates board every time data is changed in firebase
function onGameStateChange(snap) {
	const cellData = snap.val()
	const cellId = snap.key
	console.log("game data updated")

	$(`.cell.${cellId}`).text(cellData)
	console.log($(`.cell.${cellId}`))
	console.log("cellId", cellId)
}

  // firebase realtime will update changes


  // update cell with current players letter

})



// create reset gameboard function
function resetGameBoard(){
  console.log("resetGameBoard function called")
  // change gameboard to default values

  // maybe make x go first on default
}


// create function to check if a player has won
function checkForWin(){
  console.log("checkForWin function called")
}


// create a function to switch letter on firebase which is called in the click event listener
// I know I repeated myself
// Looks fine to me! - Lucas
function changePlayerLetter(currentPlayerLetter){
  console.log("changePlayerLetter function called")

  if(currentPlayerLetter === "X") {
    console.log("New letter is O")
    let newLetter = { "current_player": "O" }

    $.ajax({
          url: gameStateUrl,
          type: 'PATCH',
          data: JSON.stringify(newLetter),
          success: function(response) {
            console.log("Patch successful?")
          }
        })
  } else if (currentPlayerLetter === "O") {
    console.log("New letter is X")
    let newLetter = { "current_player": "X" }

    $.ajax({
          url: gameStateUrl,
          type: 'PATCH',
          data: JSON.stringify(newLetter),
          success: function(response) {
            console.log("Patch successful?")
          }
        })
  } else {
    console.log("The current_player was neither 'X' or 'O' ")
  }
}
