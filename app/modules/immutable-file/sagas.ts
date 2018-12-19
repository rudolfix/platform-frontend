import {fork} from "redux-saga/effects";

import {TGlobalDependencies} from "../../di/setupBindings";
import {TAction} from "../actions";
import {neuCall, neuTakeEvery} from "../sagasUtils";
import {downloadLink} from "./utils";
import {createMessage} from "../../components/translatedMessages/utils";
import {IpfsMessage} from "../../components/translatedMessages/messages";

export function* downloadFile(
  { apiImmutableStorage, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "IMMUTABLE_STORAGE_DOWNLOAD_FILE") return;
  try {
    const immutableFileId = action.payload.immutableFileId;
    const downloadedFile = yield apiImmutableStorage.getFile(immutableFileId);
    const extension = immutableFileId.asPdf ? ".pdf" : ".doc";

    yield neuCall(downloadLink, downloadedFile, action.payload.fileName, extension);
  } catch (e) {
    logger.error("Failed to download file from IPFS", e);
    notificationCenter.error(createMessage(IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE)); //Failed to download file from IPFS
  }
}

export const immutableFileSagas = function*(): any {
  yield fork(neuTakeEvery, "IMMUTABLE_STORAGE_DOWNLOAD_FILE", downloadFile);
};


