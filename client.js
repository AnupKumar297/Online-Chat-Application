const socket = io('http://localhost:8000');

// Get DOM elements in respective JS variable
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Audio that will play on receiving message
var audio = new Audio('assets/tune.wav'); // Corrected path to the audio file

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right"); // Corrected template literals
    socket.emit('send', message);
    messageInput.value = '';
})

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right'); // Corrected template literals
})

// If server sends a message, receive it 
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left'); // Corrected template literals
})

// If a user left the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right'); // Corrected template literals
})
