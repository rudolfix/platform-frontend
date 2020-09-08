import { ITokenDisbursal } from "@neufund/shared-modules";
import { createActionFactory } from "@neufund/shared-utils";

import { createAction, createSimpleAction } from "../../actionsUtils";
import { TVotingResolution } from "../../shareholder-resolutions-voting-setup/module";
import { ETokenType } from "../types";

export const txTransactionsActions = {
  /* Transaction Flows */
  startWithdrawEth: () => createSimpleAction("TRANSACTIONS_START_WITHDRAW_ETH"),
  startUpgrade: (tokenType: ETokenType) => createAction("TRANSACTIONS_START_UPGRADE", tokenType),
  upgradeSuccessful: createActionFactory(
    "TRANSACTIONS_UPGRADE_SUCCESSFUL",
    (tokenType: ETokenType) => ({ tokenType }),
  ),
  startInvestment: createActionFactory("TRANSACTIONS_START_INVESTMENT", (etoId: string) => ({
    etoId,
  })),
  startEtoSetDate: () => createSimpleAction("TRANSACTIONS_START_ETO_SET_DATE"),
  startUserClaim: (etoId: string) => createAction("TRANSACTIONS_START_CLAIM", etoId),
  startInvestorPayoutAccept: createActionFactory(
    "TRANSACTIONS_START_PAYOUT_ACCEPT",
    (tokensDisbursals: ReadonlyArray<ITokenDisbursal>) => ({
      tokensDisbursals,
    }),
  ),
  startInvestorPayoutRedistribute: createActionFactory(
    "TRANSACTIONS_START_PAYOUT_REDISTRIBUTE",
    (tokenDisbursals: ITokenDisbursal) => ({
      tokenDisbursals,
    }),
  ),
  startWithdrawNEuro: createActionFactory("TRANSACTIONS_START_WITHDRAW_NEUR"),
  startUnlockEtherFunds: createActionFactory("TRANSACTIONS_START_UNLOCK_ETHER_FUNDS"),
  startUnlockEuroFunds: createActionFactory("TRANSACTIONS_START_UNLOCK_EURO_FUNDS"),
  startInvestorRefund: createActionFactory(
    "TRANSACTION_START_INVESTOR_REFUND",
    (etoId: string) => ({ etoId }),
  ),
  startNomineeTHASign: createActionFactory("TRANSACTION_START_NOMINEE_THA_SIGN"),
  startNomineeRAAASign: createActionFactory("TRANSACTION_START_NOMINEE_RAAA_SIGN"),
  startNomineeISHASign: createActionFactory("TRANSACTION_START_NOMINEE_ISHA_SIGN"),
  // TOKEN TRANSFER
  startTokenTransfer: createActionFactory(
    "TRANSACTION_START_TOKEN_TRANSFER",
    (tokenAddress: string, tokenImage: string) => ({
      tokenAddress,
      tokenImage,
    }),
  ),
  startShareholderResolutionVote: createActionFactory(
    "TRANSACTION_START_SHAREHOLDER_RESOLUTION_VOTE",
    (proposalId: string, voteInFavor: boolean) => ({
      proposalId,
      voteInFavor,
    }),
  ),
  startPublishResolutionUpdate: createActionFactory(
    "TRANSACTION_START_PUBLISH_RESOLUTION_UPDATE",
    (title: string) => ({ title }),
  ),
  startShareholderVotingResolutionSetup: createActionFactory(
    "TRANSACTION_START_SHAREHOLDER_VOTING_RESOLUTION_SETUP",
    (votingResolution: TVotingResolution) => ({ votingResolution }),
  ),
  // Add here new custom sagas that represent flows
};
