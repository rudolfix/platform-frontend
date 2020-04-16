import { DeepReadonly } from "@neufund/shared-utils";

import { AppReducer } from "../../store";
import { actions } from "../actions";

export interface IRoutingState {
  hasRedirectedToBrowserAlready: boolean;
}

export const routingInitialState: IRoutingState = {
  hasRedirectedToBrowserAlready: false,
};

export const routingReducer: AppReducer<IRoutingState> = (
  state = routingInitialState,
  action,
): DeepReadonly<IRoutingState> => {
  switch (action.type) {
    case actions.routing.setBrowserAutoRedirect.getType():
      return {
        ...state,
        hasRedirectedToBrowserAlready: action.payload.hasRedirectedToBrowserAlready,
      };

    default:
      return state;
  }
};
