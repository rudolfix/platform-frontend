import { createActionFactory, Dictionary } from "@neufund/shared-utils";

import {
  IBookBuildingStats,
  IPledge,
  IPledges,
} from "./lib/http/eto-pledge-api/EtoPledgeApi.interfaces.unsafe";

export const bookbuildingActions = {
  loadBookBuildingStats: createActionFactory("LOAD_BOOKBUILDING_FLOW_STATS", (etoId: string) => ({
    etoId,
  })),
  loadBookBuildingListStats: createActionFactory(
    "LOAD_BOOKBUILDING_LIST_FLOW_STATS",
    (etosIds: string[]) => ({
      etosIds,
    }),
  ),
  setBookBuildingStats: createActionFactory(
    "SET_BOOKBUILDING_FLOW_STATS",
    (etoId: string, stats: any) => ({ stats, etoId }),
  ),
  setBookBuildingListStats: createActionFactory(
    "SET_BOOKBUILDING_LIST_FLOW_STATS",
    (stats: Dictionary<IBookBuildingStats>) => ({ stats }),
  ),
  loadPledgeForEto: createActionFactory("LOAD_PLEDGE_FOR_ETO", (etoId: string) => ({
    etoId,
  })),
  loadAllPledges: createActionFactory("LOAD_ALL_PLEDGES"),
  savePledge: createActionFactory("SAVE_PLEDGE", (etoId: string, pledge: IPledge) => ({
    etoId,
    pledge,
  })),
  deletePledge: createActionFactory("DELETE_PLEDGE", (etoId: string) => ({ etoId })),
  setPledge: createActionFactory("SET_PLEDGE", (etoId: string, pledge?: IPledge) => ({
    etoId,
    pledge,
  })),
  setPledges: createActionFactory("SET_PLEDGES", (pledges: IPledges) => ({
    pledges,
  })),
  bookBuildingStartWatch: createActionFactory("WATCH_BOOKBUILDING_FLOW_STATS", (etoId: string) => ({
    etoId,
  })),
  bookBuildingStopWatch: createActionFactory(
    "UNWATCH_BOOKBUILDING_FLOW_STATS",
    (etoId: string) => ({ etoId }),
  ),
};
