import { AppReducer } from "../../../store";

export interface ILightWalletWizardState {
  errorMsg?: string;
  isLoading: boolean;
}

export const lightWalletWizardInitialState: ILightWalletWizardState = { isLoading: false };

export const lightWalletWizardReducer: AppReducer<ILightWalletWizardState> = (
  state = lightWalletWizardInitialState,
  action,
): ILightWalletWizardState => {
  switch (action.type) {
    case "LIGHT_WALLET_LOGIN":
      return {
        ...state,
        errorMsg: undefined,
        isLoading: true,
      };
    case "LIGHT_WALLET_CONNECTION_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case "WALLET_SELECTOR_CONNECTED":
      return {
        ...state,
        isLoading: false,
        errorMsg: undefined,
      };
  }
  return state;
};
