import { ECurrency, ENumberInputFormat } from "../../utils/formatters";
import { EquityToken } from "../eth/types";
import { Opaque } from "../types";

/**
 * Wraps all token related information into a single object to couple all required information together
 */
export type TToken<
  T extends ECurrency | EquityToken = ECurrency | EquityToken,
  P extends ENumberInputFormat = ENumberInputFormat
> = {
  type: T;
  value: Opaque<[T, P], string>;
  precision: P;
};
