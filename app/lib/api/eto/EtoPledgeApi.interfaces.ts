import * as Yup from "yup";

export interface IPledge {
  amountEur: number;
  currency: "eur_t";
  consentToRevealEmail: boolean;
}

export interface IBookBuildingStats {
  investorsCount: number;
  pledgedAmount: number;
}

export const generateCampaigningValidation = (minPledge: number, maxPledge?: number) => {
  const amount = Yup.number()
    .min(minPledge)
    .integer()
    .required();

  return Yup.object({
    amount: maxPledge ? amount.max(maxPledge) : amount,
  });
};
