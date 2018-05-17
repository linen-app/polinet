import Dharma from '@dharmaprotocol/dharma.js'
import { getCurrentProvider } from './web3Service.js'
import BigNumber from 'bignumber.js'

const dharma = new Dharma(getCurrentProvider());

export async function parseJsonOrder(jsonOrder) {
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

  dharmaDebtOrder.hash = await dharma.order.getIssuanceHash(dharmaDebtOrder);

  return dharmaDebtOrder;
}

export function convertToJson(order) {
  const result = {
    ...order,
    principalAmount: order.principalAmount.toNumber(),
    debtorFee: order.debtorFee.toNumber(),
    creditorFee: order.creditorFee.toNumber(),
    relayerFee: order.relayerFee.toNumber(),
    underwriterFee: order.underwriterFee.toNumber(),
    underwriterRiskRating: order.underwriterRiskRating.toNumber(),
    salt: order.salt.toNumber(),
    expirationTimestampInSec: order.expirationTimestampInSec.toNumber(),
    debtorSignature: JSON.stringify(order.debtorSignature),
    creditorSignature: JSON.stringify(order.creditorSignature),
    underwriterSignature: JSON.stringify(order.underwriterSignature)
  }

  delete result.hash;

  return result;
}

export async function validateOrderAsync(debtOrder) {
  const txOptions = { from: debtOrder.creditor }
  await dharma.order.assertValidAsync(debtOrder, txOptions);

  return debtOrder;
}