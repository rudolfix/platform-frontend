import { mapValues } from "lodash";

export function valuesToString<T>(entity: T): { [P in keyof T]: string } {
  return mapValues(entity, e => e.toString()) as any;
}
