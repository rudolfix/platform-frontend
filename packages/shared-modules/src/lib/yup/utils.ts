import mapValues from "lodash/mapValues";
import { MixedSchema, object, ObjectSchema } from "yup";

// copied from design system, should be deduplicated at some point
export const makeAllRequiredExcept = (
  schema: ObjectSchema<any>,
  keys: string[],
): ObjectSchema<any> => {
  const oldFields: { [key: string]: MixedSchema } = (schema as any).fields;
  const newFields = mapValues(oldFields, (s, key) => {
    if (keys.includes(key)) {
      return s;
    }

    return s.required();
  });
  return object(newFields);
};
