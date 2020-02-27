import { createActionFactory } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";
import { browserWizardActions } from "./browser-wizard/actions";
import { ledgerWizardActions } from "./ledger-wizard/actions";
import { lightWizardActions } from "./light-wizard/actions";
import { TWalletRegisterData } from "./reducer";

const actions = {
  reset: createActionFactory("WALLET_SELECTOR_RESET"),
  connected: createActionFactory("WALLET_SELECTOR_CONNECTED"),
  messageSigning: createActionFactory("WALLET_SELECTOR_MESSAGE_SIGNING"),
  messageSigningError: createActionFactory(
    "WALLET_SELECTOR_MESSAGE_SIGNING_ERROR",
    (errorMessage: TMessage) => ({ errorMessage }),
  ),
  registerRedirect: createActionFactory("REGISTER_REDIRECT"),
  registerWithBrowserWallet: createActionFactory("REGISTER_WITH_BROWSER_WALLET"),
  setWalletRegisterData: createActionFactory(
    "SET_WALLET_REGISTER_DATA",
    (data:TWalletRegisterData) => ({data})
  )
};

export const walletSelectorActions = {
  ...browserWizardActions,
  ...ledgerWizardActions,
  ...lightWizardActions,
  ...actions,
};
