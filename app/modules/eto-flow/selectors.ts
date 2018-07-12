import * as Yup from "yup";

function getErrorsNumber(validator: Yup.Schema, data?: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}


export interface IProgressOptions {
  ignore: any
}

export const selectFormFractionDone = (
  validator: Yup.Schema,
  formState: any,
  opts?: IProgressOptions
): number => {
  const strictValidator = validator.clone()

  const ignore = opts && opts.ignore

  const updateValidatorAndInitialData = (objectSchema: any, initialData: any, currentValue: any, ignore: any): any => {
    const type = objectSchema._type
    if (ignore !== true) {
      switch (type) {
        case 'object':
          for (const prop in objectSchema.fields) {
            // need to clone before change
            const schema = objectSchema.fields[prop] = objectSchema.fields[prop].clone()
            initialData[prop] = updateValidatorAndInitialData(schema, {}, currentValue && currentValue[prop], ignore && ignore[prop])
          }
          return initialData
        case 'array':
          const arr = Array.isArray(currentValue) ? currentValue : []
          // need to clone before change
          objectSchema._subType = objectSchema._subType.clone()
          return arr.map((_, i) => updateValidatorAndInitialData(objectSchema._subType, {}, arr[i], ignore && ignore[0]))
        case 'string':
        case 'number':
          objectSchema.withMutation((schema: any) => schema.required())
      }
    }
  }

  const initialData = updateValidatorAndInitialData(strictValidator, {}, formState, ignore)

  const errors = getErrorsNumber(strictValidator, formState) || 0;
  const maxErrors = getErrorsNumber(strictValidator, initialData) || 1;

  const result = 1 - errors / maxErrors;
  if (result < 0) return 0;
  return result;
};


export const etoMediaProgressOptions: IProgressOptions = {
  ignore: {
    socialChannels: true,
    companyNews: true
  }
}
