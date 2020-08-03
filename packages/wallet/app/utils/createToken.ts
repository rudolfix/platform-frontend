import { ECurrency, EquityToken, Opaque } from "@neufund/shared-utils";

import { TToken } from "utils/types";

export const createToken = <T extends ECurrency | EquityToken>(
  type: T,
  value: string,
  precision: number,
): TToken<T> => ({
  type,
  value: value as Opaque<T, string>,
  precision: precision as Opaque<T, number>,
});
