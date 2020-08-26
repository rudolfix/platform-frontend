import { SagaGenerator, takeLatest } from "@neufund/sagas";

import { walletConnectActions } from "./actions";
import { connectToURI } from "./sagaFunctions/connectToURI";

export function* walletConnectSaga(): SagaGenerator<void> {
  yield takeLatest(walletConnectActions.connectToPeer, connectToURI);
}
