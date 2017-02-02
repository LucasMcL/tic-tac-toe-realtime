console.log('playerAuth.js loaded')

// Event listeners
$('#sign-in-modal form').submit(createUser)
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

// Updates player list in DOM on change to use list
// Will fire when user signs in
// Will fire when user disconnects
// Will fire when user reconnects
function onActiveUsersChanged(snap) {
	console.log('onActiveUsersChanged fired')
	$('.user-container').html('') // clear player list in DOM
	let i = 0
	snap.forEach(snap => {
		const user = snap.val()
		$('.user-container')
			.append(`<p id=${user.uid}>${user.displayName}</p>`)

		// Add class 'current user' to the element in DOM
		if (user.uid === firebase.auth().currentUser.uid) {
			$(`#${user.uid}`).addClass('current-user')
		}

		// Add header 'waiting' after first two players added in list
		if(i === 1) {
			$('.user-container').append('<div class="user-header waiting">Waiting</div>')
		}

		if(i === 0) gameStateRef.update( {"player1": user.uid} )
		if(i === 1) gameStateRef.update( {"player2": user.uid} )

		i++
	})
}

function reorderPlayers() {
	activeUsersRef.once('value')
		.then(snap => snap.val())
		.then(users => {
			console.log('deleting users and readding')
			const player1_postId = Object.keys(users)[0]
			const player2_postId = Object.keys(users)[1]
			const player1_Obj = users[player1_postId]
			const player2_Obj = users[player2_postId]

			activeUsersRef.child(player1_postId).remove()
			activeUsersRef.child(player2_postId).remove()
			activeUsersRef.push(player1_Obj)
				.then(() => console.log('player 1 re added'))
			activeUsersRef.push(player2_Obj)
				.then(() => console.log('player 2 re added'))
		})
}








