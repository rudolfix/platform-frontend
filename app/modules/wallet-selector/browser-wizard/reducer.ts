import { AppReducer } from "../../../store";

export interface IBrowserWalletWizardState {
  errorMsg?: string;
  isLoading: boolean;
}

export const browserWalletWizardInitialState: IBrowserWalletWizardState = {
  isLoading: true,
};

export const browserWalletWizardReducer: AppReducer<IBrowserWalletWizardState> = (
  state = browserWalletWizardInitialState,
  action,
): IBrowserWalletWizardState => {
  switch (action.type) {
    case "BROWSER_WALLET_CONNECTION_ERROR":
      return {
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
  }

  return state;
};
