import { IIcbmWalletBalanceModal } from "./reducer";

export const selectIcbmWalletEthAddress = (state: IIcbmWalletBalanceModal): string | undefined =>
  state.ethAddress || undefined;
