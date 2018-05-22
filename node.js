import WStar from 'libp2p-webrtc-star';
import { initialize, subscribe } from "./src/services/pubsubService.js";
import { parseJsonOrder, validateOrderAsync } from "./src/services/dharmaService.js";

var wrtc = require('electron-webrtc')(); //require('wrtc')
const wstar = new WStar({ wrtc: wrtc });
initialize({
    config: {
        Addresses: {
            Swarm: [
                '/ip4/0.0.0.0/tcp/4002',
                '/ip4/127.0.0.1/tcp/4003/ws',
                '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star',
            ]
        }
    },
    libp2p: {
        modules: {
            transport: [wstar],
            discovery: [wstar.discovery]
        }
    }
});

let _orders = {};

subscribe(
    (orderJson) => parseJsonOrder(orderJson)
        .then(order => {
            _orders = Object.assign({ [order.hash]: order }, _orders);
            console.log(`New order recieved: ${JSON.stringify(order)}`);
        }),
    () => Object.values(_orders)
);

setInterval(() => {
    const ordersArray = Object.values(_orders);
    const orderPromises = ordersArray.map(order => validateOrderAsync(order).catch(() => null));
    Promise.all(orderPromises)
        .then(orders => orders.filter(x => x))
        .then(orders => orders.reduce((prev, curr) => Object.assign({ [curr.hash]: curr }, prev), {}))
        .then(orders => {
            console.log(`Filtered orders length: ${Object.keys(orders).length}`)
            _orders = orders;
        });
}, 3000)