import { ECurrency } from "@neufund/shared-utils";

import * as YupTS from "../../../../lib/yup-ts.unsafe";

export type TUnlockAdditionalData = {
  neumarksDue: string;
  currencyType: ECurrency.EUR_TOKEN | ECurrency.ETH;
  lockedWalletUnlockDate: string;
  lockedWalletBalance: string;
};

export const UnlockAdditionalDataSchema = YupTS.object({
  neumarksDue: YupTS.string(),
  currencyType: YupTS.string().enhance(v => v.oneOf([ECurrency.ETH, ECurrency.EUR_TOKEN])),
  lockedWalletUnlockDate: YupTS.string(),
  lockedWalletBalance: YupTS.string(),
});

export type TUnlockAdditionalDataYTS = YupTS.TypeOf<typeof UnlockAdditionalDataSchema>;
