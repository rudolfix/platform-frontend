import * as YupTS from "../../../../lib/yup-ts.unsafe";
import { ETokenType } from "../../types";

export type TUpgradeAdditionalData = {
  tokenType: ETokenType;
};
export const UpgradeAdditionalDataSchema = YupTS.object({
  tokenType: YupTS.string(),
});
export type TUpgradeAdditionalDataYTS = YupTS.TypeOf<typeof UpgradeAdditionalDataSchema>;
