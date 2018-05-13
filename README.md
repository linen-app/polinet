# POLINET
## P2P Open Liquidity Network for 0x-based protocols

## Demo video
[Link](https://drive.google.com/file/d/1LzT0GldSMTnf2hmIYYJS3jp-xMF2sb8D/view?usp=sharing)

## Inspiration
We believe in open protocols and decentralized applications and, therefore, prior to the hackathon built Bloqboard, a platform that facilitates borrowing and lending of tokens built on the Dharma, a p2p lending protocol. For this hackathon, we decided to go one step further and created a decentralized p2p network that facilitates trading and lending on 0x-based protocols without intermediaries like relayers.     

## What is it?
P2P Open Liquidity Network for 0x-based protocols provides a decentralized channel to share orders and trade or lend tokens between network peers. 

## How we built it
We built it as a decentralized web application using _IPFS pubsub_ and _WebRTC_ for p2p communication and _web3.js_ for orders validation.

## Challenges we ran into and what we learned
A browser version _libp2p pubsub_ is not so mature, so we decided to use a more mature _IPFS pubsub_ library.

## What's next for Bloqboard PoliNet
We will continue developing POLINET to integrate it with the token lending and trading protocols.
