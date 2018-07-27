import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { IAppState } from "../../store";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { SUBMIT_ETO_PERMISSION } from "./../../config/constants";
import { IEtoFiles } from "./../../lib/api/eto/EtoFileApi.interfaces";

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

export function* loadEtoFileData({
  notificationCenter,
  apiEtoFileService,
}: TGlobalDependencies): any {
  try {
    const etoFileData: IEtoFiles = yield apiEtoFileService.getFileEtoData();
    yield put(actions.etoFlow.loadEtoFileData(etoFileData));
  } catch (e) {
    notificationCenter.error(
      "Could not access ETO files data. Make sure you have completed KYC and email verification process.",
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
    const currentCompanyData = yield effects.select((s: IAppState) => s.etoFlow.companyData);
    const currentEtoData = yield effects.select((s: IAppState) => s.etoFlow.etoData);

    yield apiEtoService.putCompanyData({
      ...currentCompanyData,
      ...action.payload.data.companyData,
    });
    if (currentEtoData.state === "preview")
      yield apiEtoService.putEtoData({
        ...currentEtoData,
        ...action.payload.data.etoData,
      });
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadDataStart());
    yield put(actions.routing.goToDashboard());
  }
}

export function* submitEtoData(
  {
    apiEtoService,
    notificationCenter,
    logger,
    intlWrapper: { intl: { formatIntlMessage } },
  }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SUBMIT_DATA_START") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_ETO_PERMISSION],
      formatIntlMessage("eto.modal.submit-description"),
    );
    yield apiEtoService.submitCompanyAndEtoData();
    notificationCenter.info("ETO Successfully submitted");
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadDataStart());
    yield put(actions.routing.goToDashboard());
  }
}

function* uploadEtoFile(
  {
    apiEtoFileService,
    notificationCenter,
    logger,
    intlWrapper: { intl: { formatIntlMessage } },
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "ETO_FLOW_UPLOAD_DOCUMENT_START") return;
  const { file, name } = action.payload;
  try {
    const etoFiles = yield apiEtoFileService.putFileEtoData(file, name);
    yield put(actions.etoFlow.loadEtoFileData(etoFiles));
    notificationCenter.info(formatIntlMessage("eto.modal.file-uploaded"));
  } catch (e) {
    yield put(actions.etoFlow.loadFileDataStart());
    logger.error("Failed to send ETO data", e);
    notificationCenter.error(formatIntlMessage("eto.modal.file-upload-failed"));
  }
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_DATA_START", loadEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_FILE_DATA_START", loadEtoFileData);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SUBMIT_DATA_START", submitEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_UPLOAD_DOCUMENT_START", uploadEtoFile);
}
