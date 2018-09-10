import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TPartialCompanyEtoData, TPartialEtoSpecData, TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { IAppAction, IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";
import { IPublicEtoState } from "./reducer";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO_PREVIEW") return;
  const previewCode = action.payload.previewCode;
  const s:IPublicEtoState = yield select((s: IAppState) => s.publicEtos)
  // clear old data, if requesting different eto, otherwise optimistically fetch changes
  if (s.previewEtoData && s.previewEtoData.previewCode !== previewCode) {
    actions.publicEtos.setPreviewEto()
  }

  try {
    const etoData: IHttpResponse<TPartialEtoSpecData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const companyId = etoData.body.companyId as string;
    const companyData: IHttpResponse<
      TPartialCompanyEtoData
    > = yield apiEtoService.getCompanyDataById(companyId);
    yield put(
      actions.publicEtos.setPreviewEto({
        eto: etoData.body,
        company: companyData.body
      }),
    );
  } catch (e) {
    notificationCenter.error("Could load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etoData: IHttpResponse<TPublicEtoData[]> = yield apiEtoService.getEtos();

    const etos: {[id: string]: TPublicEtoData} = {}
    const order: string[] = []
    etoData.body.forEach(eto => {
      if (eto.etoId) {
        etos[eto.etoId] = eto;
        order.push(eto.etoId)
      }
    })

    yield put(actions.publicEtos.setPublicEtos(etos));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e, e.message);
  }
}


export function* etoSagas(): any {
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO_PREVIEW", loadEtoPreview);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETOS", loadEtos);
}
