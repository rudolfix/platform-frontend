import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { instantIdActions } from "./actions";
import { idNowInitialState, idNowReducer, IKycIdNowState } from "./id-now/reducer";
import { IKycOnfidoState, onfidoInitialState, onfidoReducer } from "./onfido/reducer";

export interface IInstantIdState {
  onfido: IKycOnfidoState;
  idNow: IKycIdNowState;
}

const instantIdInitialState: IInstantIdState = {
  onfido: onfidoInitialState,
  idNow: idNowInitialState,
};

export const instantIdReducer: AppReducer<IInstantIdState, typeof instantIdActions> = (
  reduxState = instantIdInitialState,
  action,
): DeepReadonly<IInstantIdState> => {
  const state = {
    ...reduxState,
    onfido: onfidoReducer(reduxState.onfido, action),
    idNow: idNowReducer(reduxState.idNow, action),
  };
  return state;
};

const instantIdReducerMap = {
  instantId: instantIdReducer,
};

export { instantIdReducerMap };
