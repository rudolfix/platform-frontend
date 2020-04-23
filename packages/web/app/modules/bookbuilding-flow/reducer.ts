import { DeepReadonly, Dictionary } from "@neufund/shared-utils";

import { IBookBuildingStats, IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { AppReducer } from "../../store";
import { actions } from "../actions";

export interface IBookbuildingFLow {
  bookbuildingStats: Dictionary<IBookBuildingStats>;
  pledges: Dictionary<IPledge | undefined>;
}

export const bookBuildingFlow: IBookbuildingFLow = {
  bookbuildingStats: {},
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
        bookbuildingStats: action.payload.stats,
      };
    case actions.bookBuilding.setPledge.getType():
      return {
        ...state,
        pledges: {
          ...state.pledges,
          [action.payload.etoId]: action.payload.pledge,
        },
      };
    case actions.bookBuilding.setPledges.getType():
      return {
        ...state,
        pledges: action.payload.pledges,
      };
  }
  return state;
};
