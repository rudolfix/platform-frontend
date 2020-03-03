import { DeepReadonly } from "@neufund/shared";

import { AppReducer } from "../../store";

export interface IVerifyEmailWidgetState {
  isButtonLocked: boolean;
}

const verifyEmailWidgetInitialState: IVerifyEmailWidgetState = { isButtonLocked: false };

export const verifyEmailWidgetReducer: AppReducer<IVerifyEmailWidgetState> = (
  state = verifyEmailWidgetInitialState,
  action,
): DeepReadonly<IVerifyEmailWidgetState> => {
  switch (action.type) {
    case "VERIFY_EMAIL_BUTTON_LOCK":
      return {
        ...state,
        isButtonLocked: true,
      };
    case "VERIFY_EMAIL_BUTTON_UNLOCK":
      return {
        ...state,
        isButtonLocked: false,
      };
  }

  return state;
};

export const selectIsConnectedButtonLocked = (state: IVerifyEmailWidgetState): boolean =>
  state.isButtonLocked;
