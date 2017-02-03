console.log('main.js loaded')

// MAIN DATABASE

// // Initialize Firebase
// firebase.initializeApp({
//   apiKey: "AIzaSyAKwiAe0DV9z5EdUMUKQVc5weewhlQHqsg",
//   authDomain: "cool-real-time-tic-tac-toe.firebaseapp.com",
//   databaseURL: "https://cool-real-time-tic-tac-toe.firebaseio.com",
//   storageBucket: "cool-real-time-tic-tac-toe.appspot.com",
//   messagingSenderId: "408081498564"
// });

// TEST DATABASE

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyC9UNC_tXASVIjNS1uMC0e0GKGGau9mAzk",
  authDomain: "test-cool-real-time-tic.firebaseapp.com",
  databaseURL: "https://test-cool-real-time-tic.firebaseio.com",
  storageBucket: "test-cool-real-time-tic.appspot.com",
  messagingSenderId: "454329941612"
});


//Constants
const currentPlayerUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gamestate/current_player.json"
const gameStateUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gamestate.json"
const gameBoardUrl = "https://cool-real-time-tic-tac-toe.firebaseio.com/gameboard.json"
const xImgUrl = "img/x.png"
const oImgUrl = "img/o.jpg"
const gameBoardRef = firebase.database().ref('gameboard')
const gameStateRef = firebase.database().ref('gamestate')
const currentPlayerRef = firebase.database().ref('gamestate/current_player')
// const playerTurnRef = firebase.database().ref('gamestate/player_turn')
const activeUsersRef = firebase.database().ref('activeUsers')
const messagesRef = firebase.database().ref('messages')

//Event Listeners
gameBoardRef.on('child_changed', onGameStateChange) //X or O added to game board
gameStateRef.on('child_changed', onGameOver) // when game is over
messagesRef.limitToLast(10).on('child_added', onMessageChange) // when new message is added to firebase

// add event listener on cells
// Things that happen on click:
  // Data at cell# changed in firebase gameboard object
  // Player letter updated in firebase gamestate object

$('.cell').click(evt => {


  $.when(
    // check if you are a user who can make a move on the gameboard
    gameStateRef.once('value')
    .then((snap)=> snap.val())
    .then((gameStateObject)=>{

      const userId = firebase.auth().currentUser.uid

      let playerOne = gameStateObject.player1
      let playerTwo = gameStateObject.player2
      let currentPlayer = gameStateObject.current_player

      // jquery promise - true or false is passed to the next then
      // if true the user is a current player and can make a move
      if (userId === playerOne && currentPlayer === "X"){
        console.log("player one true")
        return true
      } else if (userId === playerTwo && currentPlayer === "O") {
        console.log("player two true")
        return true
      } else {
        console.log("false")
        return false
      }
    })
    // checkUserGameplay()
    )
  .then(data =>{

      console.log("test jquery promise", data)
      if(data){
        console.log("check user gamepaly returned true")

         if( $(evt.target).hasClass('space-taken') ) return
            let playerLetter;

            // get position of cell
            let position = $(evt.target).data('target')

            // get current player turn
            currentPlayerRef.once('value')
              .then(snap => playerLetter = snap.val())
              .then(data => {
                // console.log('playerLetter', playerLetter)

                // Make object to patch - Lucas, I'm an idiot.  I forgot you had to make keys with variables like this
                let changeLetterPatch = {}
                changeLetterPatch[position] = playerLetter;

                // Make change on gameboard in firebase
                gameBoardRef.update(changeLetterPatch) // ES6 way is too crazy
              })
              .then(()=> {
                checkForWin(playerLetter)
              })

              // Change the current players letter in firebase, if no one won.
              .then(data => {
                changePlayerLetter(playerLetter)
              })

            } else {
              console.log("check user gameplay returned false, you are not a current player")
            }
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

  // update curren players turn in div
  // get game state info
  gameStateRef.once('value')
    .then(snap => snap.val())
    .then(data => {
      // Get player 1 and player 2 uids
      player1_uid = data.player1
      player2_uid = data.player2
      // currentUserUid = firebase.auth().currentUser.uid

      // get current player letter
      let letter = data.current_player
      if (letter === "X"){
        console.log('It is player ones turn - game state changed')

        activeUsersRef.orderByChild('uid').equalTo(player2_uid)
          .once('value', (snap) => {
            console.log("check this snap", snap)

            let userObject
            // store snapshot value
            userObject = snap.val()

            // snapshot returns the firebase generated key - get key from object
            userObjectKey = Object.keys(userObject)[0]

            // store name
            displayName = userObject[userObjectKey].displayName

            // update dom with player Name
            updateTurnDiv(displayName)
        })
      } else if (letter === "O") {
        console.log('It is player twos turn - game state changed')

        activeUsersRef.orderByChild('uid').equalTo(player1_uid)
          .once('value', (snap) => {
            console.log("check this snap", snap)

            let userObject
            // store snapshot value
            userObject = snap.val()

            // snapshot returns the firebase generated key - get key from object
            userObjectKey = Object.keys(userObject)[0]

            // store name
            displayName = userObject[userObjectKey].displayName

            // update dom with player Name
            updateTurnDiv(displayName)
        })
      }
    })
}

// Changes all the cell values to empty strings in database
function resetGame() {
  console.log('resetting game data in database')

  gameBoardRef.set({
    a1: "", a2: "", a3: "",
    b1: "", b2: "", b3: "",
    c1: "", c2: "", c3: ""
  })

	gameStateRef.update({
		current_player: "X",
		player_won: "",
	})

  $('.cell').html('')
  console.log('cells reset in DOM')

  let player1_uid
  let player2_uid
  let currentUserUid
  let playerTurn
  let displayName
  gameStateRef.once('value')
  	.then(snap => snap.val())
  	.then(data => {
  		// Get player 1 and player 2 uids
  		player1_uid = data.player1
  		player2_uid = data.player2
  		currentUserUid = firebase.auth().currentUser.uid
  	})
  	.then(() => {
  		//If current user just completed game as player 1 or two, find and move them
  		if (currentUserUid === player1_uid || currentUserUid === player2_uid) {
  			findAndMovePlayer(currentUserUid)
  		}
  	})
    // // Westley's crazy code below
    // // add player one to playerTurn variable on game restart
    // .then(() => {
    //   gameStateRef.update({player_turn: player1_uid})
    //   playerTurn = player1_uid
    // })
    // .then(() => {
    //   console.log("reset game playerTurn variable", playerTurn)
    //   // get playerTurn id's display name from active users and put it on the DOM
    //   activeUsersRef.orderByChild('uid').equalTo(playerTurn)
    //     .once('value', (snap) => {
    //       console.log("snap", snap)
    //       // store snapshot value
    //       userObject = snap.val()

    //       // snapshot returns the firebase generated key - get key from object
    //       userObjectKey = Object.keys(userObject)[0]

    //       // store name
    //       displayName = userObject[userObjectKey].displayName

    //       // update dom with player Name
    //       updateTurnDiv(displayName)
    //     })
    // })
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

	let player1, player2
	const uid = firebase.auth().currentUser.uid
	// get player 1 and player 2
	firebase.database().ref('gamestate').once('value')
		.then(snap => snap.val())
		.then(gamestate => {
			player1 = gamestate.player1
			player2 = gamestate.player2
		})
		.then(() => {
			// Show modal to people who were in the game
			if(uid === player1 || uid === player2) {
				$('#game-over-modal').modal()
			}
			resetGame()
		})
}

// Displays board when user first loads page
function loadInitialGameState() {
	console.log("loadInitialGameState")

	// Load Xs and Os on board
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
    .then(onGameLoadUpdateTurnDiv())

	// // Loads in list of users initially, then updates when added to
	// activeUsersRef.on('child_added', onUserAdded)
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
