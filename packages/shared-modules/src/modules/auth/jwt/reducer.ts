import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { jwtActions } from "./actions";

export interface IJwtState {
  token: string | undefined;
}

const jwtInitialState: IJwtState = {
  token: undefined,
};

const jwtReducer: AppReducer<IJwtState, typeof jwtActions> = (
  state = jwtInitialState,
  action,
): DeepReadonly<IJwtState> => {
  switch (action.type) {
    case jwtActions.setJWT.getType():
      return {
        ...state,
        token: action.payload.jwt,
      };
    default:
      return state;
  }
};

const jwtReducerMap = {
  jwt: jwtReducer,
};

export { jwtReducerMap };
