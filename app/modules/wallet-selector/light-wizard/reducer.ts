import { AppReducer } from "../../../store";

export interface ILightWalletWizardState {
  errorMsg?: string;
}

export const lightWalletWizardInitialState: ILightWalletWizardState = {};

export const lightWalletWizardReducer: AppReducer<ILightWalletWizardState> = (
  state = lightWalletWizardInitialState,
  action,
): ILightWalletWizardState => {
  switch (action.type) {
    case "LIGHT_WALLET_CONNECTION_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
      };
  }
  return state;
};
