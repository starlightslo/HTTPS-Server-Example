var express = require('express');
var store = require('cookie-sessions');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var fs = require('fs');
var https = require('https');
var app = express();

var options = {
	key: fs.readFileSync('/ssl/ssl.key'),
	cert: fs.readFileSync('/ssl/ssl.crt')
};

app.use(store({secret: 'TonyHuang'}));
app.use(bodyParser());

app.set('view engine', 'ejs');
app.set('view options', {layout: false});

var server = https.createServer(options, app);

function initSession(req) {
	if (typeof req.session === 'undefined') {
		req.session = {
			logined: false
		};
	}
}

app.get('/', function(req, res) {
	initSession(req);
	
	if (req.session.logined == true) {
		res.render('index2');
	} else {
		res.render('index', {err: ''});
	}
});
app.get('/logout', function(req, res) {
	try {
		req.session.logined = false;
	} catch (err) {
		console.log(err);
	}
	
	res.render('index', {err: ''});
});
app.post('/login', function(req, res) {
	fs.readFile('./account', 'utf8', function (err, data) {
		if (err) {
			throw err;
			return;
		}

		data = JSON.parse(data)
		try {
			if (req.body.username === data.username &&
			    req.body.password === data.password) {
				req.session.logined = true;
				res.render('index2');
			} else {
				res.render('index', {err: 'Login Failed.'});
			}
		} catch (err) {
			res.render('index', {err: ''});
			console.log(err);
		}
	});
});

server.listen(443, function() {
	console.log('Web server is starting...');
});
