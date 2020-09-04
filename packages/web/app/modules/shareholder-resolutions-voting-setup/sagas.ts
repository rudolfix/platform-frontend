import { put, SagaGenerator, takeEvery } from "@neufund/sagas";
import { coreModuleApi, EJwtPermissions, neuGetBindings } from "@neufund/shared-modules";
import {
  EtoDocumentsMessage,
  EVotingErrorMessage
} from "../../components/translatedMessages/messages";
import { createMessage, createNotificationMessage } from "../../components/translatedMessages/utils";
import { symbols } from "../../di/symbols";
import { TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { neuCall } from "../sagasUtils";
import { actions } from "./actions";
import { shareholderResolutionsVotingSetupModuleApi } from "./module";

function* uploadImmutableDocument(_, file) {
  const { apiImmutableStorage } = yield* neuGetBindings({
    apiImmutableStorage: symbols.apiImmutableStorage,
  });

  const response = yield apiImmutableStorage.uploadFile("pdf", file);
  console.log(response);
}

function* uploadResolutionDocument(
  action: TActionFromCreator<typeof actions.uploadResolutionDocument>,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    console.log("uploadResolutionDocument");
    const { file } = action.payload;

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(uploadImmutableDocument, file),
      [EJwtPermissions.UPLOAD_IMMUTABLE_DOCUMENT],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE),
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION),
    );
  } catch (e) {
    logger.error("Failed to upload resolution document");
    yield put(actions.uploadResolutionDocumentError());
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EVotingErrorMessage.FAILED_TO_UPLOAD_RESOLUTION_DOCUMENT),
      ),
    );
  }
}

export function* shareholderResolutionsVotingSetupSagas(): SagaGenerator<void> {
  yield takeEvery(
    shareholderResolutionsVotingSetupModuleApi.actions.uploadResolutionDocument,
    uploadResolutionDocument,
  );
}
