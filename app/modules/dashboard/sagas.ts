import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { signMessage } from "../accessWallet/sagas";
import { actions, TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { txSendSaga } from "../tx/sender/sagas";

function* signDummyMessage(_deps: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "DASHBOARD_SIGN_DUMMY_MESSAGE") {
    return;
  }
  const message = action.payload.message;

  try {
    const signed = yield neuCall(
      signMessage,
      message,
      "Test Message",
      "Please sign this for me :)",
    );

    // this is just for demo purposes
    // tslint:disable-next-line
    console.log("signed: ", signed);
  } catch {
    // tslint:disable-next-line
    console.log("Error while signing a message :( ");
  }
}

function* sendDummyTx({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "DASHBOARD_SEND_DUMMY_TX") {
    return;
  }

  try {
    yield neuCall(txSendSaga, "WITHDRAW");
    logger.info("TX SENT SUCCESSFULLY!!");
  } catch (e) {
    logger.error("Error while sending tx :(", e);
  }
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etos: IHttpResponse<TInvestorEtoData[]> = yield apiEtoService.getEtos();
    yield put(actions.dashboard.setEtos(etos.body));
  } catch (e) {
    logger.error("ETOs could not be loaded", e, e.message);
  }
}

export const dashboardSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "DASHBOARD_SIGN_DUMMY_MESSAGE", signDummyMessage);
  yield fork(neuTakeEvery, "DASHBOARD_SEND_DUMMY_TX", sendDummyTx);
  yield fork(neuTakeEvery, "DASHBOARD_LOAD_ETOS", loadEtos);
};
