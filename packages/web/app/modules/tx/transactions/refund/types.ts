import * as YupTS from "../../../../lib/yup-ts.unsafe";
export type TRefundAdditionalData = {
  etoId: string;
  tokenName: string;
  tokenSymbol: string;
  amountEth: string;
  amountEurUlps: string;
  costUlps: string;
  costEurUlps: string;
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
  costEurUlps: YupTS.string(),
  companyName: YupTS.string(),
  tokenDecimals: YupTS.number(),
});

export type InvestorRefundAdditionalData = YupTS.TypeOf<typeof InvestorRefundAdditionalSchema>;
