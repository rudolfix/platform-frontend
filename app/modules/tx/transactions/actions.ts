import { createAction, createActionFactory, createSimpleAction } from "../../actionsUtils";
import { ITokenDisbursal } from "../../investor-portfolio/types";
import { ETokenType } from "../interfaces";

export const txTransactionsActions = {
  /* Transaction Flows */
  startWithdrawEth: () => createSimpleAction("TRANSACTIONS_START_WITHDRAW_ETH"),
  startUpgrade: (tokenType: ETokenType) => createAction("TRANSACTIONS_START_UPGRADE", tokenType),
  startInvestment: () => createSimpleAction("TRANSACTIONS_START_INVESTMENT"),
  startEtoSetDate: () => createSimpleAction("TRANSACTIONS_START_ETO_SET_DATE"),
  startUserClaim: (etoId: string) => createAction("TRANSACTIONS_START_CLAIM", etoId),
  startInvestorPayout: createActionFactory(
    "TRANSACTIONS_START_PAYOUT",
    (tokensDisbursals: ReadonlyArray<ITokenDisbursal>) => ({
      tokensDisbursals,
    }),
  ),
  // Add here new custom sagas that represent flows
};
