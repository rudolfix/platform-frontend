import { StringableActionCreator } from "@neufund/sagas";
import {
  bookbuildingModuleApi,
  etoModuleApi,
  gasApi,
  investorPortfolioModuleApi,
  kycApi,
  txHistoryApi,
  walletApi,
} from "@neufund/shared-modules";
import { TDictionaryValues } from "@neufund/shared-utils";
import { LocationChangeAction } from "connected-react-router";

import { portfolioActions } from "../components/portfolio/actions";
import { accessWalletActions } from "./access-wallet/actions";
import { authActions } from "./auth/actions";
import { bankTransferFLowActions } from "./bank-transfer-flow/actions";
import { contractsActions } from "./contracts/actions";
import { depositModalActions } from "./deposit-eth-modal/actions";
import { etoDocumentsActions } from "./eto-documents/actions";
import { etoFlowActions } from "./eto-flow/actions";
import { etoNomineeActions } from "./eto-nominee/actions";
import { etoViewActions } from "./eto-view/shared/actions";
import { fullPageLoadingActions } from "./full-page-loading/actions";
import { genericModalActions } from "./generic-modal/actions";
import { governanceModuleApi } from "./governance/module";
import { icbmWalletBalanceModalActions } from "./icbm-wallet-balance-modal/actions";
import { immutableStorageActions } from "./immutable-file/actions";
import { initActions } from "./init/actions";
import { instantIdApi } from "./instant-id/module";
import { investmentFlowActions } from "./investment-flow/actions";
import { nomineeFlowActions } from "./nominee-flow/actions";
import { notificationModalActions } from "./notification-modal/actions";
import { notificationActions } from "./notifications/actions";
import { personProfileModalActions } from "./person-profile-modal/actions";
import { profileActions } from "./profile/actions";
import { routingActions } from "./routing/actions";
import { formSingleFileUploadActions } from "./shared/formSingleFileUpload/actions";
import { remoteFileActions } from "./shared/remoteFile/actions";
import { tosModalActions } from "./terms-of-service/actions";
import { txActions } from "./tx/actions";
import { userAgentActions } from "./user-agent/actions";
import { verifyEmailActions } from "./verify-email-widget/actions";
import { videoModalActions } from "./video-modal/actions";
import { walletSelectorActions } from "./wallet-selector/actions";
import { walletViewActions } from "./wallet-view/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  ...txActions,
  instantId: instantIdApi.actions,
  txHistory: txHistoryApi.actions,
  bankTransferFlow: bankTransferFLowActions,
  contracts: contractsActions,
  profile: profileActions,
  immutableStorage: immutableStorageActions,
  verifyEmail: verifyEmailActions,
  genericModal: genericModalActions,
  accessWallet: accessWalletActions,
  init: initActions,
  kyc: kycApi.actions,
  routing: routingActions,
  walletSelector: walletSelectorActions,
  web3: web3Actions,
  investorEtoTicket: investorPortfolioModuleApi.actions,
  userAgent: userAgentActions,
  auth: authActions,
  wallet: walletApi.actions,
  notifications: notificationActions,
  notificationModal: notificationModalActions,
  etoFlow: etoFlowActions,
  etoDocuments: etoDocumentsActions,
  etoNominee: etoNomineeActions,
  etoView: etoViewActions,
  walletView: walletViewActions,
  eto: etoModuleApi.actions,
  bookBuilding: bookbuildingModuleApi.actions,
  formSingleFileUpload: formSingleFileUploadActions,
  remoteFile: remoteFileActions,
  depositEthModal: depositModalActions,
  icbmWalletBalanceModal: icbmWalletBalanceModalActions,
  gas: gasApi.actions,
  investmentFlow: investmentFlowActions,
  videoModal: videoModalActions,
  personProfileModal: personProfileModalActions,
  tosModal: tosModalActions,
  portfolio: portfolioActions,
  nomineeFlow: nomineeFlowActions,
  fullPageLoading: fullPageLoadingActions,
  governance: governanceModuleApi.actions,
};

/**
 * Build action union type
 */
type TActions = typeof actions;

type TAllActions = TActions[keyof TActions];
type TActionCreatorsUnionType = TDictionaryValues<TAllActions>;

export type TAction = ReturnType<TActionCreatorsUnionType> | LocationChangeAction;
export type TActionType = TAction["type"];

type ExtractActionTypeFromCreator<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => { type: infer P }
  ? P
  : never;
export type TActionFromCreator<T extends (...args: any[]) => any> = Extract<
  TAction,
  { type: ExtractActionTypeFromCreator<T> }
>;

type ExtractPayload<T extends TAction> = T extends { payload: infer P } ? P : never;

type TActionPayloadFromType<T extends TActionType> = ExtractPayload<Extract<TAction, { type: T }>>;

export type TPattern = TActionType | StringableActionCreator<TAction>;

export type TActionPayload<T extends TPattern> = T extends StringableActionCreator<TAction>
  ? TActionPayloadFromCreator<T>
  : T extends TActionType
  ? TActionPayloadFromType<T>
  : never;

export type TActionPayloadFromCreator<T extends (...args: any[]) => any> = ExtractPayload<
  Extract<TAction, { type: ExtractActionTypeFromCreator<T> }>
>;
