import { createAction, createSimpleAction } from "../actionsUtils";
import { browserWizardActions } from "./browser-wizard/actions";
import { ledgerWizardActions } from "./ledger-wizard/actions";
import { lightWizardActions } from "./light-wizard/actions";
import { TUserType } from "../../lib/api/users/interfaces";

const actions = {
  reset: () => createSimpleAction("WALLET_SELECTOR_RESET"),
  connected: (userType: TUserType) => createAction("WALLET_SELECTOR_CONNECTED", { userType }),
  messageSigning: () => createSimpleAction("WALLET_SELECTOR_MESSAGE_SIGNING"),
  messageSigningError: (errorMessage: string) =>
    createAction("WALLET_SELECTOR_MESSAGE_SIGNING_ERROR", { errorMessage }),
};

export const walletSelectorActions = {
  ...browserWizardActions,
  ...ledgerWizardActions,
  ...lightWizardActions,
  ...actions,
};
