import { fork, neuTakeLatest, put, take, call, TActionFromCreator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ITransactionResponse } from "../eth/lib/types";
import { walletEthModuleApi } from "../eth/module";
import { signerUIActions } from "./actions";
import { ESignerType } from "./types";

function* sign(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof signerUIActions, typeof signerUIActions.sign>,
): Generator<unknown, void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  const payload = action.payload;

  try {
    // wait until signing request get's approved by the user
    yield take(signerUIActions.approved);

    switch (payload.signerType) {
      case ESignerType.WC_SESSION_REQUEST: {
        const address = yield ethManager.getPluggedWalletAddress();
        const chainId = yield ethManager.getChainId();

        yield put(signerUIActions.signed(payload.signerType, { address, chainId }));

        break;
      }
      case ESignerType.SIGN_MESSAGE: {
        const signedData = yield ethManager.signMessageHash(payload.data);

        yield put(signerUIActions.signed(payload.signerType, { signedData }));

        break;
      }
      case ESignerType.SEND_TRANSACTION: {
        const transactionResponse: ITransactionResponse = yield* call(() =>
          ethManager.sendTransaction(payload.data.transaction),
        );

        yield put(
          signerUIActions.signed(payload.signerType, {
            transactionHash: transactionResponse.hash,
          }),
        );

        break;
      }
    }
  } catch (e) {
    logger.error(`Failed to sign ${payload.signerType}`, e);

    // in case of an error deny signing request
    // TODO: handle signing error on UI
    yield put(signerUIActions.denied());
  }
}

export function* signedUISaga(): Generator<unknown, void> {
  yield fork(neuTakeLatest, signerUIActions.sign, sign);
}
