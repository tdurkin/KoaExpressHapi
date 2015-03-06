var koa = require('koa');
var app = koa();
var _ = require('koa-route');
var serve = require('koa-static');
var bodyparser = require('koa-bodyparser');
var path = require('path');

app.use(bodyparser());

// Serve static files
app.use(serve('./static'));

// This sets up koa-ejs to render dynamic views
var render = require('koa-ejs');
render(app, {
	root: path.join(__dirname, 'view'),
	layout: false
});

// our item list
var items = [];

// The root page
app.use(_.get('/', function *() {
	yield this.render('index');
}));

// Logs request processing times
app.use(function *(next) {
	var start = new Date();
	yield next;
	var ms = new Date() - start;
	console.log('%s %s - %s', this.method, this.url, ms);
});

var itemRoutes = {
	retrieveAll: function *() {
		this.body = items;
	},
	addItem: function *() {
		if (this.request.body && this.request.body.name) {
			items.push(this.request.body.name);
		}
		this.status = 204;
	},
	updateItem: function *(index) {
		if (this.request.body && this.request.body.name) {
			items[index] = this.request.body.name;
		}
		this.status = 204;
	},
	deleteItem: function *(index) {
		if (index && index < items.length) {
			items.splice(index, 1);
		}
		this.status = 204;
	}
};

// Retrieves all items
app.use(_.get('/items', itemRoutes.retrieveAll));

// Adds a new item
app.use(_.post('/items', itemRoutes.addItem));

// Updates an item
app.use(_.put('/items/:index', itemRoutes.updateItem));

// Deletes an item
app.use(_.delete('/items/:index', itemRoutes.deleteItem));

app.on('error', function(err, ctx) {
	console.log(err);
});

app.listen(3000);