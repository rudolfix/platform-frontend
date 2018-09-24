import {
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { DeepReadonlyObject } from "../../types";

export enum ETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export interface IEtoContractData {
  timedState?: ETOStateOnChain;
}

export type IEtoFullData = DeepReadonlyObject<
  TPublicEtoData & {
    contract: IEtoContractData;
  }
>;
