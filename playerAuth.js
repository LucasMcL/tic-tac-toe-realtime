console.log('playerAuth.js loaded')

// Event listeners
$('#sign-in-modal form').submit(createUser)

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
				const userRef = firebase.database().ref(`activeUsers/${post_id}`)
				userRef.onDisconnect().remove()
			})

		// Hide modal, load board
		$('#sign-in-modal').modal('hide')
		loadInitialGameBoard()
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

// Reference this later

// var userRef = firebase.database().ref("disconnectmessage");
// // Write a string when this client loses connection
// presenceRef.onDisconnect().set("I disconnected!");


