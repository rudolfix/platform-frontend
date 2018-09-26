import { createAction, createSimpleAction } from "../actionsUtils";
import { IWalletStateData } from "./reducer";

export const walletActions = {
  startLoadingWalletData: () => createSimpleAction("WALLET_START_LOADING"),
  loadWalletData: (data: IWalletStateData) => createAction("WALLET_LOAD_WALLET_DATA", { data }),
  loadWalletDataError: (errorMsg: string) =>
    createAction("WALLET_LOAD_WALLET_DATA_ERROR", { errorMsg }),
  getWalletData: (ethAddress: string) =>
    createAction("WALLET_GET_DATA_FOR_ADDRESS", { ethAddress }),
  upgradeWalletEtherToken: () => createSimpleAction("GENERATE_ETHER_WALLET_UPGRADE_TX"),
  upgradeWalletEuroToken: () => createSimpleAction("GENERATE_EURO_WALLET_UPGRADE_TX"),
};
