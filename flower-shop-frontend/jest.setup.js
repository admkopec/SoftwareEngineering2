// Polyfill "window.fetch" used in the React component.
require('whatwg-fetch');

// Extend Jest "expect" functionality with Testing Library assertions.
require('@testing-library/jest-dom');

// Create MSW server
const server = require('./src/mocks/server.js');
const {regions} = require("./src/resources/constants");

// Establish API mocking before all tests.
beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}));
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
beforeEach(() => sessionStorage.clear());
// Clean up after the tests are finished.
afterAll(() => server.close());