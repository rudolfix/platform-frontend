import { createAction, createSimpleAction } from "../actionsUtils";
import { IWalletStateData } from "./../wallet/reducer";

export const icbmWalletBalanceModalActions = {
  showIcbmWalletBalanceModal: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_SHOW"),
  hideIcbmWalletBalanceModal: () => createSimpleAction("ICBM_WALLET_BALANCE_MODAL_HIDE"),
  getWalletData: (ethAddress: string) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA", { ethAddress }),
  loadIcbmWalletData: (data: IWalletStateData) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA", { data }),
};
