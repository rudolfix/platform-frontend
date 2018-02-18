export const symbols = {
  // redux
  appDispatch: Symbol(),
  navigateTo: Symbol(),
  getState: Symbol(),

  // configs
  ethereumNetworkConfig: Symbol(),

  // apis
  jsonHttpClient: Symbol(),
  signatureAuthApi: Symbol(),
  vaultApi: Symbol(),
  usersApi: Symbol(),
  apiKycService: Symbol(),

  // wallets
  lightWalletUtil: Symbol(),
  lightWalletConnector: Symbol(),
  ledgerWalletConnector: Symbol(),
  browserWalletConnector: Symbol(),
  web3Manager: Symbol(),

  // utils
  notificationCenter: Symbol(),
  logger: Symbol(),
  storage: Symbol(),
  asyncIntervalSchedulerFactory: Symbol(),

  // external modules
  cryptoRandomString: Symbol(),
};
