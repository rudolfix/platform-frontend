import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../lib/api/EtoApi.interfaces";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";

export function* loadEtoData({ apiEtoService, notificationCenter }: TGlobalDependencies): any {
  try {
    const etoCompanyData: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyData();
    const etoData: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoData();

    yield put(
      actions.etoFlow.loadData({ etoData: etoData.body, companyData: etoCompanyData.body }),
    );
  } catch (e) {
    notificationCenter.error(
      "Could not access ETO data. Make sure you have completed KYC and email verification process.",
    );
    yield put(actions.routing.goToDashboard());
  }
}

export function* saveEtoData(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;
  try {
    const oldCompanyData = yield effects.select((s: IAppState) => s.etoFlow.companyData);
    const oldEtoData = yield effects.select((s: IAppState) => s.etoFlow.etoData);

    const newCompanyData: IHttpResponse<
      TPartialCompanyEtoData
    > = yield apiEtoService.putCompanyData({
      ...oldCompanyData,
      ...action.payload.data.companyData,
    });
    const newEtoData: IHttpResponse<TPartialEtoSpecData> = yield apiEtoService.putEtoData({
      ...oldEtoData,
      ...action.payload.data.etoData,
    });
    yield put(
      actions.etoFlow.loadData({ etoData: newEtoData.body, companyData: newCompanyData.body }),
    );
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    yield put(actions.etoFlow.loadDataStart());
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  }
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_DATA_START", loadEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
}
