import { put, SagaGenerator, TActionFromCreator, takeEvery } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import { assertError } from "@neufund/shared-utils";

import { notificationUIModuleApi } from "modules/notification-ui/module";
import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";
import { EQRCodeType } from "modules/qr-code-scanner/constants";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { EAppRoutes } from "router/appRoutes";
import { navigate } from "router/routeUtils";

function* onScan(
  action: TActionFromCreator<typeof qrCodeScannerActions, typeof qrCodeScannerActions.onScan>,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const { data, requiredQRCodeType } = action.payload;

    if (walletConnectModuleApi.utils.isValidWalletConnectUri(data)) {
      yield put(walletConnectModuleApi.actions.connectToPeer(data));
      return;
    }

    // Eth/ERC20 token transfer
    // if (isValidTransactionRequestUri(data)) {
    // yield put(...);
    // }

    logger.info("Unsupported QR code");

    switch (requiredQRCodeType) {
      case EQRCodeType.WALLET_CONNECT:
        yield put(notificationUIModuleApi.actions.showInfo("Unrecognised Wallet Connect QR Code"));
        break;

      default:
        yield put(notificationUIModuleApi.actions.showInfo("Unrecognised QR Code"));
        break;
    }

    navigate(EAppRoutes.home);
  } catch (error) {
    assertError(error);
    logger.error(error, "QRCode scanner onScan handler failed");
    yield put(notificationUIModuleApi.actions.showInfo("Failed to scan QR Code"));
    navigate(EAppRoutes.home);
  }
}

export function* qrCodeScannerSaga(): SagaGenerator<void> {
  yield takeEvery(qrCodeScannerActions.onScan, onScan);
}
