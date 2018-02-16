import { browserWizzardActions } from "./browser-wizard/actions";
import { ledgerWizzardActions } from "./ledger-wizard/actions";
import { lightWizzardActions } from "./light-wizard/actions";

export const walletActions = {
  ...browserWizzardActions,
  ...ledgerWizzardActions,
  ...lightWizzardActions,
};
