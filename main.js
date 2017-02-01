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

//Event Listeners
gameBoardRef.on('child_changed', onGameStateChange)

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

  gameStateRef.set({current_player: "X"})

  $('.cell').html('')
  console.log('cells reset in DOM')
}

// firebase realtime will update changes


// update cell with current players letter



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


// Notes

// .set()   overwrite

// .update()   just like patch


// .remove()  delete stuffs

//  .push()   like post dummy
