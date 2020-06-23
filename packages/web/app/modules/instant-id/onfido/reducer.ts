import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { instantIdActions } from "../actions";

export interface IKycOnfidoState {
  requestStartError: Error | undefined;
}

export const onfidoInitialState: IKycOnfidoState = {
  requestStartError: undefined,
};

export const onfidoReducer: AppReducer<IKycOnfidoState, typeof instantIdActions> = (
  state = onfidoInitialState,
  action,
): DeepReadonly<IKycOnfidoState> => {
  switch (action.type) {
    case instantIdActions.startOnfidoRequest.getType():
      return onfidoInitialState;
    case instantIdActions.startOnfidoRequestError.getType():
      return {
        requestStartError: action.payload.error,
      };
    default:
      return state;
  }
};
