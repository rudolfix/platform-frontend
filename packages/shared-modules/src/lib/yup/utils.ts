import { mapValues } from "lodash/fp";
import { MixedSchema, object, ObjectSchema } from "yup";

// copied from design system, should be deduplicated at some point
export const makeAllRequiredExcept = (
  schema: ObjectSchema<any>,
  keys: string[],
): ObjectSchema<any> => {
  const oldFields: { [key: string]: MixedSchema } = (schema as any).fields;
  const newFields = mapValues((s, ...rest) => {
    const [key]: string[] = rest;

    if (keys.includes(key)) {
      return s;
    }

    return s.required();
  }, oldFields);
  return object(newFields);
};
