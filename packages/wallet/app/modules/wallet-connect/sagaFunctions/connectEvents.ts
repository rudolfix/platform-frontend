// TODO: Fix unsafe assignment and unsafe member access
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */
import { call, cancel, takeOnly, put, race, SagaGenerator, take } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import { assertNever, nonNullable } from "@neufund/shared-utils";

import { notificationUIModuleApi } from "modules/notification-ui/module";
import { signerUIModuleApi } from "modules/signer-ui/module";
import { ESignerType } from "modules/signer-ui/types";
import { reduxify } from "modules/utils";
import { walletConnectActions } from "modules/wallet-connect/actions";
import { WalletConnectAdapter } from "modules/wallet-connect/lib/WalletConnectAdapter";
import { privateSymbols } from "modules/wallet-connect/lib/symbols";
import {
  EWalletConnectAdapterEvents,
  TWalletConnectAdapterEmit,
} from "modules/wallet-connect/lib/types";

export function* watchWalletConnectEvents(wcAdapter: WalletConnectAdapter): SagaGenerator<void> {
  const channel = reduxify<TWalletConnectAdapterEmit>(wcAdapter);

  while (true) {
    const managerEvent: TWalletConnectAdapterEmit = yield* take(channel);

    switch (managerEvent.type) {
      case EWalletConnectAdapterEvents.SIGN_MESSAGE: {
        yield put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SIGN_MESSAGE,
            data: managerEvent.payload,
          }),
        );

        const { approved, denied } = yield* race({
          approved: take(signerUIModuleApi.actions.signed),
          denied: take(signerUIModuleApi.actions.denied),
        });

        if (approved) {
          managerEvent.meta.approveRequest(approved.payload.data.signedData);
        }

        if (denied) {
          managerEvent.meta.rejectRequest();
        }

        break;
      }

      case EWalletConnectAdapterEvents.SEND_TRANSACTION: {
        yield put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SEND_TRANSACTION,
            data: managerEvent.payload,
          }),
        );

        const { approved, denied } = yield* race({
          approved: take(signerUIModuleApi.actions.signed),
          denied: take(signerUIModuleApi.actions.denied),
        });

        if (approved) {
          managerEvent.meta.approveRequest(approved.payload.data.transactionHash);
        }

        if (denied) {
          managerEvent.meta.rejectRequest();
        }

        break;
      }

      case EWalletConnectAdapterEvents.CONNECTED: {
        // Nothing to do on UI
        break;
      }
      case EWalletConnectAdapterEvents.DISCONNECTED: {
        // stop all watchers and disconnect
        yield cancel();
        break;
      }
      default:
        assertNever(managerEvent, "Invalid wallet connect event");
    }
  }
}

export function* connectEvents(wcAdapter: WalletConnectAdapter): SagaGenerator<void> {
  let silentDisconnect;
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    walletConnectSessionStorage: privateSymbols.walletConnectSessionStorage,
  });

  const peerId = wcAdapter.getPeerId();

  try {
    yield put(
      walletConnectActions.connectedToPeer({
        id: peerId,
        meta: wcAdapter.getPeerMeta(),
        connectedAt: nonNullable(wcAdapter.getConnectedAt()),
      }),
    );

    // start watching for events from wallet connect and UI actions
    const result = yield* race({
      walletConnectEvents: call(watchWalletConnectEvents, wcAdapter),
      disconnectFromPeer: takeOnly(walletConnectActions.disconnectFromPeer, {
        peerId: wcAdapter.getPeerId(),
      }),
      disconnectFromPeerSilent: takeOnly(walletConnectActions.disconnectFromPeerSilent, {
        peerId: wcAdapter.getPeerId(),
      }),
    });

    logger.info(
      `Wallet connect event watcher ended because: ` + Object.keys(result).filter(key => key)[0],
    );

    if (result.disconnectFromPeerSilent) {
      silentDisconnect = true;
    }
  } catch (e) {
    // in case of unknown error stop session
    logger.error(e, `Wallet connect event watcher failed.`);
  } finally {
    yield* call([wcAdapter, "disconnectSession"]);

    logger.info(`Wallet connect session with peer ${peerId} ended`);

    yield put(walletConnectActions.disconnectedFromPeer(peerId));

    if (!silentDisconnect) {
      yield put(notificationUIModuleApi.actions.showInfo("Wallet Connect disconnected"));
    }
  }
}
