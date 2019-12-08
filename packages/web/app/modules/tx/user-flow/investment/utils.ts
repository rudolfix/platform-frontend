import { EInvestmentType } from "../../../investment-flow/reducer";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";

export const isIcbmInvestment = (investmentType: EInvestmentType) =>
  investmentType === EInvestmentType.ICBMEth || investmentType === EInvestmentType.ICBMnEuro;

export const hasFunds = (input: string) => {
  return compareBigNumbers(input, "0") > 0
};
