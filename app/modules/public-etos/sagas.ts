import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TPartialCompanyEtoData, TPartialEtoSpecData, TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_LOAD_ETO_PREVIEW_START") return;
  const previewCode = action.payload.previewCode;
  try {
    const etoData: IHttpResponse<TPublicEtoData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    yield put(
      actions.publicEtos.setEtos({
        etoData: etoData.body,
      }),
    );
  } catch (e) {
    notificationCenter.error("Could load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etos: IHttpResponse<TPublicEtoData[]> = yield apiEtoService.getEtos();
    yield put(actions.dashboard.setEtos(etos.body));
  } catch (e) {
    logger.error("ETOs could not be loaded", e, e.message);
  }
}


export function* etoSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_ETO_PREVIEW_START", loadEtoPreview);
  yield fork(neuTakeEvery, "DASHBOARD_LOAD_ETOS", loadEtos);
}
