import { YupTS } from "@neufund/shared-modules";

export type TClaimAdditionalData = {
  etoId: string;
  tokenName: string;
  tokenQuantity: number;
  neuRewardUlps: string;
  costUlps: string;
  tokenDecimals: number;
  tokenSymbol: string;
};

export const UserClaimAdditionalDataSchema = YupTS.object({
  etoId: YupTS.string(),
  tokenName: YupTS.string(),
  tokenQuantity: YupTS.number(),
  neuRewardUlps: YupTS.string(),
  costUlps: YupTS.string(),
  tokenDecimals: YupTS.number(),
  tokenSymbol: YupTS.string(),
});

export type TUserClaimAdditionalData = typeof UserClaimAdditionalDataSchema;
