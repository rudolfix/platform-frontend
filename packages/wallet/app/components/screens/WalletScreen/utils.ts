import { EIconType } from "components/shared/Icon";

import { TBalance, EBalanceViewType } from "modules/wallet-screen/module";

export const createBalanceUiData = (balance: TBalance) => ({
  type: balance.type,
  icon: balanceIcons[balance.type],
  name: balanceNames[balance.type],
  token: balance.amount,
  euroEquivalentToken: balance.euroEquivalentAmount,
});

export const balanceNames: { [key in EBalanceViewType]: string } = {
  [EBalanceViewType.ETH]: `Ether`,
  [EBalanceViewType.NEUR]: `nEUR`,
  [EBalanceViewType.ICBM_ETH]: `Icbm Ether`,
  [EBalanceViewType.ICBM_NEUR]: `Icbm nEUR`,
  [EBalanceViewType.LOCKED_ICBM_ETH]: `Icbm Ether`,
  [EBalanceViewType.LOCKED_ICBM_NEUR]: `Icbm nEUR`,
};

export const balanceIcons: { [key in EBalanceViewType]: EIconType } = {
  [EBalanceViewType.ETH]: EIconType.ETH,
  [EBalanceViewType.NEUR]: EIconType.N_EUR,
  [EBalanceViewType.ICBM_ETH]: EIconType.ICBM,
  [EBalanceViewType.ICBM_NEUR]: EIconType.ICBM,
  [EBalanceViewType.LOCKED_ICBM_ETH]: EIconType.ICBM,
  [EBalanceViewType.LOCKED_ICBM_NEUR]: EIconType.ICBM,
};
