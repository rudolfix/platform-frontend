import { delay } from "bluebird";
import { effects } from "redux-saga";
import { cancel, fork, put, select, take } from "redux-saga/effects";
import { symbols } from "../../di/symbols";
import { ObjectStorage } from "../../lib/persistence/ObjectStorage";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
  TWalletMetadata,
} from "../../lib/persistence/WalletMetadataObjectStorage";
import { BrowserWalletConnector } from "../../lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { LightWalletConnector, LightWalletUtil } from "../../lib/web3/LightWallet";
import { IPersonalWallet } from "../../lib/web3/PersonalWeb3";
import { SignerError, Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { IAppState } from "../../store";
import { invariant } from "../../utils/invariant";
import { actions, TAction } from "../actions";
import { callAndInject, getDependency } from "../sagas";
import { selectIsLightWallet, selectIsUnlocked } from "../web3/reducer";
import { unlockWallet } from "../web3/sagas";
import { WalletType } from "../web3/types";
import { mapSignMessageErrorToErrorMessage } from "./errors";
import { selectIsSigning } from "./reducer";

export const ensureWalletConnection = injectableFn(
  async function(
    walletMetadata: ObjectStorage<TWalletMetadata>,
    web3Manager: Web3Manager,
    ledgerWalletConnector: LedgerWalletConnector,
    browserWalletConnector: BrowserWalletConnector,
    lightWalletConnector: LightWalletConnector,
  ): Promise<void> {
    if (web3Manager.personalWallet) {
      return;
    }
    const metadata = walletMetadata.get()!;

    invariant(metadata, "User has JWT but doesn't have wallet metadata!");

    let wallet: IPersonalWallet;
    switch (metadata.walletType) {
      case WalletType.LEDGER:
        wallet = await connectLedger(ledgerWalletConnector, web3Manager, metadata);
        break;
      case WalletType.BROWSER:
        wallet = await connectBrowser(browserWalletConnector, web3Manager, metadata);
        break;
      case WalletType.LIGHT:
        wallet = await connectLightWallet(lightWalletConnector, metadata);
        break;
      default:
        return invariant(false, "Wallet type unrecognized");
    }

    await web3Manager.plugPersonalWallet(wallet);
  },
  [
    symbols.walletMetadataStorage,
    symbols.web3Manager,
    symbols.ledgerWalletConnector,
    symbols.browserWalletConnector,
    symbols.lightWalletConnector,
  ],
);

async function connectLedger(
  ledgerWalletConnector: LedgerWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILedgerWalletMetadata,
): Promise<IPersonalWallet> {
  await ledgerWalletConnector.connect(web3Manager.networkId!);
  return await ledgerWalletConnector.finishConnecting(metadata.derivationPath);
}

async function connectBrowser(
  browserWalletConnector: BrowserWalletConnector,
  web3Manager: Web3Manager,
  // tslint:disable-next-line
  metadata: IBrowserWalletMetadata, // todo browser wallet should verify connected address
): Promise<IPersonalWallet> {
  return await browserWalletConnector.connect(web3Manager.networkId!);
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

function* messageSignSaga(message: string): Iterator<any> {
  const web3Manager: Web3Manager = yield getDependency(symbols.web3Manager);

  while (true) {
    try {
      yield callAndInject(ensureWalletConnection);

      const isLightWallet = yield select((s: IAppState) => selectIsLightWallet(s.web3State));
      if (isLightWallet) {
        yield* unlockLightWallet();
      }

      break;
    } catch (e) {
      yield effects.put(
        actions.signMessageModal.signingError(mapSignMessageErrorToErrorMessage(e)),
      );
      if (e instanceof SignerError) {
        throw e;
      }

      yield delay(500);
    }
  }
  const signedMessage = yield web3Manager.sign(message);
  yield put(actions.signMessageModal.signed(signedMessage));
}

export function* messageSign(message: string): any {
  const isSigning: boolean = yield select((s: IAppState) => selectIsSigning(s.signMessageModal));
  if (isSigning) {
    throw new Error("Signing already in progress");
  }
  yield put(actions.signMessageModal.show());

  const spawnedSaga = yield fork(messageSignSaga, message);

  const a: TAction = yield take(["SIGN_MESSAGE_MODAL_HIDE", "SIGN_MESSAGE_SIGNED"]);

  if (a.type === "SIGN_MESSAGE_MODAL_HIDE") {
    yield cancel(spawnedSaga);
    throw new Error("Signing interrupted");
  }
  if (a.type === "SIGN_MESSAGE_SIGNED") {
    yield effects.put(actions.signMessageModal.hide());
    return a.payload.msg;
  }
}

function* unlockLightWallet(): any {
  const acceptAction: TAction = yield take("SIGN_MESSAGE_ACCEPT");
  if (acceptAction.type !== "SIGN_MESSAGE_ACCEPT") {
    return;
  }
  const isUnlocked = yield select((s: IAppState) => selectIsUnlocked(s.web3State));

  if (!isUnlocked) {
    yield callAndInject(unlockWallet, acceptAction.payload.password);
  }
}
