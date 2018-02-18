import { EthereumAddress } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";
import { WalletSubType, WalletType } from "./types";

export const web3Actions = {
  personalWalletDisconnected: () => createSimpleAction("PERSONAL_WALLET_DISCONNECTED"),

  newPersonalWalletPlugged: (
    type: WalletType,
    subtype: WalletSubType,
    ethereumAddress: EthereumAddress,
  ) => createAction("NEW_PERSONAL_WALLET_PLUGGED", { type, subtype, ethereumAddress }),
};
