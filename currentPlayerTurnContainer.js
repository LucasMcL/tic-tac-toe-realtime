console.log("currentPlayerTurnContainer.js loaded")

function updateTurnDiv(playerName/*, playerLetter*/){
  console.log("updateTurnDiv function called")
  // target turn span
  let currentTurnSpan = $('.turn-player')

  currentTurnSpan.text(playerName)

  // let userLetterSpan $('.turn-letter')

  // userLetterSpan.text(playerLetter)

}

function onGameLoadUpdateTurnDiv(){
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
      } else if (letter === "O") {
        console.log('It is player twos turn - game state changed')

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
      }
    })
}
