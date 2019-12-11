import { EInvestmentType } from "../../user-flow/investment/types";

export const isEthInvestment = (investmentType: EInvestmentType | undefined) => {
  switch (investmentType) {
    case EInvestmentType.Eth:
    case EInvestmentType.ICBMEth:
      return true;
    case EInvestmentType.NEur:
    case EInvestmentType.ICBMnEuro:
      return false;
    default:
      throw Error("Incorrect investment type");
  }
};
