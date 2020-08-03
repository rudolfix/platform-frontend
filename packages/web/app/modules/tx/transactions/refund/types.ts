import { TypeOfYTS, YupTS } from "@neufund/shared-modules";
export type TRefundAdditionalData = {
  etoId: string;
  tokenName: string;
  tokenSymbol: string;
  amountEth: string;
  amountEurUlps: string;
  costUlps: string;
  costEur: string;
  companyName: string;
  tokenDecimals: number;
};

export const InvestorRefundAdditionalSchema = YupTS.object({
  etoId: YupTS.string(),
  tokenName: YupTS.string(),
  tokenSymbol: YupTS.string(),
  amountEth: YupTS.string(),
  amountEurUlps: YupTS.string(),
  costUlps: YupTS.string(),
  costEur: YupTS.string(),
  companyName: YupTS.string(),
  tokenDecimals: YupTS.number(),
});

export type InvestorRefundAdditionalData = TypeOfYTS<typeof InvestorRefundAdditionalSchema>;
