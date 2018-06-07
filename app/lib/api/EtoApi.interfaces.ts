import { DeepPartial } from "../../types";
import * as YupTS from "../yup-ts";

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const EtoCapTableType = YupTS.object({
  fullName: YupTS.string(),
  ownership: YupTS.number(),
});

const NotableInvestorsType = YupTS.object({
  fullName: YupTS.string(),
});

const AdvisorsType = YupTS.object({
  fullName: YupTS.string(),
});

const tagsType = YupTS.string();

export const EtoTeamDataType = YupTS.object({
  employeesAmount: YupTS.number(),
  tags: YupTS.array(tagsType),
  founders: YupTS.array(EtoFounderType),
  capTable: YupTS.array(EtoCapTableType),
  notableInvestors: YupTS.array(NotableInvestorsType),
  advisors: YupTS.array(AdvisorsType),
});
type TEtoTeamData = YupTS.TypeOf<typeof EtoTeamDataType>;

export type TEtoData = TEtoTeamData;
export type TPartialEtoData = DeepPartial<TEtoData>;
