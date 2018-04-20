import { accessWalletReducer } from "./accessWallet/reducer";
import { authReducer } from "./auth/reducer";
import { etoFlowReducer } from "./eto-flow/reducer";
import { genericModalReducer } from "./genericModal/reducer";
import { initReducer } from "./init/reducer";
import { kycReducer } from "./kyc/reducer";
import { moneyReducer } from "./money/reducer";
import { notificationsReducer } from "./notifications/reducer";
import { browserReducer } from "./userAgent/reducer";
import { browserWalletWizardReducer } from "./wallet-selector/browser-wizard/reducer";
import { ledgerWizardReducer } from "./wallet-selector/ledger-wizard/reducer";
import { lightWalletWizardReducer } from "./wallet-selector/light-wizard/reducer";
import { walletSelectorReducer } from "./wallet-selector/reducer";
import { walletReducer } from "./wallet/reducer";
import { web3Reducer } from "./web3/reducer";

// add new app reducers here. They must be AppReducer<T> type
export const appReducers = {
  ledgerWizardState: ledgerWizardReducer,
  browserWalletWizardState: browserWalletWizardReducer,
  web3: web3Reducer,
  browser: browserReducer,
  walletSelector: walletSelectorReducer,
  auth: authReducer,
  genericModal: genericModalReducer,
  accessWallet: accessWalletReducer,
  kyc: kycReducer,
  init: initReducer,
  lightWalletWizard: lightWalletWizardReducer,
  money: moneyReducer,
  wallet: walletReducer,
  notifications: notificationsReducer,
  etoFlow: etoFlowReducer,
};
