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
                '/ip4/0.0.0.0/tcp/4001',
                '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
            ]
        }
    }
})

var _room = null;
var _callback = null;
var _peerCallback = null;

ipfs.once('ready', () => ipfs.id((err, info) => {
    if (err) { throw err }
    console.log('IPFS node ready with address ' + info.id)

    const room = Room(ipfs, 'ipfs-polinet-kovan')

    room.on('subscribed', () => {
        console.log('Now connected!')
    })

    room.on('peer joined', (peer) => {
        console.log('peer ' + peer + ' joined')
        if (_peerCallback) {
            _peerCallback(+1)
        }
    })
    room.on('peer left', (peer) => {
        console.log('peer ' + peer + ' left')
        if (_peerCallback) {
            _peerCallback(-1)
        }
    })
    room.on('message', (message) => {
        console.log('got message from ' + message.from + ': ' + message.data.toString())
        if (_callback) {
            _callback(message.data.toString())
        }
    })

    _room = room;
}))

function repo() {
    return 'ipfs/polinet/' + Math.random()
}

export function submitOrder(order) {
    const message = order;
    _room.broadcast(message)
}

export function subscribePeers(callback) {
    _peerCallback = callback;
}

export function subscribe(callback) {
    _callback = callback;
}