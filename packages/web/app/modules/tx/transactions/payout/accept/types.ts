import { ITokenDisbursal } from "@neufund/shared-modules";

export type TAcceptPayoutAdditionalData = {
  tokensDisbursals: ReadonlyArray<ITokenDisbursal>;
};
