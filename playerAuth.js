console.log('playerAuth.js loaded')

// Event listeners
$('#sign-in-modal form').submit(createUser)

firebase.auth().onAuthStateChanged((user) => {
	if(user) {
		// Hide modal add soon as user successfully made
		$('#sign-in-modal').modal('hide')
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
	firebase.auth().signInAnonymously()
		.then(user => {
			const uid = user.uid
			activeUsersRef.push({ display_name, uid })
		})
}

// Reference this later

// var presenceRef = firebase.database().ref("disconnectmessage");
// // Write a string when this client loses connection
// presenceRef.onDisconnect().set("I disconnected!");








