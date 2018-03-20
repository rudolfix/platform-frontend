import { Effect, fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ILightWalletMetadata } from "../../lib/persistence/WalletMetadataObjectStorage";
import { LightWalletConnector, LightWalletUtil } from "../../lib/web3/LightWallet";
import { IPersonalWallet } from "../../lib/web3/PersonalWeb3";
import { IAppState } from "../../store";
import { invariant } from "../../utils/invariant";
import { actions, TAction } from "../actions";
import { selectIsUnlocked } from "../web3/reducer";
import { unlockWallet } from "../web3/sagas";
import { WalletType } from "../web3/types";
import { neuCall, neuTakeEvery } from "./../sagas";
import { mapSignMessageErrorToErrorMessage } from "./errors";

export async function ensureWalletConnection({
  web3Manager,
  walletMetadataStorage,
  lightWalletConnector,
}: TGlobalDependencies): Promise<void> {
  if (web3Manager.personalWallet) {
    return;
  }

  /* tslint:disable: no-useless-cast */
  const metadata = walletMetadataStorage.get()!;
  /* tslint:enable: no-useless-cast */

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
}

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

function* unlockLightWallet(_deps: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "SEED_ACCEPT") return;
  yield neuCall(ensureWalletConnection);

  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3State));
  try {
    if (!isUnlocked) {
      yield neuCall(unlockWallet, action.payload.password);
    }
  } catch (e) {
    yield put(actions.showSeedModal.seedModelError(mapSignMessageErrorToErrorMessage(e)));
  }
}

export function* viewSeedSaga(): Iterator<Effect> {
  yield fork(neuTakeEvery, "SEED_ACCEPT", unlockLightWallet);
}
