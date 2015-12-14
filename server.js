var PORT = process.env.PORT || 3000,
	express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	moment = require('moment');
	
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	var timestamp = moment().valueOf();
	
	console.log('User connected via socket.io!');
	
	socket.on('message', function(message) {
		
		console.log(moment().format('h:mm a') + ': ' + message.text);
		
		message.timestamp = moment().valueOf();
		// socket.broadcast.emit('message', message);
		io.emit('message', message);
	});
	
	socket.emit('message', {
		text: 'Welcome to the chat application',
		timestamp: timestamp
	});
});

http.listen(PORT, function() { console.log('Server started on port', PORT); })