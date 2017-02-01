console.log('main.js loaded')

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAKwiAe0DV9z5EdUMUKQVc5weewhlQHqsg",
  authDomain: "cool-real-time-tic-tac-toe.firebaseapp.com",
  databaseURL: "https://cool-real-time-tic-tac-toe.firebaseio.com",
  storageBucket: "cool-real-time-tic-tac-toe.appspot.com",
  messagingSenderId: "408081498564"
});

//Constants
const currentPlayerUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gamestate/current_player.json"
const gameStateUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gamestate.json"
const gameBoardUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gameboard.json"
const xImgUrl = "img/x.png"
const oImgUrl = "img/o.jpg"
const gameBoardRef = firebase.database().ref('gameboard')
const gameStateRef = firebase.database().ref('gamestate')
const activeUsersRef = firebase.database().ref('activeUsers')
const messagesRef = firebase.database().ref('messages')

//Event Listeners
gameBoardRef.on('child_changed', onGameStateChange) //X or O added to game board
gameStateRef.on('child_changed', onGameOver) // when game is over
messagesRef.limitToLast(10).on('child_added', onMessageChange) // when new message is added to firebase
$('.reset-game').click(resetGame)
$(document).ready(() => {
	loadInitialGameBoard()
})

// add event listener on cells
// Things that happen on click:
  // Data at cell# changed in firebase gameboard object
  // Player letter updated in firebase gamestate object
$('.cell').click(evt => {
  if( $(evt.target).hasClass('space-taken') ) return
  let playerLetter;

  // get position of cell
  let position = $(evt.target).data('target')

  // get current player turn
  // NOTE: this needs to be changed to firebase real time!!!!
  $.when($.get(currentPlayerUrl, data => playerLetter = data))
    .then(data => {

      // Make object to patch - Lucas, I'm an idiot.  I forgot you had to make keys with variables like this
      let changeLetterPatch = {}
      changeLetterPatch[position] = playerLetter;

      // Make change on gameboard in firebase
      gameBoardRef.update(changeLetterPatch) // ES6 way is too crazy

    // Check for wins.
    .then(()=> {
      checkForWin(playerLetter)
    })

    // Change the current players letter in firebase, if no one won.
    .then(data => {
      changePlayerLetter(playerLetter)
    })

  })
})

// update firebase with "X" or "O" at selected position in the game?

// update firebase with "X" or "O" at selected position

// Event listener updates board every time data is changed in firebase
function onGameStateChange(snap) {
  // snap contains key/value of data just changed
  const cellData = snap.val()
  const cellId = snap.key
  if(!cellData) return // exit if change was resetting data
  console.log("Updating DOM to reflect change in database")

  if (cellData === "X") { var src = xImgUrl }
  else if (cellData === "O") { var src = oImgUrl }

  $(`.cell.${cellId}`).html(`<img src="${src}" class="space-taken"/>`)
}

// Changes all the cell values to empty strings in database
function resetGame() {
  console.log('resetting game data in database')

  gameBoardRef.set({
    a1: "", a2: "", a3: "",
    b1: "", b2: "", b3: "",
    c1: "", c2: "", c3: ""
  })

	gameStateRef.set({
		current_player: "X",
		game_over: false,
		player_won: ""
	})

  $('.cell').html('')
  console.log('cells reset in DOM')
}

// firebase realtime will update changes


// update cell with current players letter

// Function called when the game is over
// Displays a modal to all users
function onGameOver(snap) {
	// Only proceed if it was the 'player_won' value changed
	if(snap.key !== 'player_won') return
	if(!snap.val()) return // exit if game being reset
	console.log('onGameOver function called')

	if(snap.val() === 'draw') {
		$('#game-over-modal .modal-body').html(`Draw!`)
	} else {
		$('#game-over-modal .modal-body').html(`<p>Player ${snap.val()} has won!</p>`)
	}
	$('#game-over-modal').modal()
}

// Displays board when user first loads page
function loadInitialGameBoard() {
	console.log("loadInitialGameBoard")
	gameBoardRef.once('value')
		.then(snap => snap.val())
		.then(data => {
			for(cell_num in data) {
				if (data[cell_num] === "X") { var src = xImgUrl }
				else if (data[cell_num] === "O") { var src = oImgUrl }
				else continue // skip current loop if not x or o

				$(`.cell.${cell_num}`).html(`<img src="${src}" class="space-taken"/>`)
			}
		})
}


// create a function to switch letter on firebase which is called in the click event listener
// I know I repeated myself
// Looks fine to me! - Lucas
function changePlayerLetter(currentPlayerLetter){
  console.log("changePlayerLetter function called")

  if(currentPlayerLetter === "X") {

    let newLetter = { "current_player": "O" }

    gameStateRef.update(newLetter)

  } else if (currentPlayerLetter === "O") {

    let newLetter = { "current_player": "X" }

    gameStateRef.update(newLetter)

  } else {
    console.log("The current_player was neither 'X' or 'O' ")
  }
}


// Notes For Westley - I suffer from KRS, aka "Kant Remember Shit"

// .set()   overwrite

// .update()   just like patch


// .remove()  delete stuffs

//  .push()   like post dummy
