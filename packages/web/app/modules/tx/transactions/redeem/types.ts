import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export type TNEurRedeemAdditionalDetails = {
  amount: string;
  bankAccount: {
    bankName: string;
    accountNumberLast4: string;
  };
  bankFee: string;
  tokenDecimals: number;
};

export const BankAccountSchema = YupTS.object({
  bankName: YupTS.string(),
  accountNumberLast4: YupTS.string(),
});

export const NeurRedeemAdditionalDataSchema = YupTS.object({
  amount: YupTS.string(),
  bankAccount: BankAccountSchema,
  bankFee: YupTS.string(),
  tokenDecimals: YupTS.number(),
});

export type TNeurRedeemAdditionalData = TypeOfYTS<typeof NeurRedeemAdditionalDataSchema>;
