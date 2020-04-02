import * as React from "react";

export type TComponentRefType<T extends React.ComponentType<any>> = T extends React.ComponentType<{
  ref?: React.Ref<infer P>;
}>
  ? P
  : never;
