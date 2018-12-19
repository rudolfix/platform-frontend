import { TMessage } from "../../components/translatedMessages/utils";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { createAction } from "../actionsUtils";
import {TMessage} from "../../components/translatedMessages/utils";

export const immutableStorageActions = {
  downloadImmutableFile: (immutableFileId: ImmutableFileId, fileName: TMessage | string) =>
    createAction("IMMUTABLE_STORAGE_DOWNLOAD_FILE", { immutableFileId, fileName }),
};
