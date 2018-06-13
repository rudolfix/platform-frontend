import { TFileDescription } from "../../../lib/api/FileStorage.interfaces";
import { createAction } from "../../actionsUtils";

export const remoteFileActions = {
  getRemoteFile: (
    fileUrl: string,
    onDone: (error: any, fileDescription?: TFileDescription) => any,
  ) => createAction("REMOTE_FILE_GET", { fileUrl, onDone }),
};
