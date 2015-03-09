var Path = require('path');
var Hapi = require('hapi');

// our item list
var items = [];

var server = new Hapi.Server();
server.connection({
	port: 3000
});

// Set up templating
server.views({
	engines: {
		html: require('ejs')
	},
	path: Path.join(__dirname, 'view')
});

/* 
	Hapi doesn't support the concept of middleware. Instead this is a 
	primitive extension. Another option is to use a plugin. 
*/
var time;
server.ext('onRequest', function(request, reply) {
	time = new Date();
	reply.continue();
});
server.ext('onPreResponse', function(request, reply) {
	console.log('%s %s - %s', request.method, request.path, new Date() - time);
	reply.continue();
});

// The routes
server.route([
	{
		method: 'GET',
		path: '/',
		handler: function(request, reply) {
			reply.view('index');
		}
	},
	{
		method: 'GET',
		path: '/items',
		handler: function(request, reply) {
			reply(items);
		}
	},
	{
		method: 'POST',
		path: '/items',
		handler: function(request, reply) {
			items.push(request.payload.name);
			var response = reply();
			response.code(204);
		}
	},
	{
		method: 'PUT',
		path: '/items/{index}',
		handler: function(request, reply) {
			if (request.params.index < items.length) {
				items[request.params.index] = request.payload.name;
			}
			var response = reply();
			response.code(204);
		}
	},
	{
		method: 'DELETE',
		path: '/items/{index}',
		handler: function(request, reply) {
			if (request.params.index < items.length) {
				items.splice(request.params.index, 1);
			}
			var response = reply();
			response.code(204);
		}
	}
]);

// Serve static stuff
server.route({
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: 'static'
		}
	}
});

server.start();