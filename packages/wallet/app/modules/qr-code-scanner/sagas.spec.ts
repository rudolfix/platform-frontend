import { setupCoreModule } from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import { Alert } from "react-native";
import { mocked } from "ts-jest";

import { TWalletConnectUri } from "modules/wallet-connect/lib/types";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { qrCodeScannerActions } from "./actions";
import { EQRCodeType } from "./constants";
import { onScan } from "./sagas";

describe("QRCodeScanner saga", () => {
  const setupTest = () => {
    const { expectSaga } = bootstrapModule([setupCoreModule({ backendRootUrl: "" })]);

    return {
      expectSaga,
    };
  };

  it("onScan saga dispatches connectToPeer for valid Wallet Connect URI", async () => {
    const { expectSaga } = setupTest();

    const action = qrCodeScannerActions.onScan(
      "wc:f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F&key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
      undefined,
    );

    await expectSaga(onScan, action)
      .put(walletConnectModuleApi.actions.connectToPeer(action.payload.data as TWalletConnectUri))
      .put(qrCodeScannerActions.onScanDone())
      .run();
  });

  it("onScan saga shows alert for invalid Wallet Connect URI", async () => {
    const { expectSaga } = setupTest();
    jest.spyOn(Alert, "alert");

    const action = qrCodeScannerActions.onScan("invalid-uri", EQRCodeType.WALLET_CONNECT);

    const promise = expectSaga(onScan, action).put(qrCodeScannerActions.onScanDone()).run();

    mocked(Alert.alert).mock.calls[0][2]?.[0]?.onPress?.();

    await promise;
  });
});
