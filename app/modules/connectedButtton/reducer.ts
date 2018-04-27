import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IConnectedButtonState {
  isButtonLocked: boolean;
}

const connectedButtonInitialState: IConnectedButtonState = { isButtonLocked: false };

export const connectedButtonReducer: AppReducer<IConnectedButtonState> = (
  state = connectedButtonInitialState,
  action,
): DeepReadonly<IConnectedButtonState> => {
  switch (action.type) {
    case "CONNECTED_BUTTON_LOCK":
      return {
        ...state,
        isButtonLocked: true,
      };
    case "CONNECTED_BUTTON_UNLOCK":
      return {
        ...state,
        isButtonLocked: false,
      };
  }

  return state;
};
