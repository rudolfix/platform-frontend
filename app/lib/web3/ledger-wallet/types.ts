
export interface ILedgerConfig {
    version: string;
    arbitraryDataEnabled: 0 | 1;
  }
  
  export interface IDerivationPathToAddress {
    [derivationPath: string]: string;
  }
  