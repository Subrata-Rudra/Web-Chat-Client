const socket = io('http://web-chat-by-subrata-rudra.herokuapp.com');

// Get DOM variables in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play while receiving messages or someone joins the chat
var audio = new Audio('tone.mp3');
var user_joined_audio = new Audio('user joined.mp3');
var user_left_audio = new Audio('user left.mp3');


// Function which will append event information to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    // This code will play the "ting" sound only when the user is infront of the browser and seeing the document
    if(position == 'left' && document.visibilityState === "visible"){
        audio.play();
    }
}


// Ask new user for his/her name and let the server(backend) know
const name1 = prompt("Enter your name to join the chat");
socket.emit('new-user-joined', name1);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name1 => {
    //this code will play "New user joined" audio when the user is not seeing browser
    if(document.visibilityState === "hidden")
    {
        user_joined_audio.play();
    }

    append(`${name1} joined the chat!`, 'right')
})

/******************************************* */
// // If the server sends a message, receive it
// socket.on('receive', data => {
//     append(`${data.name1}: ${data.message}`, 'left')
//     // This code is to send notifications if messages are incoming
//     Notification.requestPermission().then((permit) => {  
//         if (permit === "granted") {
//             let nameCap = data.name1.toUpperCase()
//           const notification = new Notification(
//             `New message📩 from ${nameCap}`,
//             {
//               body: data.message,
//               icon: "logo.jpg",
//             }
//           );
//         }
//       });
// })
/********************************************************* */

// If the server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name1}: ${data.message}`, 'left')
    // This code is to send notifications if messages are incoming
    if(document.visibilityState === "hidden")  // This line is to send notification only when the user is not seeing the browser
    {
        Notification.requestPermission().then((permit) => {  
            if (permit === "granted") {
                let nameCap = data.name1.toUpperCase()
              const notification = new Notification(
                `New message📩 from ${nameCap}`,
                {
                  body: data.message,
                  icon: "logo.jpg",
                }
              );
            }
          });
    }
})

// If any user leaves the chat, append the "leaving message" to the container
socket.on('leave', name1 => {
    //this code will play "A user has left" audio when the user is not seeing browser
    if(document.visibilityState === "hidden")
    {
        user_left_audio.play();
    }
    append(`${name1} left the chat`, 'right')
})

// If the form get submitted, send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = "";
})
