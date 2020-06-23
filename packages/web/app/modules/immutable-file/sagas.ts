import { call, fork, put, SagaGenerator } from "@neufund/sagas";

import { IpfsMessage } from "../../components/translatedMessages/messages";
import { createNotificationMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { TFileDescription } from "../../lib/api/file-storage/FileStorage.interfaces";
import { IImmutableFileId } from "../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions, TActionFromCreator } from "../actions";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { downloadLink } from "./utils";

export function* getFile(
  { apiImmutableStorage }: TGlobalDependencies,
  immutableFileId: IImmutableFileId,
  isProtected: boolean,
): SagaGenerator<TFileDescription> {
  if (isProtected) {
    return yield* call([apiImmutableStorage, "getProtectedFile"], immutableFileId);
  }

  return yield* call([apiImmutableStorage, "getFile"], immutableFileId);
}

export function* downloadFile(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.immutableStorage.downloadImmutableFile>,
): Generator<any, any, any> {
  try {
    const immutableFileId = action.payload.immutableFileId;

    const downloadedFile = yield neuCall(getFile, immutableFileId, action.payload.isProtected);

    const extension = immutableFileId.asPdf ? ".pdf" : ".doc";

    yield call(downloadLink, downloadedFile, action.payload.fileName, extension);
  } catch (e) {
    logger.error(e, "Failed to download file from IPFS");

    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE),
      ),
    );
  } finally {
    yield put(
      actions.immutableStorage.downloadImmutableFileDone(action.payload.immutableFileId.ipfsHash),
    );
  }
}

export function* immutableFileSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.immutableStorage.downloadImmutableFile, downloadFile);
}
