import { ECompanyDocumentType, EJwtPermissions } from "@neufund/shared-modules";
import { addHexPrefix } from "@walletconnect/utils";
import {
  EtoDocumentsMessage,
  EVotingErrorMessage,
} from "../../../components/translatedMessages/messages";
import {
  createMessage,
  createNotificationMessage,
} from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { TActionFromCreator } from "../../actions";
import { actions } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../../auth/jwt/sagas";
import { webNotificationUIModuleApi } from "../../notification-ui/module";
import { neuCall } from "../../sagasUtils";
import { put } from "@neufund/sagas";
import cryptoRandomString from "crypto-random-string";

function* uploadResolutionDocumentEffect(
  { apiEtoFileService }: TGlobalDependencies,
  file: File,
): Generator<any, any, any> {
  const response = yield apiEtoFileService.uploadCompanyDocument(
    file,
    ECompanyDocumentType.RESOLUTION_DOCUMENT,
  );

  yield put(actions.uploadResolutionDocumentSuccess(response));
}

export function* uploadResolutionDocument(
  action: TActionFromCreator<typeof actions.uploadResolutionDocument>,
): Generator<any, any, any> {
  const { file } = action.payload;

  const resolutionId = addHexPrefix(cryptoRandomString({ length: 64 }));

  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(uploadResolutionDocumentEffect, file, resolutionId),
      [EJwtPermissions.UPLOAD_ISSUER_IMMUTABLE_DOCUMENT],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE),
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION),
    );


    yield put(
      webNotificationUIModuleApi.actions.showInfo(
        createNotificationMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FILE_UPLOADED),
      ),
    );
  } catch (e) {
    logger.error(e, "Failed to send ETO data");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EVotingErrorMessage.FAILED_TO_UPLOAD_RESOLUTION_DOCUMENT),
      ),
    );

    yield put(actions.uploadResolutionDocumentError());
  }
}
