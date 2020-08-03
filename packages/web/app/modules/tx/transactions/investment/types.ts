import { EtoEquityTokenInfoType, TypeOfYTS, YupTS } from "@neufund/shared-modules";

const InvestmentAdditionalDataEtoSchema = YupTS.object({
  etoId: YupTS.string(),
  companyName: YupTS.string(),
  equityTokensPerShare: YupTS.number(),
  sharePrice: YupTS.number(),
  equityTokenInfo: EtoEquityTokenInfoType,
});

export const InvestmentAdditionalDataSchema = YupTS.object({
  eto: InvestmentAdditionalDataEtoSchema,
  equityTokens: YupTS.string(),
  estimatedReward: YupTS.string(),
  etherPriceEur: YupTS.string(),
  gasCostEth: YupTS.string(),
  investmentEth: YupTS.string(),
  investmentEur: YupTS.string(),
  isIcbm: YupTS.boolean(),
  investmentType: YupTS.string(),
  tokenDecimals: YupTS.number(),
});
export const InvestorSignAgreementSchema = YupTS.object({});

export type TInvestmentAdditionalData = TypeOfYTS<typeof InvestmentAdditionalDataSchema>;
export type TInvestmentAdditionalDataYTS = typeof InvestmentAdditionalDataSchema;
