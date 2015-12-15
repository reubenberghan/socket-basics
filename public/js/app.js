var chatName = getQueryVariable('name') || 'Anonymous',
	room = getQueryVariable('room'),
	socket = io(),
	connectionMessage = $('p.connection-message'),
	messageContainer = $('div.message-container');
	
if (room) { $('.room-name').text(room + ' Chat Room'); }

socket.on('connect', function() {
	connectionMessage.text('Connected to socket.io server!');
	if (!chatName || !room) { return; }
	messageContainer.append('<p><strong>' + moment().format('h:mm a') + ':</strong> ' + chatName + ' joined ' + room + '...</p>');
	socket.emit('joinRoom', { name: chatName, room: room });
});

socket.on('message', function(message) {
	var localTime = moment.utc(message.timestamp).local().format('h:mm a');
	messageContainer.append('<p><strong>' + message.name + ' ' + localTime + ':</strong> ' + message.text + '</p>');
});

// handles submitting of new message
var $form = $('form.message-form');

$form.on('submit', function(event) {
	event.preventDefault();
	
	var $message = $form.find('input[name=message]');
	
	socket.emit('message', {
		name: chatName,
		text: $message.val()
	});
	
	$message.val('');
	$message.focus();
});