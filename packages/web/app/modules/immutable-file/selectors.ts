import { TAppGlobalState } from "../../store";

export const selectPendingDownloads = (state: TAppGlobalState): { [ipfsHash: string]: boolean } =>
  state.immutableStorage.pendingDownloads;
