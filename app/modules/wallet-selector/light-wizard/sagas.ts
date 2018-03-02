import { all, put } from "redux-saga/effects";
import { symbols } from "../../../di/symbols";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  LightWallet,
  LightWalletConnector,
  LightWalletUtil,
  LightWalletWrongPassword,
} from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { actions, TAction } from "../../actions";
import { forkAndInject, neuTake } from "../../sagas";
import { connectLightWallet } from "../../signMessageModal/sagas";
import { WalletType } from "../../web3/types";
import { mapLightWalletErrorToErrorMessage } from "./errors";

export const lightWalletLoginWatch = injectableFn(
  function*(
    web3Manager: Web3Manager,
    lightWalletConnector: LightWalletConnector,
    walletMetadataStorage: ObjectStorage<TWalletMetadata>,
  ): any {
    while (true) {
      const action: TAction = yield neuTake("LIGHT_WALLET_LOGIN");
      if (action.type !== "LIGHT_WALLET_LOGIN") {
        continue;
      }
      const walletMetadata = walletMetadataStorage.get();
      if (!walletMetadata || walletMetadata.walletType !== WalletType.LIGHT) {
        continue;
      }
      const { password } = action.payload;

      try {
        const wallet: LightWallet = yield connectLightWallet(
          lightWalletConnector,
          walletMetadata,
          password,
        );
        const isValidPassword: boolean = yield LightWalletUtil.testWalletPassword(
          wallet.vault.walletInstance,
          password,
        );
        if (!isValidPassword) {
          throw new LightWalletWrongPassword();
        }

        yield web3Manager.plugPersonalWallet(wallet);
        yield put(actions.wallet.connected());
      } catch (e) {
        yield put(actions.wallet.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)));
      }
    }
  },
  [symbols.web3Manager, symbols.lightWalletConnector, symbols.walletMetadataStorage],
);

export function* lightWalletSagas(): Iterator<any> {
  yield all([forkAndInject(lightWalletLoginWatch)]);
}
