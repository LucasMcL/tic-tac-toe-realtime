// To do: deal with user refreshing page, or leaving and coming back
	// problem: user object is deleted upon disconnect
	// user object is not recreated upon reconnection

console.log('playerAuth.js loaded')

// Event listeners
$('#sign-in-modal form').submit(createUser)

firebase.auth().onAuthStateChanged((user) => {
	if(user) {
		// Hide modal add soon as user successfully made
		$('#sign-in-modal').modal('hide')
		console.log('user added in firebase')
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
	console.log('createUser function fired')
	submitEvt.preventDefault()

	const display_name = $('#sign-in-modal input[type="text"]').val()
	let uid

	firebase.auth().signInAnonymously()
		.then(user => {
			uid = user.uid
			activeUsersRef.push({ display_name, uid })
				.then((snap) => {
					console.log('user added in our database')
					const post_id = snap.key
					const userRef = firebase.database().ref(`activeUsers/${post_id}`)
					userRef.onDisconnect().remove()
				})
		})
}

// Reference this later

// var userRef = firebase.database().ref("disconnectmessage");
// // Write a string when this client loses connection
// presenceRef.onDisconnect().set("I disconnected!");








