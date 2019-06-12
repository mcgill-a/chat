var socket = io();

var message = document.getElementById("inputMessage");
var username = document.getElementById("inputUsername");
var send_message = document.getElementById("sendMessage");
var send_username = document.getElementById("sendUsername");

// Default focus to message input text box
message.focus();

// Detect when enter key is pressed in text boxes
message.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        send_message.click();
    }
});

username.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        send_username.click();
    }
});

// Send input information to web sockets on button clicks
send_message.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('message', {message : message.value});
    message.value = "";
    message.focus();
});

send_username.addEventListener('click', (e) => {
    if(username.value.length < 2 || username.value.length > 30) {
        alert('Error:\nUsername length must be between 2-30 characters');
        username.focus();
    } else {
        socket.emit('change_username', {username : username.value});
        message.placeholder = "@" + username.value;
        username.value = "";
        message.focus();
    }
});

// Display web socket connection status
socket.on('connect', () => {
    console.log('socket.io connected');
});

socket.on('disconnect', () => {
    console.log('socket.io disconnected');
});

// Receive the web socket data and append to chat log
socket.on('message', (data) => {
    append('log', data.username + ": " + data.message);
});

// Get the current date and or time
function getTimestamp(output) {
    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    
    var time = hours + ":" + minutes;
    if (output == "date") {
        return date;
    } else if (output == "time") {
        return time;
    } else {
        return date + ' ' + time;
    }
}

// Append text to chat log
const append = (parentId, text) => {
  const parent = document.getElementById(parentId);
  const item = document.createElement('li');
  item.title = getTimestamp('');
  item.innerHTML = getTimestamp('time') + " @" + text;
  parent.appendChild(item);
  parent.scrollTop = parent.scrollHeight;
};
