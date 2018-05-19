const pubsubService = require('./src/services/pubsubService.js');
const dharmaService = require('./src/services/dharmaService.js');

let _orders = {};

pubsubService.subscribe(
    (orderJson) => dharmaService
        .parseJsonOrder(orderJson)
        .then(order => {
            _orders = Object.assign({ [order.hash]: order }, _orders);
            console.log(`New order recieved: ${JSON.stringify(order)}`);
        }),
    () => Object.values(_orders)
);

setInterval(() => {
    const ordersArray = Object.values(_orders);
    const orderPromises = ordersArray.map(order => dharmaService.validateOrderAsync(order).catch(() => null));
    Promise.all(orderPromises)
        .then(orders => orders.filter(x => x))
        .then(orders => orders.reduce((prev, curr) => Object.assign({ [curr.hash]: curr }, prev), {}))
        .then(orders => {
            console.log(`Filtered orders length: ${Object.keys(orders).length}`)
            _orders = orders;
        });
}, 3000)