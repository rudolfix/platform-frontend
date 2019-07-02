import { omit } from "lodash/fp";
import { mapProps } from "recompose";

export const omitProps = <P extends object, T extends keyof P>(keys: T[]) =>
  mapProps((props: P) => omit<P, T>(keys, props));
