import React from 'react';
import { subscribePeers } from '../services/pubsubService.js'

export default class PeerMonitor extends React.Component {

    constructor(props) {
        super(props);
        this.state = { peerCount: 0 };

        subscribePeers(inc => this.setState((prevState) =>
            ({
                peerCount: prevState.peerCount + inc
            })
        ));
    }

    render() {
        return (
            <p>Peers count: {this.state.peerCount}</p>
        );
    }
}