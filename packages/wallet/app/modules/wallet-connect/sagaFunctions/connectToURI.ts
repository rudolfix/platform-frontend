// TODO: Fix unsafe assignment and unsafe member access
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
import { call, put, race, TActionFromCreator, take } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { notificationUIModuleApi } from "modules/notification-ui/module";
import { signerUIModuleApi } from "modules/signer-ui/module";
import { ESignerType } from "modules/signer-ui/types";
import { walletConnectActions } from "modules/wallet-connect/actions";
import { privateSymbols } from "modules/wallet-connect/lib/symbols";
import {
  InvalidWalletConnectUriError,
  isValidWalletConnectUri,
} from "modules/wallet-connect/lib/utils";

import { EAppRoutes } from "router/appRoutes";
import { navigate } from "router/routeUtils";

import { connectEvents } from "./connectEvents";

export function* connectToURI(
  action: TActionFromCreator<
    typeof walletConnectActions,
    typeof walletConnectActions.connectToPeer
  >,
): Generator<unknown, void> {
  const { walletConnectManager, logger } = yield* neuGetBindings({
    walletConnectManager: privateSymbols.walletConnectManager,
    logger: coreModuleApi.symbols.logger,
  });

  const uri = action.payload.uri;

  try {
    if (!isValidWalletConnectUri(uri)) {
      throw new InvalidWalletConnectUriError();
    }

    navigate(EAppRoutes.home);

    const session = yield* call(() => walletConnectManager.createSession(uri));

    yield put(
      signerUIModuleApi.actions.sign({
        type: ESignerType.WC_SESSION_REQUEST,
        data: {
          peerId: session.peer.id,
          peerName: session.peer.meta.name,
          peerUrl: session.peer.meta.url,
        },
      }),
    );

    const { approved, denied } = yield* race({
      approved: take(signerUIModuleApi.actions.signed),
      denied: take(signerUIModuleApi.actions.denied),
    });

    if (approved) {
      const { chainId, address } = approved.payload.data;
      const walletConnectAdapter = session.approveSession(chainId, address);
      yield* call(connectEvents, walletConnectAdapter);
    }

    if (denied) {
      session.rejectSession();
      logger.info(`Wallet connect session rejected`);
    }
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showInfo("Failed to start session with wallet connect"),
    );
    logger.error(e, `Failed to connect to a new URI`);
  }
}
