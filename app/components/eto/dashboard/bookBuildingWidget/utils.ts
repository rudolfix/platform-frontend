import {TBookbuildingStatsType} from "../../../../lib/api/eto/EtoApi.interfaces";

export const countPledgeMoney = (bookBuildingStats:TBookbuildingStatsType[]) =>
  bookBuildingStats.reduce((acc:number, element:TBookbuildingStatsType) => {
  acc += element.amountEur;
  return acc
}, 0);
