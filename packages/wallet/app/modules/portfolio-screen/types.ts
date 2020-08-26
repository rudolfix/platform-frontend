import { TModuleState } from "@neufund/shared-modules";
import { ECurrency, EquityToken, TToken } from "@neufund/shared-utils";

import { EIconType } from "components/shared/Icon";

import { setupPortfolioScreenModule } from "./module";

export type TPortfolioScreenModuleState = TModuleState<typeof setupPortfolioScreenModule>;

export type TAsset<T extends EquityToken = EquityToken, AT extends ECurrency = ECurrency> = {
  id: string;
  token: TToken<T>;
  analogToken: TToken<AT>;
  tokenImage: string | EIconType;
  tokenName: string;
};
