import { createActionFactory } from "@neufund/shared-utils";

import { TMessage } from "../../components/translatedMessages/utils";
import { IImmutableFileId } from "../../lib/api/immutable-storage/ImmutableStorage.interfaces";

export const immutableStorageActions = {
  downloadImmutableFile: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_FILE",
    (immutableFileId: IImmutableFileId, fileName: TMessage | string, isProtected = false) => ({
      immutableFileId,
      fileName,
      isProtected,
    }),
  ),
  downloadDocumentStarted: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_DOCUMENT_STARTED",
    (ipfsHash: string) => ({ ipfsHash }),
  ),
  downloadImmutableFileDone: createActionFactory(
    "IMMUTABLE_STORAGE_DOWNLOAD_FILE_DONE",
    (ipfsHash: string) => ({ ipfsHash }),
  ),
};
