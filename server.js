var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb://127.0.0.1/chat';

// message model
var Message = mongoose.model('Message', { name : String, message : String});

app.get('/messages', (req, res) => {
	Message.find({}, (err, messages) => {
		res.send(messages);
	})
});

app.post('/messages', (req, res) => {
	var message = new Message(req.body);
	message.save((err) => {
		if(err){
			sendStatus(500);
		}
		else{
			io.emit('message', req.body);
			res.sendStatus(200);
		}
	});
});

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => { 
   console.log('mongodb connected', err);
});

var server = app.listen(3000, () => {
	console.log('server chat running on port', server.address().port);
});

var io = require('socket.io').listen(server);
var http = require('http');

io.on('connection', () => {
	console.log('a user is connected');
});
