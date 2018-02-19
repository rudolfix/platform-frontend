import { delay, effects } from "redux-saga";

import { actions, TAction } from "../actions";

import { getDependency, neuTake } from "../sagas";

import { symbols } from "../../di/symbols";
import { IApiKycService } from "../../lib/api/kyc/interfaces";

function* submitCompanyForm(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_COMPANY_FORM");
    if (action.type !== "KYC_SUBMIT_COMPANY_FORM") {
      continue;
    }
    const kcyService: IApiKycService = yield effects.call(getDependency, symbols.apiKycService);
    yield effects.call(kcyService.submitCompanyData, action.payload.data);
    yield effects.put(actions.routing.goToKYCCompanyDone());
  }
}

function* submitPersonalForm(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_PERSONAL_FORM");
    if (action.type !== "KYC_SUBMIT_PERSONAL_FORM") {
      continue;
    }
    const kcyService: IApiKycService = yield effects.call(getDependency, symbols.apiKycService);
    yield effects.call(kcyService.submitPersonalData, action.payload.data);
    yield effects.put(actions.routing.goToKYCPersonalInstantId());
  }
}

function* startInstantID(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_START_PERSONAL_INSTANT_ID");
    if (action.type !== "KYC_START_PERSONAL_INSTANT_ID") {
      continue;
    }
    const kcyService: IApiKycService = yield effects.call(getDependency, symbols.apiKycService);
    yield effects.call(kcyService.startPersonalInstantId);
    yield effects.put(actions.routing.goToKYCPersonalDone());
  }
}

function* submitManualVerificationForm(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_SUBMIT_MANUAL_VERIFICATION_FORM");
    if (action.type !== "KYC_SUBMIT_MANUAL_VERIFICATION_FORM") {
      continue;
    }
    const kcyService: IApiKycService = yield effects.call(getDependency, symbols.apiKycService);
    yield effects.call(kcyService.submitManualVerificationData, action.payload.data);
    yield effects.put(actions.routing.goToKYCManualVerificationIDUpload());
  }
}

function* uploadID(): Iterator<any> {
  while (true) {
    const action: TAction = yield neuTake("KYC_UPLOAD_ID");
    if (action.type !== "KYC_UPLOAD_ID") {
      continue;
    }
    // simulate some kind of request
    yield delay(1000);
    yield effects.put(actions.routing.goToKYCPersonalDone());
  }
}

export const kycSagas = function* routingSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(submitCompanyForm),
    effects.fork(submitPersonalForm),
    effects.fork(startInstantID),
    effects.fork(submitManualVerificationForm),
    effects.fork(uploadID),
  ]);
};
