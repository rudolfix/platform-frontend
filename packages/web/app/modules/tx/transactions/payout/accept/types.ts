import { ITokenDisbursal } from "@neufund/shared-modules";

export type TAcceptPayoutAdditionalData = {
  tokensDisbursals: ReadonlyArray<ITokenDisbursal>;
  gasCostEth: string;
  gasCostEuro: string;
  totalPayoutEuro: string;
  payoutLowerThanMinimum: boolean;
};
