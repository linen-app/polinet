import Dharma from "@dharmaprotocol/dharma.js"
import currentProvider from './web3Service.js'
import BigNumber from 'bignumber.js'

const dharma = new Dharma(currentProvider);

export function parseJsonOrder(json) {
  const jsonOrder = JSON.parse(json)
  const dharmaDebtOrder = {
    ...jsonOrder,
    principalAmount: new BigNumber(jsonOrder.principalAmount || 0),
    debtorFee: new BigNumber(jsonOrder.debtorFee || 0),
    creditorFee: new BigNumber(jsonOrder.creditorFee || 0),
    relayerFee: new BigNumber(jsonOrder.relayerFee || 0),
    underwriterFee: new BigNumber(jsonOrder.underwriterFee || 0),
    underwriterRiskRating: new BigNumber(jsonOrder.underwriterRiskRating || 0),
    salt: new BigNumber(jsonOrder.salt || 0),
    debtorSignature: JSON.parse(jsonOrder.debtorSignature),
    creditorSignature: JSON.parse(jsonOrder.creditorSignature),
    underwriterSignature: JSON.parse(jsonOrder.underwriterSignature),
    expirationTimestampInSec: new BigNumber(jsonOrder.expirationTimestampInSec)
  };

  return Promise.resolve(dharmaDebtOrder);
}

export async function validateOrderAsync(debtOrder) {
  const txOptions = { from: debtOrder.creditor }
  await dharma.order.assertValidAsync(debtOrder, txOptions);
  console.log('Order is valid.');

  return debtOrder;
}