import { APP_DISPATCH_SYMBOL } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch, IAppAction } from "../../store";
import { makeActionCreator, makeParameterlessActionCreator } from "../../storeHelpers";
import { EthereumAddress } from "../../types";
import {
  NOTIFICATION_CENTER_SYMBOL,
  NotificationCenter,
} from "../notifications/NotificationCenter";
import { WalletSubType, WalletType } from "./PersonalWeb3";

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

export const personalWalletDisconnectedAction = injectableFn(
  (dispatch: AppDispatch, notificationCenter: NotificationCenter) => {
    dispatch(personalWalletDisconnectedPlainAction());
    notificationCenter.error("Web3 disconnected!");
  },
  [APP_DISPATCH_SYMBOL, NOTIFICATION_CENTER_SYMBOL],
);
