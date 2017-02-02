
const messageForm = $('.message-form')

messageForm.on('submit', addNewMessage)


function onMessageChange(snapshot){
  // console.log("onMessageChange function called")

  const message = snapshot.val()

  const messageKey = snapshot.getKey()

  const messageDiv= $('.message-container')

  // const userId = firebase.auth().currentUser.uid

  const userRef = firebase.database().ref(`activeUsers/${userKey}`)
  // const userRef = firebase.database().ref(`activeUsers/`)

  console.log("userRef", userRef)
  // console.log("userId", userId)
  console.log("userKey", userKey)
  //grab message div and append


//   var userId = firebase.auth().currentUser.uid;
//   return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
//   var username = snapshot.val().username;
//   // ...
// });

  // const userId = firebase.auth().currentUser.uid;
  // console.log("userId", userId)

  userRef.once('value').then((snapshot)=>{

    const userInfo = snapshot.val()

    messageDiv.append(`<p id=${messageKey}>${userInfo.display_name}: ${message}</p>`)

    // if number of messages is greater than 10, delete them from dom and firebase
    if(messageDiv.children().length > 10){
      // get id of first child
      const deleteThisMessage = $('.message-container p:first-child').attr('id')

      // remove message from DOM
      $('.message-container p:first-child').remove()

      // remove message from firebase
      messagesRef.child(deleteThisMessage).remove()
    }
  })

//   messageDiv.append(`<p id=${messageKey}>Anonymoose: ${message}</p>`)
//   // messageDiv.append(`<p id=${messageKey}>${userName}: ${message}</p>`)

//   // if number of messages is greater than 10, delete them from dom and firebase
//   if(messageDiv.children().length > 10){
//     // get id of first child
//     const deleteThisMessage = $('.message-container p:first-child').attr('id')

//     // remove message from DOM
//     $('.message-container p:first-child').remove()

//     // remove message from firebase
//     messagesRef.child(deleteThisMessage).remove()
//   }
}

function addNewMessage(event){
  event.preventDefault()
  // console.log("addNewMessage function called")

  const newMessage = $('.message-input-text')

  // console.log(newMessage)

  messagesRef.push(newMessage.val())

  newMessage.val('')
}
