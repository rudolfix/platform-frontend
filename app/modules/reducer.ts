import { accessWalletReducer } from "./accessWallet/reducer";
import { authReducer } from "./auth/reducer";
import { dashboardReducer } from "./dashboard/reducer";
import { depositEthModalReducer } from "./depositEthModal/reducer";
import { etoDocumentReducer } from "./eto-documents/reducer";
import { etoFlowReducer } from "./eto-flow/reducer";
import { etoReducer } from "./eto/reducer";
import { gasReducer } from "./gas/reducer";
import { genericModalReducer } from "./genericModal/reducer";
import { icbmWalletBalanceModalReducer } from "./icbmWalletBalanceModal/reducer";
import { initReducer } from "./init/reducer";
import { kycReducer } from "./kyc/reducer";
import { moneyReducer } from "./money/reducer";
import { notificationsReducer } from "./notifications/reducer";
import { settingsReducer } from "./settings/reducer";
import { tokenPriceReducer } from "./shared/tokenPrice/reducer";
import { txMonitorReducer } from "./tx/monitor/reducer";
import { txSenderReducer } from "./tx/sender/reducer";
import { browserReducer } from "./userAgent/reducer";
import { verifyEmailWidgetReducer } from "./verifyEmailWidget/reducer";
import { browserWalletWizardReducer } from "./wallet-selector/browser-wizard/reducer";
import { ledgerWizardReducer } from "./wallet-selector/ledger-wizard/reducer";
import { lightWalletWizardReducer } from "./wallet-selector/light-wizard/reducer";
import { walletSelectorReducer } from "./wallet-selector/reducer";
import { walletReducer } from "./wallet/reducer";
import { web3Reducer } from "./web3/reducer";

// add new app reducers here. They must be AppReducer<T> type
export const appReducers = {
  ledgerWizardState: ledgerWizardReducer,
  verifyEmailWidgetState: verifyEmailWidgetReducer,
  browserWalletWizardState: browserWalletWizardReducer,
  web3: web3Reducer,
  browser: browserReducer,
  walletSelector: walletSelectorReducer,
  auth: authReducer,
  genericModal: genericModalReducer,
  accessWallet: accessWalletReducer,
  kyc: kycReducer,
  settings: settingsReducer,
  tokenPrice: tokenPriceReducer,
  init: initReducer,
  lightWalletWizard: lightWalletWizardReducer,
  money: moneyReducer,
  wallet: walletReducer,
  notifications: notificationsReducer,
  etoFlow: etoFlowReducer,
  etoDocuments: etoDocumentReducer,
  eto: etoReducer,
  depositEthModal: depositEthModalReducer,
  txSender: txSenderReducer,
  icbmWalletBalanceModal: icbmWalletBalanceModalReducer,
  gas: gasReducer,
  txMonitor: txMonitorReducer,
  dashboard: dashboardReducer,
};
