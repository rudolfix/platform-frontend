import { put, SagaGenerator, TActionFromCreator, takeEvery, call, take } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import { assertError } from "@neufund/shared-utils";

import { notificationUIModuleApi } from "modules/notification-ui/module";
import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";
import { EQRCodeType } from "modules/qr-code-scanner/constants";
import { createAlertChannel } from "modules/utils";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { EAppRoutes } from "router/appRoutes";
import { navigate } from "router/routeUtils";

const isQrTypeAllowed = (requiredType: EQRCodeType | undefined, type: EQRCodeType) =>
  [undefined, type].includes(requiredType);

type TAlertOptions = {
  title: string;
  message: string;
};

// TODO: Translate with react-intl
function* getAlertOptions(
  requiredQRCodeType: EQRCodeType | undefined,
): SagaGenerator<TAlertOptions> {
  const title = "Unrecognized QR Code";

  switch (requiredQRCodeType) {
    case EQRCodeType.WALLET_CONNECT:
      return { title, message: "Sorry, unrecognised Wallet Connect QR Code" };

    default:
      return { title, message: "Sorry, this QR code could not be recognized." };
  }
}

export function* onScan(
  action: TActionFromCreator<typeof qrCodeScannerActions, typeof qrCodeScannerActions.onScan>,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const { data, requiredQRCodeType } = action.payload;

    if (
      isQrTypeAllowed(requiredQRCodeType, EQRCodeType.WALLET_CONNECT) &&
      walletConnectModuleApi.utils.isValidWalletConnectUri(data)
    ) {
      yield put(walletConnectModuleApi.actions.connectToPeer(data));
      yield put(qrCodeScannerActions.onScanDone());
      return;
    }

    logger.info("Unsupported QR code");

    const alertOptions = yield* call(getAlertOptions, requiredQRCodeType);

    const alertChannel = yield* call(createAlertChannel, alertOptions.title, alertOptions.message);

    const dismissed = yield* take(alertChannel);

    if (dismissed) {
      yield put(qrCodeScannerActions.onScanDone());
    }
  } catch (error) {
    assertError(error);
    logger.error(error, "QRCode scanner onScan handler failed");

    yield put(qrCodeScannerActions.onScanDone());
    yield put(notificationUIModuleApi.actions.showInfo("Failed to scan QR Code"));

    navigate(EAppRoutes.home);
  }
}

export function* qrCodeScannerSaga(): SagaGenerator<void> {
  yield takeEvery(qrCodeScannerActions.onScan, onScan);
}
