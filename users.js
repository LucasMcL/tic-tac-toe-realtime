console.log("users.js loaded")

let userKey

// add logged in users to users div on DOM

function onActiveUsersChange (snapshot) {
  console.log("onActiveUsersChange function called")

  const user = snapshot.val()
  // console.log(user)
  userKey = snapshot.getKey()

  const userListDiv = $('.user-container')

  // Do I need to add an id to this? I don't think I do
  userListDiv.append(`<p id=${user.uid}>${user.displayName}</p>`)
}



function addActiveUsers () {
  console.log("addActiveUsers function called")
}



// const messageForm = $('.message-form')

// messageForm.on('submit', addNewMessage)


// function onMessageChange(snapshot){
//   console.log("onMessageChange function called")

//   const message = snapshot.val()

//   const messageKey = snapshot.getKey()

//   const messageDiv= $('.message-container')
//   //grab message div and append

//   messageDiv.append(`<p id=${messageKey}>Anonymoose: ${message}</p>`)

//   // if number of messages is greater than 10, delete them from dom and firebase
//   if(messageDiv.children().length > 10){
//     // get id of first child
//     const deleteThisMessage = $('.message-container p:first-child').attr('id')

//     // remove message from DOM
//     $('.message-container p:first-child').remove()

//     // remove message from firebase
//     messagesRef.child(deleteThisMessage).remove()
//   }
// }

// function addNewMessage(event){
//   event.preventDefault()
//   console.log("addNewMessage function called")

//   const newMessage = $('.message-input-text')

//   console.log(newMessage)

//   messagesRef.push(newMessage.val())

//   newMessage.val('')
// }
