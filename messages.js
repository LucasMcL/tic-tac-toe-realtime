// get message form from dom
const messageForm = $('.message-form')

messageForm.on('submit', addNewMessage)


function onMessageChange(snapshot){
  // console.log("onMessageChange function called")

  const messageObject = snapshot.val()

  // store message key to delete message if greater than 10
  const messageKey = snapshot.getKey()

  // why am i getting this.
  const authorUid = messageObject.authorUid

  // store message
  const message = messageObject.message

  // get user name of message owner
  const displayName = messageObject.displayName

  // grab message container div on DOM
  const messageDiv= $('.message-container')

  // append info to message board
  messageDiv.append(`<p id=${messageKey}>${displayName}: ${message}</p>`)

    // if number of messages is greater than 10, delete them from dom and firebase
    if(messageDiv.children().length > 10){
      // get id of first child
      const deleteThisMessage = $('.message-container p:first-child').attr('id')

      // remove message from DOM
      $('.message-container p:first-child').remove()

      // remove message from firebase
      messagesRef.child(deleteThisMessage).remove()
    }
}


function addNewMessage(event){
  event.preventDefault()
  // console.log("addNewMessage function called")

  // get user message
  const messageContent = $('.message-input-text')

  // get user uid
  const authorUid = firebase.auth().currentUser.uid

  // get user displayName
  let displayName

  // filter out user with the logged in users UID
  activeUsersRef.orderByChild('uid').equalTo(authorUid)
    .once('value', (snapshot)=>{

      // store snapshot value
      userObject = snapshot.val()

      // snapshot returns the firebase generated key - get key from object
      userObjectKey = Object.keys(userObject)[0]

      // store name
      displayName = userObject[userObjectKey].displayName
    })

  let newMessageObject = {
                            "message": messageContent.val(),
                            "authorUid": authorUid,
                            "displayName": displayName
                        }

  // post newMessageObject to firebase
  messagesRef.push(newMessageObject)

  // clear message input on dom
  messageContent.val('')
}
