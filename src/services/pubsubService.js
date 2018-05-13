import IPFS from 'ipfs'
import Room from 'ipfs-pubsub-room'

const ipfs = new IPFS({
    repo: repo(),
    EXPERIMENTAL: {
        pubsub: true
    },
    config: {
        Addresses: {
            Swarm: [
                '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
            ]
        }
    }
})

var _room = null;
var _callback = null;

ipfs.once('ready', () => ipfs.id((err, info) => {
    if (err) { throw err }
    console.log('IPFS node ready with address ' + info.id)

    const room = Room(ipfs, 'ipfs-polinet')

    room.on('subscribed', () => {
        console.log('Now connected!')
        if(_callback){
            subscribeInternal(_callback)
        }
    })

    room.on('peer joined', (peer) => console.log('peer ' + peer + ' joined'))
    room.on('peer left', (peer) => console.log('peer ' + peer + ' left'))
    room.on('message', (message) => console.log('got message from ' + message.from + ': ' + message.data.toString()))

    _room = room;
}))

function repo() {
    return 'ipfs/polinet/' + Math.random()
}

export function submitOrder(order) {
    const message = order;
    _room.broadcast(message)
}

export function subscribe(callback) {
    if (_room) {
        subscribeInternal(callback)
    } else {
        _callback = callback;
    }
}

function subscribeInternal(callback) {
    _room.on('message', (msg) => {
        callback(msg.data.toString())
    });
}