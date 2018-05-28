import { mapValues } from "lodash";

export const symbols = makeDebugSymbols({
  // redux
  appDispatch: Symbol(),
  navigateTo: Symbol(),
  getState: Symbol(),

  // configs
  config: Symbol(),
  ethereumNetworkConfig: Symbol(),

  // apis
  jsonHttpClient: Symbol(),
  authorizedHttpClient: Symbol(),
  signatureAuthApi: Symbol(),
  vaultApi: Symbol(),
  usersApi: Symbol(),
  apiKycService: Symbol(),

  // contracts
  contractsService: Symbol(),

  // wallets
  lightWalletUtil: Symbol(),
  lightWalletConnector: Symbol(),
  ledgerWalletConnector: Symbol(),
  browserWalletConnector: Symbol(),
  web3Manager: Symbol(),

  // storages
  walletStorage: Symbol(),

  jwtStorage: Symbol(),

  // utils
  notificationCenter: Symbol(),
  logger: Symbol(),
  storage: Symbol(),
  asyncIntervalSchedulerFactory: Symbol(),
  detectBrowser: Symbol(),

  intlWrapper: Symbol(),

  // external modules
  cryptoRandomString: Symbol(),
});

/**
 * Adds automatically symbols name values which makes debugging easier
 */
export function makeDebugSymbols<T>(symbols: T): T {
  return mapValues(symbols, (_val, key) => Symbol.for(key)) as any;
}
