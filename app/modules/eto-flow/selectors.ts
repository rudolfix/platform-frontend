import * as Yup from "yup";

function getErrorsNumber(validator: Yup.Schema, data?: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}

export const selectFormFractionDone = (
  validator: Yup.Schema,
  formState: any,
): number => {
  const strictValidator = validator.clone()

  const updateValidatorAndInitialData = (objectSchema: any, data: any, currentValue: any): any => {
    const type = objectSchema._type
    switch(type) {
      case 'object':
        for (const prop in objectSchema.fields) {
          const schema = objectSchema.fields[prop];
          data[prop] = updateValidatorAndInitialData(schema, {}, currentValue && currentValue[prop])
        }
        objectSchema.withMutation((schema: any) => schema.required())
        return data
      case 'array':
        const arr = Array.isArray(currentValue) ? currentValue : []
        return arr.map((_, i) => updateValidatorAndInitialData(objectSchema._subType, data, arr[i]))
      case 'string':
        objectSchema.withMutation((schema: any) => schema.required())
    }
  }

  const initialData = updateValidatorAndInitialData(strictValidator, {}, formState)

  const errors = getErrorsNumber(strictValidator, formState);
  const maxErrors = getErrorsNumber(strictValidator, initialData)

  const result = 1 - errors / maxErrors;
  if (result < 0) return 0;
  return result;
};
