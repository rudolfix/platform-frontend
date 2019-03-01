import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import * as semver from "semver";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import {
  LedgerNotAvailableError,
  LedgerNotSupportedVersionError,
  LedgerContractsDisabledError,
} from "./errors";
import {
  ILedgerConfig,
  IPromisifiedHookedWalletSubProvider,
  ILedgerOutput,
  ILedgerCustomProvider,
} from "./types";
import { promisify } from "../../../utils/promisify";

export const testConnection = async (ledgerInstance: ILedgerCustomProvider): Promise<boolean> => {
  try {
    // this check will successfully detect if ledger is locked or disconnected
    await getLedgerConfig(ledgerInstance);
    return true;
  } catch {
    return false;
  }
};

export const testIfUnlocked = async (ledgerInstance: ILedgerCustomProvider): Promise<void> => {
  await ledgerInstance;
};

const getLedgerConfig = async (ledgerInstance: ILedgerCustomProvider): Promise<ILedgerConfig> => {
  try {
    const Transport = await ledgerInstance.getTransport();
    const ethInstance = new Eth(Transport);
    const configration = await ethInstance.getAppConfiguration();
    Transport.close();
    return configration;
  } catch (e) {
    throw new LedgerNotAvailableError();
  }
};

export const createWeb3WithLedgerProvider = async (
  networkId: string,
  rpcUrl: string,
): Promise<ILedgerOutput> => {
  const engine = new Web3ProviderEngine();
  const getTransport = () => TransportU2F.create();

  const ledgerProvider = createLedgerSubprovider(getTransport, {
    networkId,
  });
  engine.addProvider(ledgerProvider);
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl,
    }),
  );
  engine.start();
  const promisifiedLedgerProvider: IPromisifiedHookedWalletSubProvider = {
    approveMessage: promisify<string>(ledgerProvider.approveMessage),
    approvePersonalMessage: promisify<boolean>(ledgerProvider.approvePersonalMessage),
    approveTransaction: promisify<boolean>(ledgerProvider.approveTransaction),
    approveTypedMessage: promisify<boolean>(ledgerProvider.approveTypedMessage),
    getAccounts: promisify<string[]>(ledgerProvider.getAccounts),
    signPersonalMessage: promisify<string>(ledgerProvider.signPersonalMessage),
    signTransaction: promisify<string>(ledgerProvider.signTransaction),
  };

  return {
    ledgerInstance: { ...promisifiedLedgerProvider, getTransport },
    ledgerWeb3: new Web3(engine),
  };
};

export const connectToLedger = async (
  networkId: string,
  rpcUrl: string,
): Promise<ILedgerOutput> => {
  let providerEngine: any;
  try {
    const { ledgerInstance, ledgerWeb3 } = await createWeb3WithLedgerProvider(networkId, rpcUrl);
    providerEngine = ledgerWeb3.currentProvider;
    const ledgerConfig = await getLedgerConfig(ledgerInstance);
    if (semver.lt(ledgerConfig.version, "1.0.8")) {
      throw new LedgerNotSupportedVersionError(ledgerConfig.version);
    }
    if (ledgerConfig.arbitraryDataEnabled === 0) {
      throw new LedgerContractsDisabledError();
    }
    await testIfUnlocked(ledgerInstance);

    return { ledgerInstance, ledgerWeb3 };
  } catch (e) {
    // we need to explicitly stop Web3 Provider engine
    if (providerEngine) {
      providerEngine.stop();
    }
    throw e;
  }
};
