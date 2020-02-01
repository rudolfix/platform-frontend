import { DeepReadonly, Dictionary } from "@neufund/shared";

import { IBookBuildingStats, IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { AppReducer } from "../../store";
import { actions } from "../actions";

export interface IBookbuildingFLow {
  bookbuildingStats: Dictionary<IBookBuildingStats>;
  bookbuildingListStats: Dictionary<IBookBuildingStats>;
  pledges: Dictionary<IPledge | undefined>;
}

export const bookBuildingFlow: IBookbuildingFLow = {
  bookbuildingStats: {},
  bookbuildingListStats: {},
  pledges: {},
};

export const bookBuildingFlowReducer: AppReducer<IBookbuildingFLow> = (
  state = bookBuildingFlow,
  action,
): DeepReadonly<IBookbuildingFLow> => {
  switch (action.type) {
    case actions.bookBuilding.setBookBuildingStats.getType():
      return {
        ...state,
        bookbuildingStats: {
          ...state.bookbuildingStats,
          [action.payload.etoId]: action.payload.stats,
        },
      };
    case actions.bookBuilding.setBookBuildingListStats.getType():
      return {
        ...state,
        bookbuildingListStats: action.payload.stats,
      };
    case actions.bookBuilding.setPledge.getType():
      return {
        ...state,
        pledges: {
          ...state.pledges,
          [action.payload.etoId]: action.payload.pledge,
        },
      };
  }
  return state;
};
