import { TModuleState } from "@neufund/shared-modules";
import { ECurrency, EquityToken, TToken } from "@neufund/shared-utils";

import { EIconType } from "components/shared/Icon";

import { setupHomeScreenModule } from "modules/home-screen/module";

export type THomeScreenState = TModuleState<typeof setupHomeScreenModule>;

export enum EBalanceViewType {
  ETH = "balanceTypeEth",
  NEUR = "balanceTypeNeur",
}

export type TBalance = {
  type: EBalanceViewType;
  amount: TToken<ECurrency.EUR_TOKEN | ECurrency.ETH>;
  euroEquivalentAmount: TToken<ECurrency.EUR>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TAsset<T extends EquityToken = any, AT extends ECurrency = any> = {
  id: string;
  token: TToken<T>;
  analogToken: TToken<AT>;
  tokenImage: string | EIconType;
  tokenName: string;
};
