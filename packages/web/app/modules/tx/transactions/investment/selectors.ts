import { EInvestmentWallet } from "../../user-flow/investment/types";

export const isEthInvestment = (investmentWallet: EInvestmentWallet | undefined) => {
  switch (investmentWallet) {
    case EInvestmentWallet.Eth:
    case EInvestmentWallet.ICBMEth:
      return true;
    case EInvestmentWallet.NEur:
    case EInvestmentWallet.ICBMnEuro:
      return false;
    default:
      throw Error("Incorrect investment type");
  }
};
