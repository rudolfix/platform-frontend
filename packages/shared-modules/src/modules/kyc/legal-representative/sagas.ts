import { put, TActionFromCreator } from "@neufund/sagas";

import { createMessage } from "../../../messages";
import { neuGetBindings } from "../../../utils";
import { coreModuleApi, IHttpResponse } from "../../core/module";
import { notificationUIModuleApi } from "../../notification-ui/module";
import { kycActions } from "../actions";
import { IKycFileInfo, IKycLegalRepresentative } from "../lib/http/kyc-api/KycApi.interfaces";
import { KycFlowMessage } from "../messages";
import { symbols } from "../symbols";

type TGlobalDependencies = unknown;

export function* loadLegalRepresentative(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<IKycLegalRepresentative> = yield apiKycService.getLegalRepresentative();
    yield put(kycActions.kycUpdateLegalRepresentative(false, result.body));
  } catch (e) {
    logger.error(e, "Failed to load KYC representative");

    yield put(kycActions.kycUpdateLegalRepresentative(false));
  }
}

export function* submitLegalRepresentative(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitLegalRepresentative>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateLegalRepresentative(true));
    const result: IHttpResponse<IKycLegalRepresentative> = yield apiKycService.putLegalRepresentative(
      {
        ...action.payload.data,
        // TODO: Remove when not needed. This adds additional fields required by backend
        isPoliticallyExposed:
          action.payload.data.isPoliticallyExposed !== true &&
          action.payload.data.isPoliticallyExposed !== false
            ? undefined
            : action.payload.data.isPoliticallyExposed,
        isHighIncome: false,
      },
    );
    yield put(kycActions.kycUpdateLegalRepresentative(false, result.body));
    yield put(kycActions.toggleLegalRepresentativeModal(false));
  } catch (e) {
    logger.error(e, "Failed to submit KYC legal representative");

    yield put(kycActions.kycUpdateLegalRepresentative(false));
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );
  }
}

export function* uploadLegalRepresentativeFile(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof kycActions,
    typeof kycActions.kycUploadLegalRepresentativeDocument
  >,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  const { file } = action.payload;
  try {
    yield put(kycActions.kycUpdateLegalRepresentativeDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadLegalRepresentativeDocument(
      file,
    );
    yield put(kycActions.kycUpdateLegalRepresentativeDocument(false, result.body));
  } catch (e) {
    logger.error(e, "Failed to upload KYC legal representative file");

    yield put(kycActions.kycUpdateLegalRepresentativeDocument(false));

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED)),
    );
  }
}

export function* loadLegalRepresentativeFiles(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });

  try {
    yield put(kycActions.kycUpdateLegalRepresentativeDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getLegalRepresentativeDocuments();
    yield put(kycActions.kycUpdateLegalRepresentativeDocuments(false, result.body));
  } catch (e) {
    logger.error(e, "Failed to load KYC legal representative file");

    yield put(kycActions.kycUpdateLegalRepresentativeDocuments(false));
  }
}
