import { DeepReadonly } from "@neufund/shared-utils";

import { TMessage } from "../../../components/translatedMessages/utils";
import { AppReducer } from "../../../store";
import { actions } from "../../actions";

export enum ERecoveryPhase {
  SEED_ENTRY_COMPONENT,
  FORM_ENTRY_COMPONENT,
}

export interface ILightWalletWizardState {
  errorMsg?: DeepReadonly<TMessage>;
  isLoading: boolean;
  recoveryPhase: ERecoveryPhase;
}

export const lightWalletWizardInitialState: ILightWalletWizardState = {
  isLoading: false,
  recoveryPhase: ERecoveryPhase.FORM_ENTRY_COMPONENT,
};

export const lightWalletWizardReducer: AppReducer<ILightWalletWizardState> = (
  state = lightWalletWizardInitialState,
  action,
): ILightWalletWizardState => {
  switch (action.type) {
    case actions.walletSelector.lightWalletLogin.getType():
      return {
        ...state,
        errorMsg: undefined,
        isLoading: true,
      };
    case actions.walletSelector.lightWalletConnectionError.getType():
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case actions.walletSelector.messageSigning.getType():
    case actions.walletSelector.reset.getType():
      return {
        ...state,
        isLoading: false,
        errorMsg: undefined,
      };
    case actions.walletSelector.setRecoveryPhase.getType():
      return { ...state, recoveryPhase: action.payload.RecoveryPhase };
  }
  return state;
};
