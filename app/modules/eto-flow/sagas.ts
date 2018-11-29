import {delay, effects} from "redux-saga";
import { fork, put } from "redux-saga/effects";

import {BOOKBUILDING_WATCHER_DELAY, DO_BOOK_BUILDING, SUBMIT_ETO_PERMISSION} from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EtoState, TBookbuildingStatsType,
  TCompanyEtoData,
  TEtoSpecsData,
  TPartialEtoSpecData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { loadEtoContact } from "../public-etos/sagas";
import {neuCall, neuTakeEvery, neuTakeLatest, neuTakeUntil} from "../sagasUtils";
import {selectBookBuildingStats, selectIssuerCompany, selectIssuerEto} from "./selectors";

export function* loadIssuerEto({
  apiEtoService,
  notificationCenter,
  logger,
}: TGlobalDependencies): any {
  try {
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompany();
    const company = companyResponse.body;
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getMyEto();
    const eto = etoResponse.body;

    if (eto.state === EtoState.ON_CHAIN) {
      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));

    yield put(actions.etoFlow.setIssuerEtoPreviewCode(eto.previewCode));
  } catch (e) {
    logger.error("Failed to load Issuer ETO", e);
    notificationCenter.error(
      "Could not access ETO data. Make sure you have completed KYC and email verification process.",
    );
    yield put(actions.routing.goToDashboard());
  }
}

export function* changeBookBuildingStatus(
  { apiEtoService, notificationCenter, logger, intlWrapper }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [DO_BOOK_BUILDING],
      intlWrapper.intl.formatIntlMessage("eto.modal.change-bookbuilding-status"),
    );
    yield apiEtoService.changeBookBuildingState(action.payload.status);
  } catch (e) {
    logger.error("Failed to change book-building status", e);
    notificationCenter.error("Failed to send ETO data");
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}


export function* watchBookBuildingStats(
  { logger }:TGlobalDependencies
):any {
  while (true) {
    logger.info("Querying for bookbuilding stats...");
    try {
      yield neuCall(doLoadDetailedBookBuildingStats)
    } catch (e) {
      logger.error("Error getting bookbuilding stats", e);
    }
    yield delay(BOOKBUILDING_WATCHER_DELAY);
  }
}

export function* loadBookBuildingStats(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_LOAD_BOOKBUILDING_STATS") return;
  yield neuCall(doLoadDetailedBookBuildingStats)
}

export function* doLoadDetailedBookBuildingStats(
  { apiEtoService, notificationCenter, logger, intlWrapper }: TGlobalDependencies
): any {
  try {
    const detailedStatsResponse: IHttpResponse<any> = yield apiEtoService.getDetailedBookBuildingStats();

    yield put(actions.etoFlow.setDetailedBookBuildingStats(detailedStatsResponse.body));
  } catch (e) {
    notificationCenter.error(
      intlWrapper.intl.formatIntlMessage(
        "eto.overview.error-notification.failed-to-bookbuilding-stats",
      ),
    );

    logger.error(`Failed to load bookbuilding stats pledge`, e);
  }
}

export function* downloadBookBuildingStats (
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
):any {
  if (action.type !== "ETO_FLOW_DOWNLOAD_BOOKBUILDING_STATS") return;
  const stats = yield effects.select(selectBookBuildingStats);
  const dataAsString = stats.map(
    (el:TBookbuildingStatsType) => `${el.email ? el.email : "******"},${el.amountEur},${el.insertedAt},${el.updatedAt}`
  ).join("\r\n");
  const file = `data:text/csv,${encodeURIComponent(dataAsString)}`;
  yield window.open(file, "_self");
}

function stripEtoDataOptionalFields(data: TPartialEtoSpecData): TPartialEtoSpecData {
  // formik will pass empty strings into numeric fields that are optional, see
  // https://github.com/jaredpalmer/formik/pull/827
  // todo: we should probably enumerate Yup schema and clean up all optional numbers
  //todo: we strip these things on form save now, need to move it there -- at
  if (!data.maxTicketEur) {
    data.maxTicketEur = undefined;
  }
  return data;
}

export function* saveEtoData(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SAVE_DATA_START") return;
  try {
    const currentCompanyData: TCompanyEtoData = yield effects.select(selectIssuerCompany);
    const currentEtoData: TEtoSpecsData = yield effects.select(selectIssuerEto);
    yield apiEtoService.putCompany({
      ...currentCompanyData,
      ...action.payload.data.companyData,
    });
    if (currentEtoData.state === EtoState.PREVIEW)
      yield apiEtoService.putMyEto(
        stripEtoDataOptionalFields({ //TODO this is already being done on form save. Need to synchronize with convert() method
          ...currentEtoData,
          ...action.payload.data.etoData,
        }),
      );
    yield put(actions.etoFlow.loadDataStart());
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error("Failed to send ETO data", e);
    notificationCenter.error("Failed to send ETO data");
    yield put(actions.etoFlow.loadDataStop());
  }
}

export function* submitEtoData(
  {
    apiEtoService,
    notificationCenter,
    logger,
    intlWrapper: {
      intl: { formatIntlMessage },
    },
  }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_FLOW_SUBMIT_DATA_START") return;
  try {
    yield neuCall(
      ensurePermissionsArePresent,
      [SUBMIT_ETO_PERMISSION],
      formatIntlMessage("eto.modal.submit-title"),
      formatIntlMessage("eto.modal.submit-description"),
    );
    yield apiEtoService.submitCompanyAndEto();
    notificationCenter.info("ETO Successfully submitted");
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error("Failed to Submit ETO data", e);
    notificationCenter.error("Failed to send ETO data");
  }
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_ISSUER_ETO", loadIssuerEto);
  yield fork(neuTakeEvery, "ETO_FLOW_SAVE_DATA_START", saveEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_SUBMIT_DATA_START", submitEtoData);
  yield fork(neuTakeEvery, "ETO_FLOW_CHANGE_BOOK_BUILDING_STATES", changeBookBuildingStatus);
  yield fork(neuTakeEvery, "ETO_FLOW_LOAD_BOOKBUILDING_STATS", loadBookBuildingStats);
  yield fork(neuTakeUntil, "ETO_FLOW_BOOKBUILDING_WATCHER_START", "ETO_FLOW_BOOKBUILDING_WATCHER_STOP", watchBookBuildingStats);
  yield fork(neuTakeLatest, "ETO_FLOW_DOWNLOAD_BOOKBUILDING_STATS", downloadBookBuildingStats)
}
