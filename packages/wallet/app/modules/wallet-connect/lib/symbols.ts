import { createLibSymbol } from "@neufund/shared-modules";

import { AppSingleKeyStorage } from "modules/storage";

import { WalletConnectManager } from "./WalletConnectManager";
import { TWalletSession } from "./schemas";

export const symbols = {};

export const privateSymbols = {
  walletConnectManager: createLibSymbol<WalletConnectManager>("walletConnectManager"),
  walletConnectSessionStorage: createLibSymbol<AppSingleKeyStorage<TWalletSession>>(
    "walletConnectSessionStorage",
  ),
};
