import { all, put, select } from "redux-saga/effects";
import { symbols } from "../../../di/symbols";
import { VaultApi } from "../../../lib/api/vault/VaultApi";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import {
  ILightWalletMetadata,
  TWalletMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  LightWallet,
  LightWalletConnector,
  LightWalletUtil,
  LightWalletWrongPassword,
} from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { IAppState } from "../../../store";
import { invariant } from "../../../utils/invariant";
import { actions, TAction } from "../../actions";
import { callAndInject, forkAndInject, neuTake } from "../../sagas";
import { connectLightWallet } from "../../signMessageModal/sagas";
import { selectLightWalletFromQueryString } from "../../web3/reducer";
import { WalletType } from "../../web3/types";
import { mapLightWalletErrorToErrorMessage } from "./errors";
import { getVaultKey } from "./flows";

export const retrieveMetadataFromVaultAPI = injectableFn(
  async function(
    vaultApi: VaultApi,
    lightWalletUtil: LightWalletUtil,
    password: string,
    salt: string,
    email: string,
  ): Promise<ILightWalletMetadata> {
    const vaultKey = await getVaultKey(lightWalletUtil, salt, password);
    try {
      const vault = await vaultApi.retrieve(vaultKey);

      return {
        walletType: WalletType.LIGHT,
        salt,
        vault,
        email,
      };
    } catch {
      throw new LightWalletWrongPassword();
    }
  },
  [symbols.vaultApi, symbols.lightWalletUtil],
);

export const getWalletMetadata = injectableFn(
  function*(
    walletMetadataStorage: ObjectStorage<TWalletMetadata>,
    password: string,
  ): Iterator<any | ILightWalletMetadata | undefined> {
    const queryStringWalletInfo: { email: string; salt: string } | undefined = yield select(
      (s: IAppState) => selectLightWalletFromQueryString(s.router),
    );
    if (queryStringWalletInfo) {
      return yield callAndInject(
        retrieveMetadataFromVaultAPI,
        password,
        queryStringWalletInfo.salt,
        queryStringWalletInfo.email,
      );
    }

    const savedMetadata = walletMetadataStorage.get();
    if (savedMetadata && savedMetadata.walletType === WalletType.LIGHT) {
      return savedMetadata;
    }

    return undefined;
  },
  [symbols.walletMetadataStorage],
);

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
      const { password } = action.payload;
      try {
        const walletMetadata: ILightWalletMetadata | undefined = yield callAndInject(
          getWalletMetadata,
          password,
        );

        if (!walletMetadata) {
          invariant(walletMetadata, "Missing metadata");
          return;
        }
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

        walletMetadataStorage.set(walletMetadata);
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
