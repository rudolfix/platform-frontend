import { take, all, fork, select, put } from "redux-saga/effects";
import { neuTake, forkAndInject } from "../../sagas";
import { TAction, actions } from "../../actions";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { symbols } from "../../../di/symbols";
import { LightWalletConnector, LightWalletUtil, ILightWallet } from "../../../lib/web3/LightWallet";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { IAppState } from "../../../store";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { WalletType } from "../../web3/types";
import { IPersonalWallet } from "../../../lib/web3/PersonalWeb3";

export const lightWalletLoginWatch = injectableFn(
  function*(
    web3Manager: Web3Manager,
    lightWalletConnector: LightWalletConnector,
    lightWalletUtil: LightWalletUtil,
    walletMetadataStorage: ObjectStorage<TWalletMetadata>,
  ) {
    while (true) {
      const action: TAction = yield neuTake("LIGHT_WALLET_LOGIN");
      if (action.type !== "LIGHT_WALLET_LOGIN") {
        continue;
      }
      const walletMetadata = walletMetadataStorage.get();
      if (!walletMetadata || walletMetadata.walletType !== WalletType.LIGHT) {
        continue;
      }

      const walletInstance: ILightWallet = yield lightWalletUtil.deserializeLightWalletVault(
        walletMetadata.vault,
        walletMetadata.salt,
      );

      const isValidPassword: boolean = yield LightWalletUtil.testWalletPassword(walletInstance, action.payload.password);
      if (!isValidPassword) {
        
      }
      //todo throw here on invalid password

      const lightWallet: IPersonalWallet = yield lightWalletConnector.connect(
        {
          walletInstance,
          salt: walletInstance.salt,
        },
        action.payload.password,
      );

      yield web3Manager.plugPersonalWallet(lightWallet);
      yield put(actions.wallet.connected());
    }
  },
  [
    symbols.web3Manager,
    symbols.lightWalletConnector,
    symbols.lightWalletUtil,
    symbols.walletMetadataStorage,
  ],
);

export function* lightWalletSagas(): Iterator<any> {
  yield all([forkAndInject(lightWalletLoginWatch)]);
}
