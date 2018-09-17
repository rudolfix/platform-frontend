import { IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces";
import { IAppState } from "../../store";

export const selectBookbuildingStats = (etoId: string, state: IAppState) =>
  state.bookBuildingFlow.bookbuildingStats[etoId];

export const selectMyPledge = (etoId: string, state: IAppState): IPledge | undefined =>
  state.bookBuildingFlow.pledges[etoId];
