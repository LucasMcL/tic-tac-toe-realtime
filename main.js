// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAKwiAe0DV9z5EdUMUKQVc5weewhlQHqsg",
  authDomain: "cool-real-time-tic-tac-toe.firebaseapp.com",
  databaseURL: "https://cool-real-time-tic-tac-toe.firebaseio.com",
  storageBucket: "cool-real-time-tic-tac-toe.appspot.com",
  messagingSenderId: "408081498564"
});

// add event listener on cells
$('.cell').click()

  // get position of cell

  // get current player turn

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




// create reset gameboard function

  // change gameboard to default values

  // maybe make x go first on default



// create function to check if a player has won

  // c
