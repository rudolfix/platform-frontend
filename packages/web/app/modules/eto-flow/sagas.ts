import { call, fork, put, SagaGenerator, select, takeLeading } from "@neufund/sagas";
import {
  coreModuleApi,
  EEtoState,
  EJwtPermissions,
  etoModuleApi,
  IHttpResponse,
  InvalidETOStateError,
  neuGetBindings,
  TCompanyEtoData,
  TEtoProducts,
  TEtoSpecsData,
} from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";

import { EtoDocumentsMessage, EtoFlowMessage } from "../../components/translatedMessages/messages";
import {
  createMessage,
  createNotificationMessage,
} from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { TAppGlobalState } from "../../store";
import { actions, TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { selectActiveNomineeEto } from "../nominee-flow/selectors";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { etoFlowActions } from "./actions";
import {
  selectIsNewPreEtoStartDateValid,
  selectIssuerEtoEquityTokenAddress,
  selectIssuerEtoWithCompanyAndContract,
  selectNewPreEtoStartDate,
  selectPreEtoStartDateFromContract,
  userHasKycAndEmailVerified,
} from "./selectors";
import {
  bookBuildingStatsToCsvString,
  createCsvDataUri,
  downloadFile,
  tokenholdersListToCsvString,
} from "./utils";

export function* loadIssuerEto({
  apiEtoService,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    const company: TCompanyEtoData = yield apiEtoService.getCompany();
    const eto: TEtoSpecsData = yield apiEtoService.getMyEto();

    if (eto.state === EEtoState.ON_CHAIN) {
      yield call(etoModuleApi.sagas.loadEtoContract, eto);
    }

    yield put(actions.etoFlow.setEto({ eto, company }));
  } catch (e) {
    logger.error(e, "Failed to load Issuer ETO");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoFlowMessage.ETO_LOAD_FAILED),
      ),
    );
    yield put(actions.routing.goToDashboard());
  }
}

function* changeBookBuildingStatusEffect(
  { apiEtoService }: TGlobalDependencies,
  status: boolean,
): Generator<any, any, any> {
  yield apiEtoService.changeBookBuildingState(status);
}

export function* changeBookBuildingStatus(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.changeBookBuildingStatus>,
): Generator<any, any, any> {
  const { status } = action.payload;

  try {
    const message = status
      ? createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_START_BOOKBUILDING)
      : createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_STOP_BOOKBUILDING);

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(changeBookBuildingStatusEffect, status),
      [EJwtPermissions.DO_BOOK_BUILDING],
      message,
    );
  } catch (e) {
    logger.error(e, "Failed to change book-building status");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
      ),
    );
  } finally {
    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  }
}

export function* downloadBookBuildingStats({
  apiEtoService,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    const detailedStatsResponse: IHttpResponse<any> = yield apiEtoService.getDetailedBookBuildingStats();

    const dataAsString = yield bookBuildingStatsToCsvString(detailedStatsResponse.body);

    yield downloadFile(createCsvDataUri(dataAsString), "whitelisted_investors.csv");
  } catch (e) {
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(
          EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_GET_BOOKBUILDING_STATS,
        ),
      ),
    );
    logger.error(e, `Failed to load bookbuilding stats pledge`);
  }
}

export function* saveCompany(
  { apiEtoService, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.saveCompanyStart>,
): Generator<any, any, any> {
  try {
    const currentIssuerCompany = yield* call(() => apiEtoService.getCompany());

    yield apiEtoService.putCompany({ ...currentIssuerCompany, ...action.payload.company });

    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error(e, "Failed to save company");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
      ),
    );
  } finally {
    yield put(actions.etoFlow.loadDataStop());
  }
}

export function* saveEto(
  { apiEtoService, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.saveEtoStart>,
): Generator<any, any, any> {
  try {
    const currentEto = yield* call(() => apiEtoService.getMyEto());

    // Eto is only allowed to be modified during PREVIEW state
    if (currentEto.state && currentEto.state !== EEtoState.PREVIEW) {
      throw new InvalidETOStateError(currentEto.state, EEtoState.PREVIEW);
    }

    yield apiEtoService.putMyEto({
      ...currentEto,
      ...action.payload.eto,
    });

    yield put(actions.etoFlow.loadIssuerEto());
    yield put(actions.routing.goToDashboard());
  } catch (e) {
    logger.error(e, "Failed to save ETO");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
      ),
    );
  } finally {
    yield put(actions.etoFlow.loadDataStop());
  }
}

export function* submitEtoDataEffect({
  apiEtoService,
}: TGlobalDependencies): Generator<any, any, any> {
  yield apiEtoService.submitCompanyAndEto();

  yield put(
    webNotificationUIModuleApi.actions.showInfo(
      createNotificationMessage(EtoDocumentsMessage.ETO_SUBMIT_SUCCESS),
    ),
  );

  yield put(actions.etoFlow.loadIssuerEto());
  yield put(actions.routing.goToDashboard());
}

export function* submitEtoData({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitEtoDataEffect),
      [EJwtPermissions.SUBMIT_ETO_PERMISSION],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_TITLE), //eto.modal.submit-title
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION), //eto.modal.submit-description
    );
  } catch (e) {
    logger.error(e, "Failed to Submit ETO data");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
      ),
    );
  }
}

function* startSetDateTX(_: TGlobalDependencies): Generator<any, any, any> {
  const state: TAppGlobalState = yield select();
  if (selectIsNewPreEtoStartDateValid(state)) {
    yield put(actions.txTransactions.startEtoSetDate());
  }
}

export function* cleanupSetDateTX(): any {
  const newStartDate: Date | undefined = yield select(selectNewPreEtoStartDate);
  const oldStartDate: Date | undefined = yield select(selectPreEtoStartDateFromContract);

  if (newStartDate !== oldStartDate) {
    yield put(actions.etoFlow.loadIssuerEto());
  }
  yield put(actions.etoFlow.clearNewStartDate());
}

export function* loadProducts({
  apiEtoProductService,
  logger,
}: TGlobalDependencies): Generator<any, any, any> {
  try {
    const products: TEtoProducts = yield apiEtoProductService.getProducts();

    yield put(actions.etoFlow.setProducts(products));
  } catch (e) {
    logger.error(e, "Failed to load eto products");

    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoFlowMessage.ETO_PRODUCTS_LOAD_FAILED),
      ),
    );
  }
}

export function* changeProductType(
  { apiEtoProductService, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.etoFlow.changeProductType>,
): Generator<any, any, any> {
  try {
    const eto: TEtoSpecsData = yield apiEtoProductService.changeProductType(
      action.payload.productId,
    );

    yield put(actions.etoFlow.setEto({ eto }));

    yield put(
      webNotificationUIModuleApi.actions.showInfo(
        createNotificationMessage(EtoFlowMessage.ETO_TERMS_PRODUCT_CHANGE_SUCCESSFUL),
        {
          autoClose: 10000,
          "data-test-id": "eto-flow-product-changed-successfully",
        },
      ),
    );
  } catch (e) {
    logger.error(e, "Failed to change eto product");

    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoFlowMessage.ETO_TERMS_PRODUCT_CHANGE_FAILED),
      ),
    );
  }
}

export function* publishEtoDataEffect({
  apiEtoService,
}: TGlobalDependencies): Generator<any, any, any> {
  yield apiEtoService.publishCompanyAndEto();

  yield put(
    webNotificationUIModuleApi.actions.showInfo(
      createNotificationMessage(EtoDocumentsMessage.ETO_SUBMIT_SUCCESS),
    ),
  );

  yield put(actions.etoFlow.loadIssuerEto());
  yield put(actions.routing.goToDashboard());
}

export function* publishEtoData({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(publishEtoDataEffect),
      [EJwtPermissions.SUBMIT_ETO_PERMISSION],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_TITLE),
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION),
    );
  } catch (e) {
    logger.error(e, "Failed to Submit ETO data");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA),
      ),
    );
  }
}

export function* loadIssuerStep(): Generator<any, any, any> {
  yield neuCall(loadIssuerEto);

  const issuerEto: ReturnType<typeof selectActiveNomineeEto> = yield select(
    selectIssuerEtoWithCompanyAndContract,
  );

  if (issuerEto === undefined) {
    throw new Error("Issuer eto should be defined before loading eto agreements");
  }

  yield put(actions.eto.loadEtoAgreementsStatus(issuerEto));

  yield put(actions.kyc.kycLoadIndividualDocumentList());
}

/**
 * Loads eto to check governance tab visibility
 */
export function* loadIssuerView(): Generator<any, any, any> {
  const userKycAndEmailVerified = yield* select(userHasKycAndEmailVerified);
  if (userKycAndEmailVerified) {
    yield neuCall(loadIssuerEto);
  }
}

export function* downloadTokenholdersList(): SagaGenerator<void> {
  const { logger, etoTokensApi } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    etoTokensApi: etoModuleApi.symbols.etoTokensApi,
  });

  try {
    const tokenAddress = nonNullable(yield* select(selectIssuerEtoEquityTokenAddress));

    const tokenHolders = yield* call([etoTokensApi, "getTokenholdersList"], tokenAddress);

    const dataAsString = tokenholdersListToCsvString(tokenHolders);

    yield* call(downloadFile, createCsvDataUri(dataAsString), "tokenholders.csv");
  } catch (e) {
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoFlowMessage.ETO_TOKENHOLDERS_DOWNLOAD_FAILED),
      ),
    );
    logger.error(e, `Failed to generate tokenholders list`);
  }
}

export function* etoFlowSagas(): any {
  yield fork(neuTakeEvery, etoFlowActions.loadIssuerView, loadIssuerView);
  yield fork(neuTakeEvery, etoFlowActions.loadIssuerEto, loadIssuerEto);
  yield fork(neuTakeEvery, etoFlowActions.saveCompanyStart, saveCompany);
  yield fork(neuTakeEvery, etoFlowActions.saveEtoStart, saveEto);
  yield fork(neuTakeEvery, etoFlowActions.submitDataStart, submitEtoData);
  yield fork(neuTakeEvery, etoFlowActions.changeBookBuildingStatus, changeBookBuildingStatus);
  yield fork(neuTakeLatest, etoFlowActions.downloadBookBuildingStats, downloadBookBuildingStats);
  yield fork(neuTakeLatest, etoFlowActions.uploadStartDate, startSetDateTX);
  yield fork(neuTakeLatest, etoFlowActions.cleanupStartDate, cleanupSetDateTX);
  yield fork(neuTakeLatest, etoFlowActions.loadProducts, loadProducts);
  yield fork(neuTakeLatest, etoFlowActions.loadIssuerStep, loadIssuerStep);
  yield fork(neuTakeLatest, etoFlowActions.changeProductType, changeProductType);
  yield fork(neuTakeLatest, etoFlowActions.publishDataStart, publishEtoData);
  yield takeLeading(etoFlowActions.downloadTokenholdersList, downloadTokenholdersList);
}
