import {
  coreModuleApi,
  createLibSymbol,
  IEthManager,
  ISingleKeyStorage,
} from "@neufund/shared-modules";

export const symbols = {
  // configs
  config: Symbol("config"),
  ethereumNetworkConfig: Symbol("ethereumNetworkConfig"),
  backendRootConfig: Symbol("backendRootConfig"),

  // apis
  apiImmutableStorage: Symbol("apiImmutableStorage"),
  vaultApi: Symbol("vaultApi"),
  analyticsApi: Symbol("analyticsApi"),
  usersApi: Symbol("usersApi"),
  apiKycService: Symbol("apiKycService"),
  apiEtoService: Symbol("apiEtoService"),
  apiEtoPledgeService: Symbol("apiEtoPledgeService"),
  apiEtoProductService: Symbol("apiEtoProductService"),
  apiEtoFileService: Symbol("apiEtoFileService"),
  apiEtoNomineeService: Symbol("apiEtoNomineeService"),
  fileStorageService: Symbol("fileStorageService"),
  gasApi: Symbol("gasApi"),

  // contracts
  contractsService: Symbol("contractsService"),

  // wallets
  lightWalletUtil: Symbol("lightWalletUtil"),
  lightWalletConnector: Symbol("lightWalletConnector"),
  ledgerWalletConnector: Symbol("ledgerWalletConnector"),
  browserWalletConnector: Symbol("browserWalletConnector"),
  walletConnectConnector: Symbol("walletConnectConnector"),
  web3Manager: createLibSymbol<IEthManager>("web3Manager"),
  web3Factory: Symbol("web3Factory"),
  web3BatchFactory: Symbol("web3BatchFactory"),

  // storages
  walletStorage: Symbol("walletStorage"),
  walletConnectStorage: Symbol("walletConnectStorage"),
  documentsConfidentialityAgreementsStorage: Symbol("documentsConfidentialityAgreementsStorage"),
  userStorage: Symbol("userStorage"),
  jwtStorage: createLibSymbol<ISingleKeyStorage<string>>("jwtStorage"),

  // utils
  notificationCenter: Symbol("notificationCenter"),
  logger: coreModuleApi.symbols.logger,
  storage: Symbol("storage"),
  asyncIntervalSchedulerFactory: Symbol("asyncIntervalSchedulerFactory"),
  detectBrowser: Symbol("detectBrowser"),
  userActivityChannel: Symbol("userActivityChannel"),

  intlWrapper: Symbol("intlWrapper"),

  // others
  richTextEditorUploadAdapter: Symbol("richTextEditorUploadAdapter"),
  onfidoSdk: Symbol("onfidoSdk"),
};
