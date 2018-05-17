const pubsubService = require('./src/services/pubsubService.js');
const dharmaService = require('./src/services/dharmaService.js');

let orders = {};

pubsubService.subscribe(
    (orderJson) => dharmaService
        .parseJsonOrder(orderJson)
        .then(order => {
            orders = Object.assign({ [order.hash]: order }, orders);
            console.log(`New order recieved: ${JSON.stringify(order)}`);
        }),
    () => Object.values(orders)
);