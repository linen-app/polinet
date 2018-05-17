import Web3 from 'web3';

let web3;

console.log('undefined' !== typeof window)
if ('undefined' !== typeof window) {
  window.addEventListener('load', function () {
    if (typeof window.web3 !== 'undefined') {
      web3 = window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Please, install metamask.io extension in your browser.');
    }
  })
} else {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log('Connecting to local ethereum node...')
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
}

export function getCurrentProvider() {
  return 'undefined' !== typeof window ?
    window.web3 && window.web3.currentProvider :
    web3 && web3.currentProvider;
}

export function getNetwork() {
  return web3.version.network;
}

export function getNetworkAsync() {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, netId) => {
      if (err) {
        reject(err);
      }
      resolve(netId);
    });
  });
}