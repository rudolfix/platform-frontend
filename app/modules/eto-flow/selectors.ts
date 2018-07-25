import * as Yup from "yup";
import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { TPartialCompanyEtoData, TPartialEtoSpecData } from "./../../lib/api/eto/EtoApi.interfaces";
import { IEtoFlowState } from "./reducer";

function getErrorsNumber(validator: Yup.Schema, data?: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}

export interface IProgressOptions {
  ignore: any;
}

export const selectRequiredFormFractionDone = (
  validator: Yup.Schema,
  formState: any,
  initialFormState: any,
): number => {
  const errors = getErrorsNumber(validator, formState);
  const maximumErrors = getErrorsNumber(validator, initialFormState.data);

  if (maximumErrors === 0) {
    return 1;
  }

  return 1 - errors / maximumErrors;
};

export type ProgressCalculator = (formState: any, initialData?: any) => number;

// recursivly clones a YUP Schema and makes number and string properties required
function updateValidator(objectSchema: any, ignore: any): any {
  const type = objectSchema._type;
  if (ignore !== true) {
    switch (type) {
      case "object":
        for (const prop in objectSchema.fields) {
          // need to clone before change
          const schema = (objectSchema.fields[prop] = objectSchema.fields[prop].clone());
          updateValidator(schema, ignore && ignore[prop]);
        }
        break;
      case "array":
        // need to clone before change
        objectSchema._subType = objectSchema._subType.clone();
        updateValidator(objectSchema._subType, ignore && ignore[0]);
        break;
      case "string":
      case "number":
        objectSchema.withMutation((schema: any) => schema.required());
    }
  }
}

// recursivly create initial data from current values
function updateInitialData(initialData: any, currentValue: any): any {
  if (Array.isArray(currentValue)) {
    return currentValue.map((_, i) => updateInitialData({}, currentValue[i]));
  } else if (typeof currentValue === "object") {
    for (const prop in currentValue) {
      if (currentValue.hasOwnProperty(prop)) {
        initialData[prop] = updateInitialData({}, currentValue && currentValue[prop]);
      }
    }
    return initialData;
  }
}

export function getInitialDataForFractionCalculation(formState: any): any {
  return updateInitialData({}, formState);
}

export function getFormFractionDoneCalculator(
  validator: Yup.Schema,
  opts?: IProgressOptions,
): ProgressCalculator {
  const strictValidator = validator.clone();
  const ignore = opts && opts.ignore;
  updateValidator(strictValidator, ignore);

  return (formState: any, initialData?: any) => {
    if (typeof initialData === "undefined") {
      initialData = updateInitialData({}, formState);
    }

    const errors = getErrorsNumber(strictValidator, formState) || 0;
    const maxErrors = getErrorsNumber(strictValidator, initialData) || 1;

    const result = 1 - errors / maxErrors;
    if (result < 0) return 0;
    return result;
  };
}

export const etoMediaProgressOptions: IProgressOptions = {
  ignore: {
    companyVideo: true,
    socialChannels: true,
    companyNews: true,
  },
};

export const selectIsTermSheetSubmitted = (state: IEtoFlowState): boolean | undefined =>
  !!(
    state.etoFileData &&
    state.etoFileData.termSheet &&
    state.etoFileData.termSheet.url &&
    state.etoFileData.termSheet.url !== ""
  );
// TODO: unmock and connect with backend

export const selectIsPamphletSubmitted = (state: IEtoFlowState): boolean | undefined =>
  !!(
    state.etoFileData &&
    state.etoFileData.pamphlet &&
    state.etoFileData.pamphlet.url &&
    state.etoFileData.pamphlet.url !== ""
  );
// TODO: unmock and connect with backend

export const selectIsProspectusSubmitted = (state: IEtoFlowState): boolean | undefined =>
  !!(
    state.etoFileData &&
    state.etoFileData.pamphlet &&
    state.etoFileData.pamphlet.url &&
    state.etoFileData.pamphlet.url !== ""
  );
// TODO: unmock and connect with backend

export const selectIsBookBuilding = (state: IEtoFlowState): boolean | undefined =>
  state.etoData && state.etoData.isBookbuilding;

export const selectEtoState = (state: IEtoFlowState): EtoState | undefined =>
  state.etoData && state.etoData.state;

export const selectCompanyData = (state: IEtoFlowState): TPartialCompanyEtoData =>
  state.companyData;

export const selectEtoData = (state: IEtoFlowState): TPartialEtoSpecData => state.etoData;

export const selectCombinedEtoCompanyData = (
  state: IEtoFlowState,
): TPartialEtoSpecData & TPartialCompanyEtoData => ({
  ...selectCompanyData(state),
  ...selectEtoData(state),
});
