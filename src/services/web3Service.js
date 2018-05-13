import Web3 from 'web3';

if (typeof window.web3 !== 'undefined') {
  let defaultAccount = window.web3.eth.accounts[0];
  if (!defaultAccount) {
    alert('Please, log in Metamask, choose Kovan network and reload the page.');
  }
  window.web3 = new Web3(window.web3.currentProvider);
  window.web3.eth.defaultAccount = defaultAccount;
} else {
  alert('Please, install metamask.io extension in your browser.');
}

export default window.web3 && window.web3.currentProvider;

export function getWalletBalanceAsync() {
  return new Promise((resolve, reject) => {
    const account = getDefaultAccount()
    if (!account) {
      resolve(0);
      return;
    }

    window.web3.eth.getBalance(getDefaultAccount(), (err, balance) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(window.web3.fromWei(balance));
      }
    });
  });
}

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

export function getDefaultAccount() {
  return window.web3 && window.web3.eth.accounts[0];
}
