var socket = io();

socket.on('connect', function() {
	$('p.connection-message').html('Connected to socket.io server!');
});

socket.on('message', function(message) {
	$('div.message-container').html('New message: ' + message.text);
});