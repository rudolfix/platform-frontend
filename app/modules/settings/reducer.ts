import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface ISettings {
  isEmailTemporaryCancelled: boolean;
}

const initialState: ISettings = {
  isEmailTemporaryCancelled: false,
};

export const settingsReducer: AppReducer<ISettings> = (
  state = initialState,
  action,
): DeepReadonly<ISettings> => {
  switch (action.type) {
    case "SETTINGS_CANCEL_EMAIL":
      return {
        ...state,
        isEmailTemporaryCancelled: true,
      };
    case "SETTINGS_ADD_NEW_EMAIL":
      return {
        ...state,
        isEmailTemporaryCancelled: false,
      };
  }

  return state;
};

export const selectIsCancelEmail = (state: ISettings): boolean => state.isEmailTemporaryCancelled;
