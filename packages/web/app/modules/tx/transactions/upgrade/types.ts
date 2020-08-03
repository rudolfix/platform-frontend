import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

import { ETokenType } from "../../types";

export type TUpgradeAdditionalData = {
  tokenType: ETokenType;
};
export const UpgradeAdditionalDataSchema = YupTS.object({
  tokenType: YupTS.string(),
});
export type TUpgradeAdditionalDataYTS = TypeOfYTS<typeof UpgradeAdditionalDataSchema>;
