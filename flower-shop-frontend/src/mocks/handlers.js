const {rest} = require('msw');
const FlowersData = require('./products-flowers.json');

const handlers = [
    rest.post('/api/users/log_in', (request, response, context) => 
        // TODO: implement mock logging
        response(
          // Respond with a 200 status code
          context.status(200),
        )
    ),

    rest.get('/api/products/:productID', (request, response, context) => {
        const { productID } = request.params;
        const flower = FlowersData.filter((flowerItem) => flowerItem.id === productID);
        return response(
          context.status(200),
          context.set('Content-Type', 'application/json'),
          context.json(flower),
          context.text("Success fetching product."),
        )
    }),

    rest.get('/api/products', (request, response, context) => response(
          context.status(200),
          context.set('Content-Type', 'application/json'),
          context.json(FlowersData),
          context.text("Success fetching product."),
      )),
]

module.exports = handlers;