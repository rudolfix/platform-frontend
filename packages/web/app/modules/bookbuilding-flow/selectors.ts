import { IPledge } from "../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { TAppGlobalState } from "../../store";

export const selectBookbuildingStats = (state: TAppGlobalState, etoId: string) =>
  state.bookBuildingFlow.bookbuildingStats[etoId];

export const selectBookbuildingStatsFromList = (state: TAppGlobalState, etoId: string) =>
  state.bookBuildingFlow.bookbuildingListStats[etoId];

export const selectMyPledge = (state: TAppGlobalState, etoId: string): IPledge | undefined =>
  state.bookBuildingFlow.pledges[etoId];

export const selectInvestorCount = (state: TAppGlobalState, etoId: string) => {
  const stats = selectBookbuildingStats(state, etoId);
  return stats ? stats.investorsCount : undefined;
};

export const selectPledgedAmount = (state: TAppGlobalState, etoId: string) => {
  const stats = selectBookbuildingStats(state, etoId);
  return stats ? stats.pledgedAmount : undefined;
};
