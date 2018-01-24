import { createStore, Store } from "redux";
import { IConfig } from "../app/getConfig";

export const dummyConfig: IConfig = {
  ethereumNetwork: {
    rpcUrl: "https://localhost:8080",
  },
};

export function createDummyStore(): Store<any> {
  return createStore(() => {});
}
