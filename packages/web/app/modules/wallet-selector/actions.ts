import { createActionFactory } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";
import { EUserType } from "../../lib/api/users/interfaces";
import { browserWizardActions } from "./browser-wizard/actions";
import { ledgerWizardActions } from "./ledger-wizard/actions";
import { lightWizardActions } from "./light-wizard/actions";
import {  TWalletRegisterData } from "./types";

const actions = {
  reset: createActionFactory("WALLET_SELECTOR_RESET"),
  messageSigning: createActionFactory("WALLET_SELECTOR_MESSAGE_SIGNING"),
  messageSigningError: createActionFactory(
    "WALLET_SELECTOR_MESSAGE_SIGNING_ERROR",
    (errorMessage: TMessage) => ({ errorMessage }),
  ),
  registerRedirect: createActionFactory("REGISTER_REDIRECT",
    (userType: EUserType) => ({userType})),
  registerWithBrowserWallet: createActionFactory("REGISTER_WITH_BROWSER_WALLET",
    (userType: EUserType) => ({userType})),
  registerWithLightWallet: createActionFactory("REGISTER_WITH_LIGHT_WALLET",
    (userType: EUserType) => ({userType})),
  registerWithLedger: createActionFactory("REGISTER_WITH_LEDGER",
    (userType: EUserType) => ({userType})),
  setWalletRegisterData: createActionFactory(
    "SET_WALLET_REGISTER_DATA",
    (data:TWalletRegisterData) => ({data})
  ),
  browserWalletRegisterFormData: createActionFactory(
    "BROWSER_WALLET_REGISTER_FORM_DATA",
    (email:string) => ({email})
  ),
  browserWalletSignMessage: createActionFactory(
    "BROWSER_WALLET_SIGN_MESSAGE"
  ),
  ledgerReconnect: createActionFactory(
    "LEDGER_RECONNECT"
  ),
  lightWalletRegisterFormData: createActionFactory(
    "LIGHT_WALLET_REGISTER_FORM_DATA",
    (email:string,password: string) => ({email,password})
  ),
  ledgerCloseAccountChooser: createActionFactory(
    "LEDGER_CLOSE_ACCOUNT_CHOOSER"
  ),
  restoreLightWallet: createActionFactory("RESTORE_LIGHT_WALLET"),
  submitSeed: createActionFactory(
    "SUBMIT_SEED",
    (seed:string)=>({seed})
  )
};

export const walletSelectorActions = {
  ...browserWizardActions,
  ...ledgerWizardActions,
  ...lightWizardActions,
  ...actions,
};
