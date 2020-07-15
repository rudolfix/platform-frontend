import { AppReducer } from "@neufund/sagas";
import { DeepReadonly, Dictionary } from "@neufund/shared-utils";

import { bookbuildingActions } from "./actions";
import {
  IBookBuildingStats,
  IPledge,
} from "./lib/http/eto-pledge-api/EtoPledgeApi.interfaces.unsafe";

export interface IBookbuildingFLow {
  bookbuildingStats: Dictionary<IBookBuildingStats>;
  pledges: Dictionary<IPledge | undefined>;
}

export const bookBuildingFlow: IBookbuildingFLow = {
  bookbuildingStats: {},
  pledges: {},
};

export const bookbuildingReducer: AppReducer<IBookbuildingFLow, typeof bookbuildingActions> = (
  state = bookBuildingFlow,
  action,
): DeepReadonly<IBookbuildingFLow> => {
  switch (action.type) {
    case bookbuildingActions.setBookBuildingStats.getType():
      return {
        ...state,
        bookbuildingStats: {
          ...state.bookbuildingStats,
          [action.payload.etoId]: action.payload.stats,
        },
      };
    case bookbuildingActions.setBookBuildingListStats.getType():
      return {
        ...state,
        bookbuildingStats: action.payload.stats,
      };
    case bookbuildingActions.setPledge.getType():
      return {
        ...state,
        pledges: {
          ...state.pledges,
          [action.payload.etoId]: action.payload.pledge,
        },
      };
    case bookbuildingActions.setPledges.getType():
      return {
        ...state,
        pledges: action.payload.pledges,
      };
  }
  return state;
};

const bookbuildingReducerMap = {
  bookbuilding: bookbuildingReducer,
};

export { bookbuildingReducerMap };
