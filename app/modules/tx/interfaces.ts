export interface IWithdrawDraftType {
  type: ETxSenderType.WITHDRAW;
  to: string;
  value: string;
}
export interface IInvestmentDraftType {
  type: ETxSenderType.INVEST;
}

export type IDraftType = IWithdrawDraftType | IInvestmentDraftType;

export enum ETxSenderType {
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
  ETO_SET_DATE = "ETO_SET_DATE",
}

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}
