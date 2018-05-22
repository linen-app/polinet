import IPFS from 'ipfs'
import Room from 'ipfs-pubsub-room'
import { convertToJson } from './dharmaService.js'

const TOPIC = 'polinet/v0/dharma/kovan';

var _room = null;
var _messageCallback = null;
var _peerCallback = null;
var _getOrdersCallback = null;

export function initialize(config) {
    const effectiveConfig = {
        ...config,
        repo: repo(),
        EXPERIMENTAL: {
            pubsub: true
        },
        config: {
            Addresses: {
                Swarm: [
                    // '/ip4/0.0.0.0/tcp/4002',
                    // '/ip4/127.0.0.1/tcp/4003/ws',
                    '/dns4/webrtc.infra.confirmationlabs.io/tcp/9090/ws/p2p-webrtc-star',
                ]
            }
        }
    }
    
    const ipfs = new IPFS(effectiveConfig)

    ipfs.once('ready', () => ipfs.id((err, info) => {
        if (err) { throw err }
        console.log('IPFS node ready with address ' + info.id)

        _room = Room(ipfs, TOPIC)

        _room.on('subscribed', () => {
            console.log('Now connected! Topic: ' + TOPIC)
        })

        _room.on('peer joined', (peer) => {
            console.log('peer ' + peer + ' joined')
            if (_peerCallback) {
                _peerCallback(+1)
            }
        })

        _room.on('peer left', (peer) => {
            console.log('peer ' + peer + ' left')
            if (_peerCallback && peer) {
                _peerCallback(-1)
            }
        })

        _room.on('message', (rawMessage) => {
            console.log('got message from ' + rawMessage.from + ': ' + rawMessage.data.toString())
            const message = JSON.parse(rawMessage.data.toString())
            switch (message.type) {
                case 'newOrder':
                    if (_messageCallback) {
                        _messageCallback(message.order)
                    }
                    break;
                case 'syncRequest':
                    if (_getOrdersCallback) {
                        const orders = _getOrdersCallback()
                            .filter(x => !message.orderHashes.includes(x.hash))
                            .map(convertToJson);
                        console.log(`Syncing ${orders.length} order(s) to peer ${rawMessage.from}`);
                        orders.forEach(order => {
                            const syncMessage = {
                                type: 'newOrder',
                                order
                            };
                            _room.sendTo(rawMessage.from, JSON.stringify(syncMessage));
                        });
                    }
                    break;

                default:
                    console.error(`Unsupported message type: ${message.type}`)
                    break;
            }
        });

        setInterval(() => {
            try {
                const peers = _room.getPeers()
                if (peers && peers.length) {
                    const peer = peers[Math.floor(Math.random() * peers.length)];
                    const orderHashes = _getOrdersCallback().map(x => x.hash);
                    console.log(`Syncing from peer ${peer}`);
                    const message = JSON.stringify({ type: 'syncRequest', orderHashes });
                    _room.sendTo(peer, message);
                }
            } catch (error) {
                console.error(`Peers sync failed: ${error}`);
            }
        }, 5000)
    }))
}

function repo() {
    return TOPIC + '/' + Math.random();
}

export function submitOrder(order) {
    const message = {
        type: 'newOrder',
        order
    }
    _room.broadcast(JSON.stringify(message))
}

export function subscribePeers(callback) {
    _peerCallback = callback;
}

export function subscribe(messageCallback, getOrdersCallback) {
    _messageCallback = messageCallback;
    _getOrdersCallback = getOrdersCallback;
}