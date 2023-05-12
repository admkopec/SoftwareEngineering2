const { setupServer } = require('msw/node');
const handlers = require('./handlers.js');
// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

module.exports = server;