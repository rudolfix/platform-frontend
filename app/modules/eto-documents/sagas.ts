import { fork, put } from "redux-saga/effects";

import { UPLOAD_IMMUTABLE_DOCUMENT } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { downloadLink } from "../immutableFile/sagas";
import { neuCall, neuTakeEvery } from "../sagas";

export function* generateTemplate(
  { apiImmutableStorage, notificationCenter, logger, apiEtoFileService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_GENERATE_TEMPLATE") return;
  try {
    const immutableFileId = action.payload.immutableFileId;
    const templates = yield apiEtoFileService.getEtoTemplate({
      documentType: immutableFileId.documentType,
      name: immutableFileId.name,
      form: "template",
      ipfsHash: immutableFileId.ipfsHash,
      mimeType: immutableFileId.mimeType,
    });
    const generatedDocument = yield apiImmutableStorage.getFile({
      ...{
        ipfsHash: templates.ipfs_hash,
        mimeType: templates.mime_type,
        name: templates.name,
        placeholders: templates.placeholders,
      },
      asPdf: true,
    });
    yield neuCall(downloadLink, generatedDocument, immutableFileId.name, true);
  } catch (e) {
    logger.debug(e);
    notificationCenter.error("Failed to download file from IPFS");
  }
}

export function* loadEtoFileData({
  notificationCenter,
  apiEtoFileService,
}: TGlobalDependencies): any {
  try {
    const stateInfo = yield apiEtoFileService.getEtoFileStateInfo();
    const uploadedDocuments = yield apiEtoFileService.getAllEtoDocuments();
    const etoTemplates = yield apiEtoFileService.getAllEtoTemplates();
    yield put(
      actions.etoDocuments.loadEtoFileData({
        etoTemplates,
        uploadedDocuments,
        stateInfo,
      }),
    );
    yield put(actions.etoFlow.loadDataStart());
  } catch (e) {
    notificationCenter.error(
      "Could not access ETO files data. Make sure you have completed KYC and email verification process.",
    );
    yield put(actions.routing.goToDashboard());
  }
}

function* uploadEtoFile(
  {
    apiEtoFileService,
    notificationCenter,
    logger,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "ETO_FLOW_UPLOAD_DOCUMENT_START") return;
  const { file, document } = action.payload;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [UPLOAD_IMMUTABLE_DOCUMENT],
      formatIntlMessage("eto.modal.submit-description"),
    );
    const etoFiles = yield apiEtoFileService.uploadEtoDocument(file, document);
    // TODO Fix any!
    yield put(actions.etoDocuments.loadEtoFileData(etoFiles));
    notificationCenter.info(formatIntlMessage("eto.modal.file-uploaded"));
  } catch (e) {
    yield put(actions.etoDocuments.loadFileDataStart());
    logger.error("Failed to send ETO data", e);
    notificationCenter.error(formatIntlMessage("eto.modal.file-upload-failed"));
  } finally {
    yield put(actions.etoDocuments.hideIpfsModal());
  }
}

export function* etoDocumentsSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_GENERATE_TEMPLATE", generateTemplate);
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_FILE_DATA_START", loadEtoFileData);
  yield fork(neuTakeEvery, "ETO_FLOW_UPLOAD_DOCUMENT_START", uploadEtoFile);
}
