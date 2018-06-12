import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TEtoData, TEtoSpecsData, TPartialEtoData } from "../../lib/api/EtoApi.interfaces";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";
import { TPartialEtoSpecData } from "./../../lib/api/EtoApi.interfaces";
import { IAppState } from "./../../store";

export function* loadEtoData({ apiEtoService }: TGlobalDependencies): any {
  const etoCompanyData: IHttpResponse<TEtoData> = yield apiEtoService.getCompanyData();
  const etoData: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoData();
  yield put(actions.etoFlow.loadData({ etoData: etoData.body, companyData: etoCompanyData.body }));
}

export function* saveEtoData({ apiEtoService }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA") return;

  const oldCompanyData = yield effects.select((s: IAppState) => s.etoFlow.companyData);
  const oldEtoData = yield effects.select((s: IAppState) => s.etoFlow.etoData);

  const newCompanyData: IHttpResponse<TPartialEtoData> = yield apiEtoService.putCompanyData(
    action.payload.data.companyData || oldCompanyData,
  );
  const newEtoData: IHttpResponse<TPartialEtoSpecData> = yield apiEtoService.putEtoData(
    action.payload.data.etoData || oldEtoData,
  );
  yield put(
    actions.etoFlow.loadData({ etoData: newEtoData.body, companyData: newCompanyData.body }),
  );
  yield put(actions.routing.goToDashboard());
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_DATA_START", loadEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA", saveEtoData);
}
