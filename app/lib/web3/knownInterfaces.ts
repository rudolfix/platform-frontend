import { BigNumber } from "bignumber.js";

const sha3Web3 = require("web3/lib/utils/sha3");

function sha3(s: string): BigNumber {
  return new BigNumber(`0x${sha3Web3(s)}`.slice(0, 10));
}

export const knownInterfaces = {
  accessPolicy: sha3("IAccessPolicy"),
  forkArbiter: sha3("IEthereumForkArbiter"),
  neumark: sha3("Neumark"),
  etherToken: sha3("EtherToken"),
  euroToken: sha3("EuroToken"),
  identityRegistry: sha3("IIdentityRegistry"),
  tokenExchangeRateOracle: sha3("ITokenExchangeRateOracle"),
  feeDisbursal: sha3("IFeeDisbursal"),
  tokenExchange: sha3("ITokenExchange"),
  gasExchange: sha3("IGasTokenExchange"),
  euroLock: sha3("LockedAccount:Euro"),
  etherLock: sha3("LockedAccount:Ether"),
  icbmEuroLock: sha3("ICBMLockedAccount:Euro"),
  icbmEtherLock: sha3("ICBMLockedAccount:Ether"),
  icbmEtherToken: sha3("ICBMEtherToken"),
  icbmEuroToken: sha3("ICBMEuroToken"),
  icbmCommitment: sha3("ICBMCommitment"),
  commitmentInterface: sha3("ICommitment"),
};
