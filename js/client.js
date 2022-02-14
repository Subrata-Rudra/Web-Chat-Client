const socket = io('http://localhost:8000');

// Get DOM variables in respective JS variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play while receiving messages or someone joins tha chat
var audio = new Audio('tone.mp3');


// Function which will append event information to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}


// Ask new user for his/her name and let the server(backend) know
const name1 = prompt("Enter your name to join the chat");
socket.emit('new-user-joined', name1);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name1 => {
    append(`${name1} joined the chat!`, 'right')
})

// If the server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name1}: ${data.message}`, 'left')
})

// If any user leaves the chat, append the "leaving message" to the container
socket.on('leave', name1 => {
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
