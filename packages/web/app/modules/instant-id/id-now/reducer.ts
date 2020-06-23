import { AppReducer } from "@neufund/sagas";

import { instantIdActions } from "../actions";
export interface IKycIdNowState {
  redirectUrl: string | undefined;
}

export const idNowInitialState: IKycIdNowState = {
  redirectUrl: undefined,
};

export const idNowReducer: AppReducer<IKycIdNowState, typeof instantIdActions> = (
  state = idNowInitialState,
  action,
) => {
  switch (action.type) {
    case instantIdActions.setIdNowRedirectUrl.getType():
      return {
        ...idNowInitialState,
        redirectUrl: action.payload.redirectUrl,
      };

    default:
      return state;
  }
};
