import * as t from "io-ts";

import { DeepPartial } from "../../types";
import * as types from "../type-boundary";

const EtoFounderType = t.type({
  fullName: types.nonEmptyStringType,
  role: types.nonEmptyStringType,
  bio: types.nonEmptyStringType,
});
export type TEtoFounder = t.TypeOf<typeof EtoFounderType>;

const EtoCapTableType = t.type({
  fullName: types.nonEmptyStringType,
  ownership: types.NumberFromString,
});

const NotableInvestorsType = t.type({
  fullName: types.nonEmptyStringType,
});

const AdvisorsType = t.type({
  fullName: types.nonEmptyStringType,
});

export const EtoTeamDataType = t.type({
  employeesAmount: types.IntegerFromString,
  founders: t.array(EtoFounderType),
  capTable: t.array(EtoCapTableType),
  notableInvestors: t.array(NotableInvestorsType),
  advisors: t.array(AdvisorsType),
});
type TEtoTeamData = t.TypeOf<typeof EtoTeamDataType>;

export type TEtoData = TEtoTeamData; // and others...
export type TPartialEtoData = DeepPartial<TEtoData>;
