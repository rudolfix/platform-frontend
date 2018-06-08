import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TEtoData, TPartialEtoData } from "../../lib/api/EtoApi.interfaces";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";

export function* loadEtoData({ apiEtoService }: TGlobalDependencies): any {
  const etoData: IHttpResponse<TEtoData> = yield apiEtoService.getCompanyData();

  yield put(actions.etoFlow.loadData(etoData.body));
}

export function* saveEtoData({ apiEtoService }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;

  const newData: IHttpResponse<TPartialEtoData> = yield apiEtoService.putCompanyData(
    action.payload.data,
  );
  yield put(actions.etoFlow.loadData(newData.body));

  yield put(actions.routing.goToDashboard());
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_DATA_START", loadEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
}
