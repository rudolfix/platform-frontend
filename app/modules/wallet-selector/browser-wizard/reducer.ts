import { AppReducer } from "../../../store";

export interface IBrowserWalletWizardState {
  errorMsg?: string;
}

export const browserWalletWizardInitialState: IBrowserWalletWizardState = {};

export const browserWalletWizardReducer: AppReducer<IBrowserWalletWizardState> = (
  state = browserWalletWizardInitialState,
  action,
): IBrowserWalletWizardState => {
  switch (action.type) {
    case "BROWSER_WALLET_CONNECTION_ERROR":
      return {
        errorMsg: action.payload.errorMsg,
      };
  }

  return state;
};
