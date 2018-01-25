import { createStore, Store } from "redux";
import { IConfig } from "../app/getConfig";
import { EthereumNetworkId } from "../app/types";
import { ILogger } from "../app/utils/Logger";

export const dummyConfig: IConfig = {
  ethereumNetwork: {
    rpcUrl: "https://localhost:8080",
  },
};

export const dummyNetworkId: EthereumNetworkId = "5" as EthereumNetworkId;

export function createDummyStore(): Store<any> {
  return createStore(() => {});
}

export const dummyLogger: ILogger = {
  info: () => {},
  verbose: () => {},
  debug: () => {},
  warn: () => {},
  error: () => {},
};
