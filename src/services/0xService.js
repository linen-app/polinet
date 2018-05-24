import { ZeroEx } from '0x.js';
import * as Web3 from 'web3';
import * as Web3ProviderEngine from 'web3-provider-engine';
import { InjectedWeb3Subprovider } from '@0xproject/subproviders';
import * as RPCSubprovider from 'web3-provider-engine/subproviders/rpc';
import { BigNumber } from '@0xproject/utils'

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new RPCSubprovider({ rpcUrl: 'https://kovan.infura.io/gIWjuD8y664Biko4Quf8' }));
//providerEngine.addProvider(new InjectedWeb3Subprovider(window.web3.currentProvider));
providerEngine.start();

const web3 = new Web3(providerEngine);

// Initialize 0x.js with the web3 current provider and provide it the network
const zeroEx = new ZeroEx(web3.currentProvider, { networkId: 42 });

export async function parseJsonOrder(jsonOrder) {
  const sOrder = jsonOrder.signedOrder
  jsonOrder.signedOrder = {
    ...sOrder,
    expirationUnixTimestampSec: new BigNumber(sOrder.expirationUnixTimestampSec),
    makerFee: new BigNumber(sOrder.makerFee),
    makerTokenAmount: new BigNumber(sOrder.makerTokenAmount),
    salt: new BigNumber(sOrder.salt),
    takerFee: new BigNumber(sOrder.takerFee),
    takerTokenAmount: new BigNumber(sOrder.takerTokenAmount)
  }

  jsonOrder.hash = await ZeroEx.getOrderHashHex(jsonOrder.signedOrder);

  return jsonOrder;
}

export function convertToJson(order) {
  const signedOrder = {
    ...order.signedOrder,
    expirationUnixTimestampSec: order.signedOrder.expirationUnixTimestampSec.toString(),
    makerFee: order.signedOrder.makerFee.toString(),
    makerTokenAmount: order.signedOrder.makerTokenAmount.toString(),
    salt: order.signedOrder.salt.toString(),
    takerFee: order.signedOrder.takerFee.toString(),
    takerTokenAmount: order.signedOrder.takerTokenAmount.toString(),
  }

  delete signedOrder.hash;

  order.signedOrder = signedOrder

  return order;
}

export async function validateOrderAsync(order) {
  try {
    console.log(order)
    await zeroEx.exchange.validateOrderFillableOrThrowAsync(order.signedOrder);
    
  } catch (e) {
    console.error(e)
    throw e;
  }

  return order;
}