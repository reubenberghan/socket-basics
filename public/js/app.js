var socket = io();

socket.on('connect', function() {
	$('p.connection-message').html('Connected to socket.io server!');
});