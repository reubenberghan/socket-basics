var PORT = process.env.PORT || 3000,
	express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	moment = require('moment');
	
app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// sends current users to provided socket
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id],
		users = [];
		
	if (typeof info === 'undefined') {
		return;
	}
	
	Object.keys(clientInfo).forEach(function(socketId) {
		var userInfo = clientInfo[socketId];
		
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});
	
	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	
	console.log('User connected via socket.io!');
	
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left...',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});
	
	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		})
	});
	
	socket.on('message', function(message) {
		
		console.log(moment().format('h:mm a') + ': ' + message.text);
		
		if (message.text === '@currentUsers') {
			return sendCurrentUsers(socket);
		}
		
		message.timestamp = moment().valueOf();
		// socket.broadcast.emit('message', message);
		io.to(clientInfo[socket.id].room).emit('message', message);
	});
	
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() { console.log('Server started on port', PORT); })