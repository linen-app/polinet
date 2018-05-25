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
  const result = Object.assign({}, jsonOrder)
  const sOrder = jsonOrder.signedOrder
  result.signedOrder = {
    ...sOrder,
    expirationUnixTimestampSec: new BigNumber(sOrder.expirationUnixTimestampSec),
    makerFee: new BigNumber(sOrder.makerFee),
    makerTokenAmount: new BigNumber(sOrder.makerTokenAmount),
    salt: new BigNumber(sOrder.salt),
    takerFee: new BigNumber(sOrder.takerFee),
    takerTokenAmount: new BigNumber(sOrder.takerTokenAmount)
  }

  result.hash = await ZeroEx.getOrderHashHex(jsonOrder.signedOrder);
  
  return result;
}

export function convertToJson(order) {
  const result = Object.assign({}, order)

  const signedOrder = {
    ...result.signedOrder,
    expirationUnixTimestampSec: result.signedOrder.expirationUnixTimestampSec.toString(),
    makerFee: result.signedOrder.makerFee.toString(),
    makerTokenAmount: result.signedOrder.makerTokenAmount.toString(),
    salt: result.signedOrder.salt.toString(),
    takerFee: result.signedOrder.takerFee.toString(),
    takerTokenAmount: result.signedOrder.takerTokenAmount.toString(),
  }

  delete result.hash;

  result.signedOrder = signedOrder

  return result;
}

export async function validateOrderAsync(order) {
  try {
    await zeroEx.exchange.validateOrderFillableOrThrowAsync(order.signedOrder);
  } catch (e) {
    console.error(e)
    throw e;
  }

  return order;
}