import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_LOAD_ETO_PREVIEW_START") return;
  const previewCode = action.payload.previewCode;
  try {
    const etoData: IHttpResponse<TPartialEtoSpecData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const companyId = (etoData.body as any).companyId as string;
    const companyData: IHttpResponse<
      TPartialCompanyEtoData
    > = yield apiEtoService.getCompanyDataById(companyId);
    yield put(
      actions.eto.loadEtoPreview(previewCode, {
        etoData: etoData.body,
        companyData: companyData.body,
      }),
    );
  } catch (e) {
    notificationCenter.error("Could load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_ETO_PREVIEW_START", loadEtoPreview);
}
