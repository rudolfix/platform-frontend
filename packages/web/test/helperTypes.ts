export interface IWindowData {
  payoutRequiredAmount?: string;
  disableNotAcceptingEtherCheck?: boolean;
  forceLowGas?: boolean;
  forceStandardGas?: boolean;
  nfISHAConfidentialityAgreementsRequirements?: string;
  ethereum?: object;
}

export type IWindowWithData = IWindowData & Window;
