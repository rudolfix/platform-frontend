import { put, SagaGenerator, TActionFromCreator, takeEvery } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { notificationUIModuleApi } from "modules/notification-ui/module";
import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";
import { walletConnectActions } from "modules/wallet-connect/actions";
import { isValidWalletConnectUri } from "modules/wallet-connect/lib/utils";

import { EAppRoutes } from "router/appRoutes";
import { navigate } from "router/routeUtils";

function* onScan(
  action: TActionFromCreator<typeof qrCodeScannerActions, typeof qrCodeScannerActions.onScan>,
): SagaGenerator<void> {
  const { data } = action.payload;
  console.log(data);

  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  logger.info("Parsing QR code data" + data);

  if (isValidWalletConnectUri(data)) {
    console.log("Valid");
    yield put(walletConnectActions.connectToPeer(data));
    return;
  } else {
    logger.info("Unsupported QR code" + data);

    yield put(
      notificationUIModuleApi.actions.showInfo("The code you scanned is not supported by the app"),
    );

    navigate(EAppRoutes.home);
  }
}

export function* qrCodeScannerSaga(): SagaGenerator<void> {
  yield takeEvery(qrCodeScannerActions.onScan, onScan);
}
