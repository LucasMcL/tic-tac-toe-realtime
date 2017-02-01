console.log("messages.js loaded")

const messageForm = $('.message-form')

console.log("message form", messageForm)

messageForm.on('submit', addNewMessage)


function onMessageChange(snapshot){
  console.log("onMessageChange function called")

  const message = snapshot.val()
  console.log("message", message)

  const messageDiv= $('.message-container')
  //grab message div and append

  messageDiv.append(`<p>Anonymoose: ${message}</p>`)

  // console.log(messageDiv.children().length)
  if(messageDiv.children().length > 10){
    console.log("message more than 10")
    console.log($('.message-container:first-child'))
    $('.message-container p:first-child').remove()
  }
}



function addNewMessage(event){
  event.preventDefault()
  console.log("addNewMessage function called")

  const newMessage = $('.message-input-text')

  console.log(newMessage)

  messagesRef.push(newMessage.val())

  newMessage.val('')
}
