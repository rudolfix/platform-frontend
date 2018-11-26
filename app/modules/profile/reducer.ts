import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IProfile {
  isEmailTemporaryCancelled: boolean;
}

const initialState: IProfile = {
  isEmailTemporaryCancelled: false,
};

export const profileReducer: AppReducer<IProfile> = (
  state = initialState,
  action,
): DeepReadonly<IProfile> => {
  switch (action.type) {
    case "PROFILE_CANCEL_EMAIL":
      return {
        ...state,
        isEmailTemporaryCancelled: true,
      };
    case "PROFILE_ADD_NEW_EMAIL":
    case "PROFILE_REVERT_CANCEL_EMAIL":
      return {
        ...state,
        isEmailTemporaryCancelled: false,
      };
  }

  return state;
};

export const selectIsCancelEmail = (state: IProfile): boolean => state.isEmailTemporaryCancelled;
