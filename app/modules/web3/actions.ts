import { IAppAction } from "../../store";
import { makeActionCreator, makeParameterlessActionCreator } from "../../storeHelpers";
import { EthereumAddress } from "../../types";
import { WalletSubType, WalletType } from "./PersonalWeb3";

export const web3Actions = {};

export interface INewPersonalWalletPluggedAction extends IAppAction {
  type: "NEW_PERSONAL_WALLET_PLUGGED";
  payload: {
    type: WalletType;
    subtype: WalletSubType;
    ethereumAddress: EthereumAddress;
  };
}
export const newPersonalWalletPluggedAction = makeActionCreator<INewPersonalWalletPluggedAction>(
  "NEW_PERSONAL_WALLET_PLUGGED",
);

export interface IPersonalWalletDisconnectedAction extends IAppAction {
  type: "PERSONAL_WALLET_DISCONNECTED";
}
export const personalWalletDisconnectedPlainAction = makeParameterlessActionCreator<
  IPersonalWalletDisconnectedAction
>("PERSONAL_WALLET_DISCONNECTED");
