import Web3 from 'web3';

window.addEventListener('load', function () {
  if (typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    alert('Please, install metamask.io extension in your browser.');
  }
})

export default window.web3 && window.web3.currentProvider;

export function getNetwork() {
  return window.web3.version.network;
}

export function getNetworkAsync() {
  return new Promise((resolve, reject) => {
    window.web3.version.getNetwork((err, netId) => {
      if (err) {
        reject(err);
      }
      resolve(netId);
    });
  });
}