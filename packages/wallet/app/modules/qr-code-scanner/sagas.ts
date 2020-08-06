import { put, SagaGenerator, TActionFromCreator, takeEvery } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { notificationUIModuleApi } from "modules/notification-ui/module";
import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { EAppRoutes } from "router/appRoutes";
import { navigate } from "router/routeUtils";

import { isValidWalletConnectUri } from "./utils/walletConnectUtils";

function* onScan(
  action: TActionFromCreator<typeof qrCodeScannerActions, typeof qrCodeScannerActions.onScan>,
): SagaGenerator<void> {
  const { data } = action.payload;

  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  logger.info("Parsing QR code data" + data);

  if (isValidWalletConnectUri(data)) {
    yield put(walletConnectModuleApi.actions.connectToPeer(data));
    return;
  }

  // Eth/ERC20 token transfer
  // if (isValidTransactionRequestUri(data)) {
  // yield put(...);
  // }

  logger.info("Unsupported QR code" + data);
  yield put(
    notificationUIModuleApi.actions.showInfo("The code you scanned is not supported by the app"),
  );

  navigate(EAppRoutes.home);
}

export function* qrCodeScannerSaga(): SagaGenerator<void> {
  yield takeEvery(qrCodeScannerActions.onScan, onScan);
}
