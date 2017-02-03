// Todo:
	// Force game end after certain amount of time

console.log('playerAuth.js loaded')

// Event listeners
$('#sign-in-modal form').submit(createUser)
activeUsersRef.on('value', onActiveUsersChanged)

// Timeouts to clear currentUser list of non-active users
window.setInterval(updateUserList, 10000)


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


function findAndMovePlayer(uid) {
	let post_id
	let users
	activeUsersRef.orderByChild('uid').equalTo(uid).once('value')
		.then(snap => {
			users = snap.val()
			return users
		})
		.then(users => {
			post_id = Object.keys(users)[0]
			user = users[post_id]
			firebase.database().ref(`activeUsers/${post_id}`).remove()
			activeUsersRef.push(user)
		})
}

function checkUserGameplay(){

  // grab current player uids
  gameStateRef.once('value')
  	.then((snap)=> snap.val())
  	.then((gameStateObject)=>{
  		// console.log("gameStateObject", gameStateObject)

  		// grab logged in users uid
		  const userId = firebase.auth().currentUser.uid
		  console.log("userId", userId)

  		let playerOne = gameStateObject.player1
  		let playerTwo = gameStateObject.player2

  		console.log("playerOne", playerOne)
  		console.log("playerTwo", playerTwo)

  		if(userId === playerOne) console.log("user id and playerOne are the same")
			if(userId === playerTwo) console.log("user id and playerTwo are the same")

  		if (userId === playerOne){
  			console.log("player one true")
  			return true
  		} else if (userId === playerTwo) {
  			console.log("player two true")
  			return true
  		} else {
  			console.log("false")
  			return false
  		}
  	})
}

function updateUserList() {
	console.log("removeInactiveUsers fired")
	const uid = firebase.auth().currentUser.uid

	signedInUsersRef.push({ uid })

	// Player 1 performs garbage collection
	gameStateRef.once('value')
		.then(snap => snap.val().player1)
		.then(player1 => {
			if (uid === player1) garbageCollect()
		})
}

function garbageCollect() {
	let uidsToRemove = []

	signedInUsersRef.once('value')
		.then(snap => Object.values(snap.val()))
		.then(users => {
			let uids = []
			users.forEach(user => {uids.push(user.uid)})

			activeUsersRef.once('value')
				.then(snap => Object.values(snap.val()))
				.then(activeUsers => {
					for(let i = 0; i < activeUsers.length; i++) {
						let uidToCheck = activeUsers[i].uid
						let match = false
						for(let i = 0; i < uids.length; i++) {
							if(uids[i] === uidToCheck) match = true
						}
						if(!match) {
							uidsToRemove.push(uidToCheck)
						}
					}
				})
				.then(() => {
					console.log("uidsToRemove", uidsToRemove)
				})
		})
}














