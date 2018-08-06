import * as Yup from "yup";
import { IAppState } from "./../../store";

import {
  EtoCompanyInformationType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoMediaType,
  EtoProductVisionType,
  EtoRiskAssessmentType,
  EtoState,
  EtoTermsType,
  GeneralEtoDataType,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { selectIsUserEmailVerified } from "../auth/selectors";
import { selectKycRequestStatus } from "../kyc/selectors";
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

export const calculateCompanyInformationProgress = getFormFractionDoneCalculator(
  EtoCompanyInformationType.toYup(),
);
export const calculateEtoTermsProgress = getFormFractionDoneCalculator(EtoTermsType.toYup());
export const calculateEtoKeyIndividualsProgress = getFormFractionDoneCalculator(
  EtoKeyIndividualsType.toYup(),
);
export const calculateLegalInformationProgress = getFormFractionDoneCalculator(
  EtoLegalInformationType.toYup(),
);
export const calculateProductVisionProgress = getFormFractionDoneCalculator(
  EtoProductVisionType.toYup(),
);
export const calculateEtoMediaProgress = getFormFractionDoneCalculator(EtoMediaType.toYup());
export const calculateEtoRiskAssessmentProgress = getFormFractionDoneCalculator(
  EtoRiskAssessmentType.toYup(),
);

export const calculateGeneralEtoData = getFormFractionDoneCalculator(GeneralEtoDataType.toYup(), {
  ignore: true,
});

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
    state.etoFileData.uploadedDocuments &&
    state.etoFileData.uploadedDocuments.termSheet &&
    state.etoFileData.uploadedDocuments.termSheet.url &&
    state.etoFileData.uploadedDocuments.termSheet.url !== ""
  );
// TODO: unmock and connect with backend

export const selectIsPamphletSubmitted = (state: IEtoFlowState): boolean | undefined =>
  !!(
    state.etoFileData &&
    state.etoFileData.uploadedDocuments &&
    state.etoFileData.uploadedDocuments.pamphlet &&
    state.etoFileData.uploadedDocuments.pamphlet.url &&
    state.etoFileData.uploadedDocuments.pamphlet.url !== ""
  );
// TODO: unmock and connect with backend

export const selectIsProspectusSubmitted = (state: IEtoFlowState): boolean | undefined =>
  !!(
    state.etoFileData &&
    state.etoFileData.uploadedDocuments &&
    state.etoFileData.uploadedDocuments.bafinProspectus &&
    state.etoFileData.uploadedDocuments.bafinProspectus.url &&
    state.etoFileData.uploadedDocuments.bafinProspectus.url !== ""
  );
// TODO: unmock and connect with backend

export const selectIsIpfsModalOpen = (state: IEtoFlowState): boolean => state.showIpfsModal;

export const selectFileUploadAction = (state: IEtoFlowState): (() => void) | undefined =>
  state.uploadAction;

export const selectIsBookBuilding = (state: IEtoFlowState): boolean | undefined =>
  state.etoData && state.etoData.isBookbuilding;

export const selectEtoState = (state: IEtoFlowState): EtoState | undefined =>
  state.etoData && state.etoData.state;

export const selectCompanyData = (state: IEtoFlowState): TPartialCompanyEtoData =>
  state.companyData;

export const selectEtoData = (state: IEtoFlowState): TPartialEtoSpecData => state.etoData;

export const selectEtoLoadingData = (state: IEtoFlowState): boolean => state.loading;

export const selectCombinedEtoCompanyData = (
  state: IEtoFlowState,
): TPartialEtoSpecData & TPartialCompanyEtoData => ({
  ...selectCompanyData(state),
  ...selectEtoData(state),
});

export const selectEtoFileData = (state: IEtoFlowState): IEtoFiles => state.etoFileData;

/* General Selector */

export const selectShouldEtoDataLoad = (state: IAppState) =>
  selectKycRequestStatus(state.kyc) === "Accepted" && selectIsUserEmailVerified(state.auth);
