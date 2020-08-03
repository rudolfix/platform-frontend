import { ECurrency, EquityToken, Opaque } from "@neufund/shared-utils";
import * as React from "react";

export type TComponentRefType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends React.ComponentType<any>
> = T extends React.ComponentType<{
  ref?: React.Ref<infer P>;
}>
  ? P
  : never;

/**
 * Wraps all token related information into a single object to couple all required and !important information together
 */
export type TToken<T extends ECurrency | EquityToken> = {
  value: Opaque<T, string>;
  precision: Opaque<T, number>;
  type: T;
};
