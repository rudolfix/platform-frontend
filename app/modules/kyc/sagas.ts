import { effects } from "redux-saga";

import { actions, TAction } from "../actions";

import { callAndInject, getDependency, neuTake } from "../sagas";

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

const notify = injectableFn(
  function*(notificationCenter: NotificationCenter, message: string): Iterator<any> {
    notificationCenter.error(message);
  },
  [symbols.notificationCenter],
);

/**
 * Individual Request
 */
function* loadIndividualData(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_INDIVIDUAL_DATA");
    if (action.type !== "KYC_LOAD_INDIVIDUAL_DATA") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateIndividualData(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycIndividualData> = yield kcyService.getIndividualData();
      yield effects.put(actions.kyc.kycUpdateIndividualData(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateIndividualData(false));
    }
  }
}

function* submitIndividualData(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_INDIVIDUAL_FORM");
    if (action.type !== "KYC_SUBMIT_INDIVIDUAL_FORM") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycIndividualData> = yield kcyService.putIndividualData(
        action.payload.data,
      );
      yield effects.put(actions.kyc.kycUpdateIndividualData(false, result.body));
      yield effects.put(actions.routing.goToKYCIndividualUpload());
    } catch (_e) {
      yield callAndInject(notify, "There was a problem sending your data. Please try again.");
    }
  }
}

function* uploadIndividualFile(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_UPLOAD_INDIVIDUAL_FILE");
    if (action.type !== "KYC_UPLOAD_INDIVIDUAL_FILE") {
      continue;
    }
    const { file } = action.payload;
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateIndividualDocument(true));
      const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadIndividualDocument(file);
      yield effects.put(actions.kyc.kycUpdateIndividualDocument(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateIndividualDocument(false));
    }
  }
}

function* loadIndividualFiles(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_INDIVIDUAL_FILE_LIST");
    if (action.type !== "KYC_LOAD_INDIVIDUAL_FILE_LIST") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateIndividualDocuments(true));
      const result: IHttpResponse<IKycFileInfo[]> = yield kcyService.getIndividualDocuments();
      yield effects.put(actions.kyc.kycUpdateIndividualDocuments(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateIndividualDocuments(false));
    }
  }
}

function* loadIndividualRequest(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_INDIVIDUAL_REQUEST_STATE");
    if (action.type !== "KYC_LOAD_INDIVIDUAL_REQUEST_STATE") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateIndividualRequestState(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycRequestState> = yield kcyService.getIndividualRequest();
      yield effects.put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateIndividualRequestState(false));
    }
  }
}

function* submitIndividualRequest(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_INDIVIDUAL_REQUEST");
    if (action.type !== "KYC_SUBMIT_INDIVIDUAL_REQUEST") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateIndividualRequestState(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycRequestState> = yield kcyService.submitIndividualRequest();
      yield effects.put(actions.kyc.kycUpdateIndividualRequestState(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateIndividualRequestState(false));
      yield callAndInject(notify, "There was a problem submitting your request. Please try again.");
    }
  }
}

/**
 * Company Request
 */

// legal representative
function* loadLegalRepresentative(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_LEGAL_REPRESENTATIVE");
    if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateLegalRepresentative(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<
        IKycLegalRepresentative
      > = yield kcyService.getLegalRepresentative();
      yield effects.put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateLegalRepresentative(false));
    }
  }
}

function* submitLegalRepresentative(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_LEGAL_REPRESENTATIVE");
    if (action.type !== "KYC_SUBMIT_LEGAL_REPRESENTATIVE") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<
        IKycLegalRepresentative
      > = yield kcyService.putLegalRepresentative(action.payload.data);
      yield effects.put(actions.kyc.kycUpdateLegalRepresentative(false, result.body));
    } catch (_e) {
      yield callAndInject(notify, "There was a problem sending your data. Please try again.");
    }
  }
}

function* uploadLegalRepresentativeFile(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE");
    if (action.type !== "KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE") {
      continue;
    }
    const { file } = action.payload;
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateLegalRepresentativeDocument(true));
      const result: IHttpResponse<
        IKycFileInfo
      > = yield kcyService.uploadLegalRepresentativeDocument(file);
      yield effects.put(actions.kyc.kycUpdateLegalRepresentativeDocument(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateLegalRepresentativeDocument(false));
    }
  }
}

function* loadLegalRepresentativeFiles(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST");
    if (action.type !== "KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateLegalRepresentativeDocuments(true));
      const result: IHttpResponse<
        IKycFileInfo[]
      > = yield kcyService.getLegalRepresentativeDocuments();
      yield effects.put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateLegalRepresentativeDocuments(false));
    }
  }
}

// business data
function* setBusinessType(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SET_BUSINESS_TYPE");
    if (action.type !== "KYC_SET_BUSINESS_TYPE") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateBusinessData(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      let institutionData: IKycBusinessData = {};
      try {
        const result: IHttpResponse<IKycBusinessData> = yield kcyService.getBusinessData();
        institutionData = result.body;
      } catch (_e) {}
      institutionData = { ...institutionData, legalFormType: action.payload.type };
      yield kcyService.putBusinessData(institutionData);
      yield effects.put(actions.kyc.kycUpdateBusinessData(false, institutionData));
      yield effects.put(actions.routing.goToKYCLegalRepresentative());
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBusinessData(false));
    }
  }
}

// legal representative
function* loadBusinessData(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_BUSINESS_DATA");
    if (action.type !== "KYC_LOAD_BUSINESS_DATA") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateBusinessData(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycBusinessData> = yield kcyService.getBusinessData();
      yield effects.put(actions.kyc.kycUpdateBusinessData(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBusinessData(false));
    }
  }
}

function* submitBusinessData(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_BUSINESS_DATA");
    if (action.type !== "KYC_SUBMIT_BUSINESS_DATA") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycBusinessData> = yield kcyService.putBusinessData(
        action.payload.data,
      );
      yield effects.put(actions.kyc.kycUpdateBusinessData(false, result.body));
    } catch (_e) {
      yield callAndInject(notify, "There was a problem sending your data. Please try again.");
    }
  }
}

function* uploadBusinessFile(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_UPLOAD_BUSINESS_FILE");
    if (action.type !== "KYC_UPLOAD_BUSINESS_FILE") {
      continue;
    }
    const { file } = action.payload;
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBusinessDocument(true));
      const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadBusinessDocument(file);
      yield effects.put(actions.kyc.kycUpdateBusinessDocument(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBusinessDocument(false));
    }
  }
}

function* loadBusinessFiles(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_BUSINESS_FILE_LIST");
    if (action.type !== "KYC_LOAD_BUSINESS_FILE_LIST") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBusinessDocuments(true));
      const result: IHttpResponse<IKycFileInfo[]> = yield kcyService.getBusinessDocuments();
      yield effects.put(actions.kyc.kycUpdateBusinessDocuments(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBusinessDocuments(false));
    }
  }
}

// beneficial owners
function* loadBeneficialOwners(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_BENEFICIAL_OWNERS");
    if (action.type !== "KYC_LOAD_BENEFICIAL_OWNERS") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBeneficialOwners(true));
      const result: IHttpResponse<IKycBeneficialOwner[]> = yield kcyService.getBeneficialOwners();
      yield effects.put(actions.kyc.kycUpdateBeneficialOwners(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBeneficialOwners(false));
    }
  }
}

function* createBeneficialOwner(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_ADD_BENEFICIAL_OWNER");
    if (action.type !== "KYC_ADD_BENEFICIAL_OWNER") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(true));
      const result: IHttpResponse<IKycBeneficialOwner> = yield kcyService.postBeneficialOwner({});
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(false));
    }
  }
}

function* submitBeneficialOwner(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_BENEFICIAL_OWNER");
    if (action.type !== "KYC_SUBMIT_BENEFICIAL_OWNER") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(true));
      const result: IHttpResponse<IKycBeneficialOwner> = yield kcyService.putBeneficialOwner(
        action.payload.owner,
      );
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(false, result.body.id, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(false));
    }
  }
}

function* deleteBeneficalOwner(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_DELETE_BENEFICIAL_OWNER");
    if (action.type !== "KYC_DELETE_BENEFICIAL_OWNER") {
      continue;
    }
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(true));
      yield kcyService.deleteBeneficialOwner(action.payload.id);
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(false, action.payload.id, undefined));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBeneficialOwner(false));
    }
  }
}

function* uploadBeneficialOwnerFile(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_UPLOAD_BENEFICIAL_OWNER_FILE");
    if (action.type !== "KYC_UPLOAD_BENEFICIAL_OWNER_FILE") {
      continue;
    }
    const { boid, file } = action.payload;
    try {
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      yield effects.put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, true));
      const result: IHttpResponse<IKycFileInfo> = yield kcyService.uploadBeneficialOwnerDocument(
        boid,
        file,
      );
      yield effects.put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBeneficialOwnerDocument(boid, false));
    }
  }
}

function* executeLoadBeneficialOwnerFiles(boid: string): Iterator<any> {
  try {
    const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
    yield effects.put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, true));
    const result: IHttpResponse<IKycFileInfo[]> = yield kcyService.getBeneficialOwnerDocuments(
      boid,
    );
    yield effects.put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false, result.body));
  } catch (_e) {
    yield effects.put(actions.kyc.kycUpdateBeneficialOwnerDocuments(boid, false));
  }
}

function* loadBeneficialOwnerFiles(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST");
    if (action.type !== "KYC_LOAD_BENEFICIAL_OWNER_FILE_LIST") {
      continue;
    }
    const { boid } = action.payload;
    yield effects.fork(executeLoadBeneficialOwnerFiles, boid);
  }
}

// request
function* loadBusinessRequest(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_LOAD_BUSINESS_REQUEST_STATE");
    if (action.type !== "KYC_LOAD_BUSINESS_REQUEST_STATE") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateBusinessRequestState(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycRequestState> = yield kcyService.getBusinessRequest();
      yield effects.put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBusinessRequestState(false));
    }
  }
}

function* submitBusinessRequest(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_BUSINESS_REQUEST");
    if (action.type !== "KYC_SUBMIT_BUSINESS_REQUEST") {
      continue;
    }
    try {
      yield effects.put(actions.kyc.kycUpdateBusinessRequestState(true));
      const kcyService: KycApi = yield effects.call(getDependency, symbols.apiKycService);
      const result: IHttpResponse<IKycRequestState> = yield kcyService.submitBusinessRequest();
      yield effects.put(actions.kyc.kycUpdateBusinessRequestState(false, result.body));
    } catch (_e) {
      yield effects.put(actions.kyc.kycUpdateBusinessRequestState(false));
      yield callAndInject(notify, "There was a problem submitting your request. Please try again.");
    }
  }
}

export const kycSagas = function* routingSagas(): Iterator<effects.Effect> {
  yield effects.all([
    // individual
    effects.fork(loadIndividualData),
    effects.fork(submitIndividualData),

    effects.fork(uploadIndividualFile),
    effects.fork(loadIndividualFiles),

    effects.fork(loadIndividualRequest),
    effects.fork(submitIndividualRequest),

    // company
    effects.fork(loadLegalRepresentative),
    effects.fork(submitLegalRepresentative),
    effects.fork(uploadLegalRepresentativeFile),
    effects.fork(loadLegalRepresentativeFiles),

    effects.fork(loadBusinessData),
    effects.fork(submitBusinessData),
    effects.fork(uploadBusinessFile),
    effects.fork(loadBusinessFiles),

    effects.fork(loadBeneficialOwners),
    effects.fork(createBeneficialOwner),
    effects.fork(deleteBeneficalOwner),
    effects.fork(submitBeneficialOwner),
    effects.fork(loadBeneficialOwnerFiles),
    effects.fork(uploadBeneficialOwnerFile),

    effects.fork(submitBusinessRequest),
    effects.fork(loadBusinessRequest),
    effects.fork(setBusinessType),
  ]);
};
