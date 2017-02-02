console.log('playerAuth.js loaded')

// Event listeners
$('#sign-in-modal form').submit(createUser)
// activeUsersRef.on('child_added', onUserAdded)
// activeUsersRef.on('child_removed', onUserRemoved)
activeUsersRef.on('value', onActiveUsersChanged)


firebase.auth().onAuthStateChanged((user) => {
	if(user) {
		let uid
		const displayName = $('#sign-in-modal input[type="text"]').val() || user.displayName

		uid = user.uid
		// Creates object in our database when user signs in annonymously
		// Or when they come back and are still logged in
		activeUsersRef.push({ displayName, uid })
			.then((snap) => {
				console.log('user added in our database')
				const post_id = snap.key
				// add disconnect event listener to that user obj in our database
				const userRef = firebase.database().ref(`activeUsers/${post_id}`)
				userRef.onDisconnect().remove()
			})

		// Hide modal, load board and users
		$('#sign-in-modal').modal('hide')
		loadInitialGameState()
	}
	else {
		// If no user signed in
		$('#sign-in-modal').modal({
		  backdrop: 'static',
		  keyboard: false
		})
	}
})

function createUser(submitEvt) {
	submitEvt.preventDefault()

	const displayName = $('#sign-in-modal input[type="text"]').val()
	firebase.auth().signInAnonymously()
		.then(user => {
			// Give the user object a display name
			// If user leaves and comes back, it will remember
			user.updateProfile({ displayName })
		})
}

function onActiveUsersChanged(snap) {
	console.log('onActiveUsersChanged fired')
	$('.user-container').html('')
	let i = 0
	snap.forEach(snap => {
		const user = snap.val()
		$('.user-container')
			.append(`<p id=${user.uid}>${user.displayName}</p>`)

		// Add class 'current user' to the element in DOM
		if (user.uid === firebase.auth().currentUser.uid) {
			$(`#${user.uid}`).addClass('current-user')
		}

		if(i === 1) {
			$('.user-container').append('<div class="user-header waiting">Waiting</div>')
		}

		i++
	})
}

// Called from event listener that listens for child added to userList
function onUserAdded(snap) {
	const user = snap.val()
	console.log("user that was added: ", user)
	$('.user-container')
		.append(`<p id=${user.uid}>${user.displayName}</p>`)
}

// Called from event listener that listens for child removed to userList
function onUserRemoved(snap) {
	console.log("onUserRemoved function fired")
	const uid = snap.val().uid
	$(`#${uid}`).remove()
}


function checkUserGameplay(){
	// grab logged in users uid
  const userId = firebase.auth().currentUser.uid
  // console.log("userId", userId)

  // grab current player uids
  gameStateRef.once('value')
  	.then((snap)=> snap.val())
  	.then((gameStateObject)=>{
  		// console.log("gameStateObject", gameStateObject)

  		let playerOne = gameStateObject.player1
  		let playerTwo = gameStateObject.player2

  		// console.log("playerOne", playerOne)
  		// console.log("playerTwo", playerTwo)

  		if (userId === playerOne || userId === playerTwo){
  			// console.log("true")
  			return true
  		} else {
  			// console.log("false")
  			return false
  		}
  	})
}
