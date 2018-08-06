import { createAction } from "../actionsUtils";

export const icbmWalletBalanceModalActions = {
  showIcbmWalletBalanceModal: (address: string) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_SHOW", { address }),
  hideIcbmWalletBalanceModal: (address: string) =>
    createAction("ICBM_WALLET_BALANCE_MODAL_HIDE", { address }),
};
