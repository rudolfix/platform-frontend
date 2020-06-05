import { AppReducer } from "@neufund/sagas";

import { signerUIActions } from "./actions";
import { TSignerSignPayload } from "./types";

export enum ESignerUIState {
  IDLE = "idle",
  SIGNING = "signing",
}

interface ISignerUIState {
  state: ESignerUIState;
  request: TSignerSignPayload | undefined;
}

const initialState: ISignerUIState = {
  state: ESignerUIState.IDLE,
  request: undefined,
};

const signerUIReducer: AppReducer<ISignerUIState, typeof signerUIActions> = (
  state = initialState,
  action,
): ISignerUIState => {
  switch (action.type) {
    case signerUIActions.sign.getType():
      return {
        state: ESignerUIState.SIGNING,
        request: action.payload,
      };

    case signerUIActions.signed.getType():
    case signerUIActions.denied.getType():
      return initialState;

    default:
      return state;
  }
};

const signerUIReducerMap = { signerUI: signerUIReducer };

export { signerUIReducerMap };
