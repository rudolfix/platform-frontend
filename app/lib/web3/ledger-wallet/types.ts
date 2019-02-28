import Web3 from "web3";

export interface ILedgerConfig {
  version: string;
  arbitraryDataEnabled: 0 | 1;
}

export interface IDerivationPathToAddress {
  [derivationPath: string]: string;
}

export interface IHookedWalletSubProvider {
  approveMessage: (txParams: any) => string;
  approvePersonalMessage: (txParams: any, cb: () => any) => void;
  approveTransaction: (txParams: any, cb: () => any) => void;
  approveTypedMessage: (txParams: any, cb: () => any) => void;
  getAccounts: () => string[];
  signPersonalMessage: (txData: { from: string; data: string }) => string;
  signTransaction: (txData: Web3.TxData) => string;
  engine: any; //Skipped
  nonceLock: any; //Skipped
}
// TODO: Make IHookedWalletSubProvider more rigid
