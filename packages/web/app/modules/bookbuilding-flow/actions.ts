import { createActionFactory, Dictionary } from "@neufund/shared-utils";

import { IBookBuildingStats, IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";

export const bookBuildingFlowActions = {
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
  loadPledge: createActionFactory("LOAD_PLEDGE", (etoId: string) => ({ etoId })),
  savePledge: createActionFactory("SAVE_PLEDGE", (etoId: string, pledge: IPledge) => ({
    etoId,
    pledge,
  })),
  deletePledge: createActionFactory("DELETE_PLEDGE", (etoId: string) => ({ etoId })),
  setPledge: createActionFactory("SET_PLEDGE", (etoId: string, pledge?: IPledge) => ({
    etoId,
    pledge,
  })),
  bookBuildingStartWatch: createActionFactory("WATCH_BOOKBUILDING_FLOW_STATS", (etoId: string) => ({
    etoId,
  })),
  bookBuildingStopWatch: createActionFactory(
    "UNWATCH_BOOKBUILDING_FLOW_STATS",
    (etoId: string) => ({ etoId }),
  ),
};
