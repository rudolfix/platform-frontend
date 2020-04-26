import { call } from "@neufund/sagas";

import { TGlobalDependencies } from "../../../../di/setupBindings";

export function* detectWeb3({
  browserWalletConnector,
}: TGlobalDependencies): Generator<any, boolean, any> {
  const browserWallet = yield* call(() => browserWalletConnector.detectWeb3());
  return !!browserWallet.injectedWeb3Provider;
}
