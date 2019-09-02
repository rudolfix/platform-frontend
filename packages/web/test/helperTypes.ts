export interface IWindowData {
  payoutRequiredAmount?: string;
  disableNotAcceptingEtherCheck?: boolean;
  forceLowGas?: boolean;
  forceStandardGas?: boolean;
}

export type IWindowWithData = IWindowData & Window;
