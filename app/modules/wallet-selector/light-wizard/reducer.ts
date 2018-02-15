import { ILightWallet } from "../../../modules/web3/LightWallet";
import { AppReducer } from "../../../store";

export interface ILightWalletWizardState {
  errorMsg?: string;
  isWalletCreated: boolean;
  isActive: boolean;
  isSeedBacked: boolean;
  lightWalletInstance?: ILightWallet;
  salt?: string;
  isSaltSent: boolean;
}

export const lightWalletWizardInitialState: ILightWalletWizardState = {
  isWalletCreated: false,
  isActive: false,
  isSeedBacked: false,
  isSaltSent: false,
};

export const lightWalletWizardReducer: AppReducer<ILightWalletWizardState> = (
  state = lightWalletWizardInitialState,
  action,
): ILightWalletWizardState => {
  switch (action.type) {
    case "LIGHT_WALLET_CREATED":
      return {
        ...state,
        isWalletCreated: true,
        lightWalletInstance: action.payload.lightWalletVault.walletInstance,
        salt: action.payload.lightWalletVault.salt,
      };
  }
  return state;
};
