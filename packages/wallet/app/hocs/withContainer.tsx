import * as React from "react";
import { ComponentEnhancer, nest } from "recompose";

export function withContainer<R, T>(Layout: React.ComponentType<R>): ComponentEnhancer<T, T> {
  return (WrapperComponent: React.ComponentType<T>) => nest(Layout, WrapperComponent);
}
