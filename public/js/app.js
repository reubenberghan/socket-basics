var socket = io();

socket.on('connect', function() {
	$('p.connection-message').html('Connected to socket.io server!');
});

socket.on('message', function(message) {
	$('div.message-container').append('<p>New message: ' + message.text + '</p>');
});

// handles submitting of new message
var $form = $('form.message-form');

$form.on('submit', function(event) {
	event.preventDefault();
	
	var $message = $form.find('input[name=message]');
	
	socket.emit('message', {
		text: $message.val()
	});
	
	$message.val('');
	$message.focus();
});