import { IPledge } from "./lib/http/eto-pledge-api/EtoPledgeApi.interfaces.unsafe";
import { TBookbuildingModuleState } from "./module";

export const selectBookbuildingStats = (state: TBookbuildingModuleState, etoId: string) =>
  state.bookbuilding.bookbuildingStats[etoId];

export const selectMyPledge = (
  state: TBookbuildingModuleState,
  etoId: string,
): IPledge | undefined => state.bookbuilding.pledges[etoId];

export const selectInvestorCount = (state: TBookbuildingModuleState, etoId: string) => {
  const stats = selectBookbuildingStats(state, etoId);
  return stats ? stats.investorsCount : undefined;
};

export const selectPledgedAmount = (state: TBookbuildingModuleState, etoId: string) => {
  const stats = selectBookbuildingStats(state, etoId);
  return stats ? stats.pledgedAmount : undefined;
};
