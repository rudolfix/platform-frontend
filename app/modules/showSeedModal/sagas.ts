import { Effect, put, select } from "redux-saga/effects";
import { symbols } from "../../di/symbols";
import { ObjectStorage } from "../../lib/persistence/ObjectStorage";
import {
  ILightWalletMetadata,
  TWalletMetadata,
} from "../../lib/persistence/WalletMetadataObjectStorage";
import { LightWalletConnector, LightWalletUtil } from "../../lib/web3/LightWallet";
import { IPersonalWallet } from "../../lib/web3/PersonalWeb3";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { IAppState } from "../../store";
import { invariant } from "../../utils/invariant";
import { actions, TAction } from "../actions";
import { callAndInject } from "../sagas";
import { selectIsUnlocked } from "../web3/reducer";
import { unlockWallet } from "../web3/sagas";
import { WalletType } from "../web3/types";
import { neuTakeEvery } from "./../sagas";
import { mapSignMessageErrorToErrorMessage } from "./errors";

export const ensureWalletConnection = injectableFn(
  async function(
    walletMetadata: ObjectStorage<TWalletMetadata>,
    web3Manager: Web3Manager,
    lightWalletConnector: LightWalletConnector,
  ): Promise<void> {
    if (web3Manager.personalWallet) {
      return;
    }
    const metadata = walletMetadata.get()!;

    invariant(metadata, "User has JWT but doesn't have wallet metadata!");
    let wallet: IPersonalWallet;
    switch (metadata.walletType) {
      case WalletType.LIGHT:
        wallet = await connectLightWallet(lightWalletConnector, metadata);
        break;
      default:
        return invariant(false, "Wallet type not lightWallet");
    }

    await web3Manager.plugPersonalWallet(wallet);
  },
  [symbols.walletMetadataStorage, symbols.web3Manager, symbols.lightWalletConnector],
);

export async function connectLightWallet(
  lightWalletConnector: LightWalletConnector,
  metadata: ILightWalletMetadata,
  password?: string,
): Promise<IPersonalWallet> {
  const lightWalletUtils = new LightWalletUtil();
  const walletInstance = await lightWalletUtils.deserializeLightWalletVault(
    metadata.vault,
    metadata.salt,
  );

  return await lightWalletConnector.connect(
    {
      walletInstance,
      salt: metadata.salt,
    },
    metadata.email,
    password,
  );
}

function* unlockLightWallet(action: TAction): Iterator<any> {
  if (action.type !== "SEED_ACCEPT") return;
  yield callAndInject(ensureWalletConnection);

  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3State));
  try {
    if (!isUnlocked) {
      yield callAndInject(unlockWallet, action.payload.password);
    }
  } catch (e) {
    yield put(actions.showSeedModal.seedModelError(mapSignMessageErrorToErrorMessage(e)));
  }
}

export function* viewSeedSaga(): Iterator<Effect> {
  yield neuTakeEvery("SEED_ACCEPT", unlockLightWallet);
}
