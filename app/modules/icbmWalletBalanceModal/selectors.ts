import { IIcbmWalletBalanceModal } from "./reducer";

export const selectIcbmWalletEthAddress = (state: IIcbmWalletBalanceModal): string =>
  state.ethAddress || "";
