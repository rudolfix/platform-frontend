import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import * as semver from "semver";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";
import { delay } from "redux-saga";

import {
  LedgerLockedError,
  LedgerNotAvailableError,
  LedgerNotSupportedVersionError,
  LedgerContractsDisabledError,
} from "./errors";
import { ILedgerConfig } from "./types";

export const testConnection = async (ledgerInstance: any): Promise<boolean> => {
  try {
    // this check will successfully detect if ledger is locked or disconnected
    await getLedgerConfig(ledgerInstance);
    return true;
  } catch {
    return false;
  }
};

export const getAccounts = (ledgerInstance: any): Promise<any> => {
  return new Promise<void>((resolve, reject) => {
    ledgerInstance.getAccounts((err: Error | undefined, _accounts: string[]) => {
      if (!err) {
        resolve();
      } else {
        reject(new LedgerLockedError());
      }
    });
  });
};
export const testIfUnlocked = async (ledgerInstance: any): Promise<void> => {
  await getAccounts(ledgerInstance);
};

const getLedgerConfig = async (ledgerInstance: any): Promise<ILedgerConfig> => {
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

interface ILedgerOutput {
  ledgerInstance: any;
  ledgerWeb3: any;
}

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

  return {
    ledgerInstance: { ...ledgerProvider, getTransport },
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

// right after callback needs to be used instead of awaiting for this function because promise resolving is const
export const noSimultaneousConnectionsGuard = async <T>(
  ledgerInstance: any,
  callRightAfter: () => T,
): Promise<T> => {
  while (ledgerInstance.connectionOpened) {
    await delay(0);
  }
  return callRightAfter();
};
