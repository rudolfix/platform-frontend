import { coreModuleApi, createLibSymbol, ISingleKeyStorage } from "@neufund/shared-modules";

import { DocumentsConfidentialityAgreementsStorage } from "../lib/persistence/DocumentsConfidentialityAgreementsStorage";
import { ContractsService } from "../lib/web3/ContractsService";
import { Web3Manager } from "../lib/web3/Web3Manager/Web3Manager";

export const symbols = {
  // configs
  config: Symbol("config"),
  ethereumNetworkConfig: Symbol("ethereumNetworkConfig"),
  backendRootConfig: Symbol("backendRootConfig"),

  // apis
  apiImmutableStorage: Symbol("apiImmutableStorage"),
  vaultApi: Symbol("vaultApi"),
  usersTxApi: Symbol("usersTxApi"),
  apiKycService: Symbol("apiKycService"),
  apiEtoService: Symbol("apiEtoService"),
  apiEtoPledgeService: Symbol("apiEtoPledgeService"),
  apiEtoProductService: Symbol("apiEtoProductService"),
  apiEtoFileService: Symbol("apiEtoFileService"),
  apiEtoNomineeService: Symbol("apiEtoNomineeService"),
  fileStorageService: Symbol("fileStorageService"),

  // contracts
  contractsService: createLibSymbol<ContractsService>("contractsService"),

  // wallets
  lightWalletUtil: Symbol("lightWalletUtil"),
  lightWalletConnector: Symbol("lightWalletConnector"),
  ledgerWalletConnector: Symbol("ledgerWalletConnector"),
  browserWalletConnector: Symbol("browserWalletConnector"),
  walletConnectConnector: Symbol("walletConnectConnector"),
  web3Manager: createLibSymbol<Web3Manager>("web3Manager"),
  web3Factory: Symbol("web3Factory"),
  web3BatchFactory: Symbol("web3BatchFactory"),

  // storages
  walletStorage: Symbol("walletStorage"),
  walletConnectStorage: Symbol("walletConnectStorage"),
  documentsConfidentialityAgreementsStorage: createLibSymbol<
    DocumentsConfidentialityAgreementsStorage
  >("documentsConfidentialityAgreementsStorage"),
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
};
