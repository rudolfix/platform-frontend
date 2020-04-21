import { AppReducer } from "@neufund/sagas";

import { SIGN_ACTION_TYPE, SIGNED_ACTION_TYPE, signerUIActions } from "./actions";
import { TSignerRequestData } from "./types";

export enum ESignerUIState {
  IDLE = "idle",
  SIGNING = "signing",
}

interface ISignerUIState {
  state: ESignerUIState;
  data: TSignerRequestData[keyof TSignerRequestData] | undefined;
}

const initialState: ISignerUIState = {
  state: ESignerUIState.IDLE,
  data: undefined,
};

const signerUIReducer: AppReducer<ISignerUIState, typeof signerUIActions> = (
  state = initialState,
  action,
): ISignerUIState => {
  switch (action.type) {
    case SIGN_ACTION_TYPE:
      return {
        state: ESignerUIState.SIGNING,
        data: action.payload.data,
      };

    case SIGNED_ACTION_TYPE:
    case signerUIActions.denied.getType():
      return initialState;

    default:
      return state;
  }
};

const signerUIReducerMap = { signerUI: signerUIReducer };

export { signerUIReducerMap };
