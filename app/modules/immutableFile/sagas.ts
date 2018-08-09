import { saveAs } from "file-saver";
import { effects } from "redux-saga";
import { fork } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { signMessage } from "../accessWallet/sagas";
import { TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";

export function* downloadFile(
  { apiImmutableStorage, notificationCenter,logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "IMMUTABLE_STORAGE_DOWNLOAD_FILE") return;
  try {
    const immutableFileId = action.payload.immutableFileId;
    const test = yield apiImmutableStorage.getFile(immutableFileId);
    yield neuCall(downloadLink, test.body, immutableFileId.name, immutableFileId.asPdf);
  } catch (e) {
    logger.debug(e)
    notificationCenter.error("Failed to download file from IPFS")
  }
}

export function downloadLink(
  _deps: TGlobalDependencies,
  blob: Blob,
  name: string,
  isPdf: boolean,
): void {
  const fileExtention = isPdf ? ".pdf" : ".docx";
  saveAs(blob, name + fileExtention);
}

//
export const immutableFileSagas = function*(): any {
  yield fork(neuTakeEvery, "IMMUTABLE_STORAGE_DOWNLOAD_FILE", downloadFile);
};
