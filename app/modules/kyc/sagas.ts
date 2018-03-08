import { call, Effect, put } from "redux-saga/effects";

import { actions, TAction } from "../actions";

import { callAndInject, getDependency, neuTakeEvery } from "../sagas";

import { symbols } from "../../di/symbols";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { KycApi } from "../../lib/api/KycApi";
import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
} from "../../lib/api/KycApi.interfaces";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { injectableFn } from "../../middlewares/redux-injectify";

const notifyError = injectableFn(
  function*(notificationCenter: NotificationCenter, message: string): Iterator<any> {
    notificationCenter.error(message);
  },
  [symbols.notificationCenter],
);

/**
 * Individual Request
 */
function* loadIndividualData(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualData(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycIndividualData> = yield kcyService.getIndividualData();
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualData(false));
  }
}

function* submitIndividualData(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_INDIVIDUAL_FORM") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycIndividualData> = yield kcyService.putIndividualData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateIndividualData(false, result.body));
    yield put(actions.routing.goToKYCIndividualUpload());
  } catch {
    yield callAndInject(notifyError, "There was a problem sending your data. Please try again.");
  }
}

function* uploadIndividualFile(action: TAction): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_INDIVIDUAL_FILE") return;
  const { file } = action.payload;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateIndividualDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadIndividualDocument(file);
    yield put(actions.kyc.kycUpdateIndividualDocument(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualDocument(false));
    yield callAndInject(notifyError, "There was a problem uploading your file. Please try again.");
  }
}

function* loadIndividualFiles(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_FILE_LIST") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateIndividualDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield kcyService.getIndividualDocuments();
    yield put(actions.kyc.kycUpdateIndividualDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualDocuments(false));
  }
}

function* loadIndividualRequest(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_INDIVIDUAL_REQUEST_STATE") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycRequestState> = yield kcyService.getIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualRequestState(false));
  }
}

function* submitIndividualRequest(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_INDIVIDUAL_REQUEST") return;
  try {
    yield put(actions.kyc.kycUpdateIndividualRequestState(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycRequestState> = yield kcyService.submitIndividualRequest();
    yield put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateIndividualRequestState(false));
    yield callAndInject(
      notifyError,
      "There was a problem submitting your request. Please try again.",
    );
  }
}

/**
 * Company Request
 */

// legal representative
function* loadLegalRepresentative(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE") return;
  try {
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<
      IKycLegalRepresentative
    > = yield kcyService.getLegalRepresentative();
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
  }
}

function* submitLegalRepresentative(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_LEGAL_REPRESENTATIVE") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<IKycLegalRepresentative> = yield kcyService.putLegalRepresentative(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentative(false));
    yield callAndInject(notifyError, "There was a problem sending your data. Please try again.");
  }
}

function* uploadLegalRepresentativeFile(action: TAction): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE") return;
  const { file } = action.payload;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadLegalRepresentativeDocument(
      file,
    );
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocument(false));
    yield callAndInject(notifyError, "There was a problem uploading your file. Please try again.");
  }
}

function* loadLegalRepresentativeFiles(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(true));
    const result: IHttpResponse<
      IKycFileInfo[]
    > = yield kcyService.getLegalRepresentativeDocuments();
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false));
  }
}

// business data
function* setBusinessType(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SET_BUSINESS_TYPE") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    let institutionData: IKycBusinessData = {};
    try {
      const result: IHttpResponse<IKycBusinessData> = yield kcyService.getBusinessData();
      institutionData = result.body;
    } catch (_e) {}
    institutionData = { ...institutionData, legalFormType: action.payload.type };
    yield kcyService.putBusinessData(institutionData);
    yield put(actions.kyc.kycUpdateBusinessData(false, institutionData));
    yield put(actions.routing.goToKYCLegalRepresentative());
  } catch (_e) {
    yield put(actions.kyc.kycUpdateBusinessData(false));
    yield callAndInject(notifyError, "There was a problem sending your data. Please try again.");
  }
}

// legal representative
function* loadBusinessData(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_DATA") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycBusinessData> = yield kcyService.getBusinessData();
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessData(false));
  }
}

function* submitBusinessData(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BUSINESS_DATA") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield kcyService.putBusinessData(
      action.payload.data,
    );
    yield put(actions.kyc.kycUpdateBusinessData(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessData(false));
    yield callAndInject(notifyError, "There was a problem sending your data. Please try again.");
  }
}

function* uploadBusinessFile(action: TAction): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_BUSINESS_FILE") return;
  const { file } = action.payload;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBusinessDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadBusinessDocument(file);
    yield put(actions.kyc.kycUpdateBusinessDocument(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessDocument(false));
    yield callAndInject(notifyError, "There was a problem uploading your file. Please try again.");
  }
}

function* loadBusinessFiles(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_FILE_LIST") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBusinessDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield kcyService.getBusinessDocuments();
    yield put(actions.kyc.kycUpdateBusinessDocuments(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessDocuments(false));
  }
}

// beneficial owners
function* loadBeneficialOwners(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BENEFICIAL_OWNERS") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBeneficialOwners(true));
    const result: IHttpResponse<IKycBeneficialOwner[]> = yield kcyService.getBeneficialOwners();
    yield put(actions.kyc.kycUpdateBeneficialOwners(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwners(false));
  }
}

function* createBeneficialOwner(action: TAction): Iterator<any> {
  if (action.type !== "KYC_ADD_BENEFICIAL_OWNER") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield kcyService.postBeneficialOwner({});
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    yield callAndInject(notifyError, "There was a problem sending your data. Please try again.");
  }
}

function* submitBeneficialOwner(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BENEFICIAL_OWNER") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield kcyService.putBeneficialOwner(
      action.payload.owner,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    yield callAndInject(notifyError, "There was a problem saving your changes. Please try again.");
  }
}

function* deleteBeneficalOwner(action: TAction): Iterator<any> {
  if (action.type !== "KYC_DELETE_BENEFICIAL_OWNER") return;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBeneficialOwner(true));
    yield kcyService.deleteBeneficialOwner(action.payload.id);
    yield put(actions.kyc.kycUpdateBeneficialOwner(false, action.payload.id, undefined));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwner(false));
    yield callAndInject(notifyError, "There was a problem sending your data. Please try again.");
  }
}

function* uploadBeneficialOwnerFile(action: TAction): Iterator<any> {
  if (action.type !== "KYC_UPLOAD_BENEFICIAL_OWNER_FILE") return;
  const { boid, file } = action.payload;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, true));
    const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadBeneficialOwnerDocument(
      boid,
      file,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false));
    yield callAndInject(notifyError, "There was a problem uploading your file. Please try again.");
  }
}

function* loadBeneficialOwnerFiles(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST") return;
  const { boid } = action.payload;
  try {
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, true));
    const result: IHttpResponse<IKycFileInfo[]> = yield kcyService.getBeneficialOwnerDocuments(
      boid,
    );
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false));
  }
}

// request
function* loadBusinessRequest(action: TAction): Iterator<any> {
  if (action.type !== "KYC_LOAD_BUSINESS_REQUEST_STATE") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycRequestState> = yield kcyService.getBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessRequestState(false));
  }
}

function* submitBusinessRequest(action: TAction): Iterator<any> {
  if (action.type !== "KYC_SUBMIT_BUSINESS_REQUEST") return;
  try {
    yield put(actions.kyc.kycUpdateBusinessRequestState(true));
    const kcyService: KycApi = yield call(getDependency, symbols.apiKycService);
    const result: IHttpResponse<IKycRequestState> = yield kcyService.submitBusinessRequest();
    yield put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
  } catch {
    yield put(actions.kyc.kycUpdateBusinessRequestState(false));
    yield callAndInject(
      notifyError,
      "There was a problem submitting your request. Please try again.",
    );
  }
}

export function* kycSagas(): Iterator<Effect> {
  yield neuTakeEvery("KYC_LOAD_INDIVIDUAL_DATA", loadIndividualData);
  yield neuTakeEvery("KYC_SUBMIT_INDIVIDUAL_FORM", submitIndividualData);
  yield neuTakeEvery("KYC_UPLOAD_INDIVIDUAL_FILE", uploadIndividualFile);
  yield neuTakeEvery("KYC_LOAD_INDIVIDUAL_FILE_LIST", loadIndividualFiles);

  yield neuTakeEvery("KYC_LOAD_INDIVIDUAL_REQUEST_STATE", loadIndividualRequest);
  yield neuTakeEvery("KYC_SUBMIT_INDIVIDUAL_REQUEST", submitIndividualRequest);

  yield neuTakeEvery("KYC_LOAD_LEGAL_REPRESENTATIVE", loadLegalRepresentative);
  yield neuTakeEvery("KYC_SUBMIT_LEGAL_REPRESENTATIVE", submitLegalRepresentative);
  yield neuTakeEvery("KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE", uploadLegalRepresentativeFile);
  yield neuTakeEvery("KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST", loadLegalRepresentativeFiles);

  yield neuTakeEvery("KYC_SET_BUSINESS_TYPE", setBusinessType);
  yield neuTakeEvery("KYC_LOAD_BUSINESS_DATA", loadBusinessData);
  yield neuTakeEvery("KYC_SUBMIT_BUSINESS_DATA", submitBusinessData);
  yield neuTakeEvery("KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST", uploadBusinessFile);
  yield neuTakeEvery("KYC_UPLOAD_BUSINESS_FILE", loadLegalRepresentativeFiles);
  yield neuTakeEvery("KYC_LOAD_BUSINESS_FILE_LIST", loadBusinessFiles);

  yield neuTakeEvery("KYC_LOAD_BENEFICIAL_OWNERS", loadBeneficialOwners);
  yield neuTakeEvery("KYC_ADD_BENEFICIAL_OWNER", createBeneficialOwner);
  yield neuTakeEvery("KYC_SUBMIT_BENEFICIAL_OWNER", submitBeneficialOwner);
  yield neuTakeEvery("KYC_DELETE_BENEFICIAL_OWNER", deleteBeneficalOwner);
  yield neuTakeEvery("KYC_UPLOAD_BENEFICIAL_OWNER_FILE", uploadBeneficialOwnerFile);
  yield neuTakeEvery("KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST", loadBeneficialOwnerFiles);

  yield neuTakeEvery("KYC_LOAD_BUSINESS_REQUEST_STATE", loadBusinessRequest);
  yield neuTakeEvery("KYC_SUBMIT_BUSINESS_REQUEST", submitBusinessRequest);
}
