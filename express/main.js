var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// our item list
var items = [];

app.use(express.static('static'));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/view');
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: false}));

// Logs request processing times
app.use(function (req, res, next) {
	var start = new Date();
	next();
	var ms = new Date() - start;
	console.log('%s %s - %s', req.method, req.url, ms);
});

// The root page
app.get('/', function(req, res) {
	res.render('index', {});
});

var itemRoutes = {
	retrieveAll: function (req, res, next) {
		res.send(items);
	},
	addItem: function (req, res, next) {
		if (req.body && req.body.name) {
			items.push(req.body.name);
		}
		res.status(204).end();
	},
	updateItem: function (req, res, next) {
		if (req.body && req.body.name) {
			items[req.params.index] = req.body.name;
		}
		res.status(204).end();
	},
	deleteItem: function (req, res, next) {
		if (req.params.index && req.params.index < items.length) {
			items.splice(req.params.index, 1);
		}
		res.status(204).end();
	}
};

// Retrieves all items
app.get('/items', itemRoutes.retrieveAll);

// Adds a new item
app.post('/items', itemRoutes.addItem);

// Updates an item
app.put('/items/:index', itemRoutes.updateItem);

// Deletes an item
app.delete('/items/:index', itemRoutes.deleteItem);

app.use(function(err, req, res, next) {
	console.log(err);
	next(err);
});

var server = app.listen(3000);