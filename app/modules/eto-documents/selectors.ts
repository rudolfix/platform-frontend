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
import { TEtoDocumentTemplates } from "./../../lib/api/eto/EtoFileApi.interfaces";
import { IEtoDocumentState } from "./reducer";

export const selectIsTermSheetSubmitted = (state: IEtoDocumentState): boolean | undefined =>
  state.etoFileData &&
  state.etoFileData.uploadedDocuments &&
  Object.keys(state.etoFileData.uploadedDocuments).some(
    key => state.etoFileData.uploadedDocuments[key].documentType === "termsheet_template",
  );

export const selectIsPamphletSubmitted = (state: IEtoDocumentState): boolean | undefined =>
  state.etoFileData &&
  state.etoFileData.uploadedDocuments &&
  Object.keys(state.etoFileData.uploadedDocuments).some(
    key => state.etoFileData.uploadedDocuments[key].documentType === "bafin_approved_pamphlet", 
  );

export const selectIsProspectusSubmitted = (state: IEtoDocumentState): boolean | undefined =>
  state.etoFileData &&
  state.etoFileData.uploadedDocuments &&
  Object.keys(state.etoFileData.uploadedDocuments).some(
    key => state.etoFileData.uploadedDocuments[key].documentType === "bafin_approved_prospectus",
  );

export const selectIsIpfsModalOpen = (state: IEtoDocumentState): boolean => state.showIpfsModal;

export const selectFileUploadAction = (state: IEtoDocumentState): (() => void) | undefined =>
  state.uploadAction;

export const selectEtoDocumentLoading = (state: IEtoDocumentState): boolean => state.loading;

export const selectEtoDocumentData = (state: IEtoDocumentState): IEtoFiles => state.etoFileData;

export const selectUploadedEtoDocuments = (
  state: IEtoDocumentState,
): TEtoDocumentTemplates | undefined => state.etoFileData && state.etoFileData.uploadedDocuments;
