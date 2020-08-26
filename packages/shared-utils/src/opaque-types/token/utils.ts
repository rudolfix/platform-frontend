import { ECurrency, ENumberInputFormat } from "../../utils/formatters";
import { EquityToken } from "../eth/types";
import { Opaque } from "../types";
import { TToken } from "./types";

const createToken = <T extends ECurrency | EquityToken, P extends ENumberInputFormat>(
  type: T,
  value: string,
  precision: P,
): TToken<T, P> => ({
  type,
  value: value as Opaque<[T, P], string>,
  precision: precision as Opaque<T, P>,
});

export { createToken };
