import { put, SagaGenerator, takeEvery, call, select } from "@neufund/sagas";
import { coreModuleApi, EJwtPermissions, neuGetBindings } from "@neufund/shared-modules";
import { convertFromUlps, convertToUlps } from "@neufund/shared-utils";
import {
  EtoDocumentsMessage,
  EVotingErrorMessage,
} from "../../components/translatedMessages/messages";
import {
  createMessage,
  createNotificationMessage,
} from "../../components/translatedMessages/utils";
import { symbols } from "../../di/symbols";
import { IControllerGovernance } from "../../lib/contracts/IControllerGovernance";
import { TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { selectIssuerEto } from "../eto-flow/selectors";
import { selectGovernanceController } from "../governance/sagas";
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
  const { logger, etoFileApi } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    console.log("uploadResolutionDocument");
    const { file } = action.payload;

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(uploadImmutableDocument, file),
      [EJwtPermissions.UPLOAD_ISSUER_IMMUTABLE_DOCUMENT],
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

export function* getShareCapital() {
  const eto = yield select(selectIssuerEto);
  console.log({ eto });
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );
  console.log({ governanceController });
  const [shareCapital] = yield governanceController.shareholderInformation();
  yield put(
    shareholderResolutionsVotingSetupModuleApi.actions.setShareCapital(
      convertFromUlps(shareCapital.toString()).toString(),
    ),
  );
}

export function* shareholderResolutionsVotingSetupSagas(): SagaGenerator<void> {
  yield takeEvery(
    shareholderResolutionsVotingSetupModuleApi.actions.getShareCapital,
    getShareCapital,
  );
  yield takeEvery(
    shareholderResolutionsVotingSetupModuleApi.actions.uploadResolutionDocument,
    uploadResolutionDocument,
  );
}
