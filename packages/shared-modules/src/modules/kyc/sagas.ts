import {
  all,
  call,
  delay,
  fork,
  neuCall,
  neuTakeEvery,
  neuTakeUntil,
  put,
  SagaGenerator,
  select,
  TActionFromCreator,
} from "@neufund/sagas";

import { createMessage, TMessage } from "../../messages";
import { neuGetBindings } from "../../utils";
import { authModuleAPI, EJwtPermissions, IUser } from "../auth/module";
import { contractsModuleApi } from "../contracts/module";
import { coreModuleApi, IHttpResponse } from "../core/module";
import { notificationUIModuleApi } from "../notification-ui/module";
import { routingModuleApi } from "../routing/module";
import { kycActions } from "./actions";
import {
  deleteBeneficialOwner,
  loadBeneficialOwnerFiles,
  loadBeneficialOwners,
  throttledKycUploadBeneficialOwnerDocument,
  toggleBeneficialOwnerModal,
  updateBeneficialOwner,
} from "./beneficial-owner/sagas";
import { submitFinancialDisclosure } from "./financial-disclosure/sagas";
import {
  loadLegalRepresentative,
  loadLegalRepresentativeFiles,
  submitLegalRepresentative,
  uploadLegalRepresentativeFile,
} from "./legal-representative/sagas";
import {
  EKycBusinessType,
  EKycRequestStatus,
  EKycRequestType,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycManagingDirector,
  TKycBankAccount,
  TKycStatus,
} from "./lib/http/kyc-api/KycApi.interfaces";
import { KycFlowMessage } from "./messages";
import { TKycModuleState } from "./module";
import {
  selectCombinedBeneficialOwnerOwnership,
  selectIsUserVerified,
  selectKycRequestStatus,
  selectKycRequestType,
} from "./selectors";
import { symbols } from "./symbols";
import { deserializeClaims } from "./utils";

type TGlobalDependencies = unknown;

export function* loadKycStatus(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });

  try {
    yield put(kycActions.setStatusLoading());

    const kycStatus: TKycStatus = yield apiKycService.getKycStatus();

    yield put(kycActions.setStatus(kycStatus));
  } catch (e) {
    logger.error(e, "Error while getting KYC status");

    yield put(kycActions.setStatusError(e.message));

    // let the caller know that status is unknown
    throw e;
  }
}

export function* loadClientData(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    yield neuCall(loadKycStatus);

    const kycStatusType = yield* select(selectKycRequestType);

    switch (kycStatusType) {
      case EKycRequestType.BUSINESS:
        yield neuCall(loadBusinessData);

        break;
      case EKycRequestType.INDIVIDUAL:
        yield neuCall(loadIndividualData);

        break;
      default:
        logger.info(`Kyc type is ${kycStatusType} therefore omitting loading kyc data`);
    }
  } catch (e) {
    logger.error(e, "Error while loading client kyc data");

    // we are not able to provide meaningful user experience in case of missing client data
    // rethrow the error to be catched by the root saga and show fallback UI
    throw e;
  }
}

/**
 * whole watcher feature is just a temporary workaround for a lack of real time communication with backend
 */
let kycWidgetWatchDelay: number = 1000;

function* kycStatusRefreshSaga(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  kycWidgetWatchDelay = 1000;
  while (true) {
    const requestType: EKycRequestType = yield select(selectKycRequestType);
    const status: EKycRequestStatus | undefined = yield select((s: TKycModuleState) =>
      selectKycRequestStatus(s),
    );

    if (
      status === EKycRequestStatus.ACCEPTED ||
      status === EKycRequestStatus.REJECTED ||
      status === EKycRequestStatus.IGNORED
    ) {
      return;
    }

    if (status === EKycRequestStatus.PENDING || status === EKycRequestStatus.OUTSOURCED) {
      yield neuCall(loadClientData);
      yield neuCall(loadIdentityClaim);
      logger.info("KYC refreshed" + status + requestType);
    }

    yield delay(kycWidgetWatchDelay);
    expandWatchTimeout();
  }
}

// it will sleep for 1000, 3000, and then always 10 000
function expandWatchTimeout(): void {
  // tslint:disable-next-line
  if (kycWidgetWatchDelay === 1000) {
    kycWidgetWatchDelay = 3000;
  } else {
    kycWidgetWatchDelay = 10000;
  }
}

/**
 * Individual Request
 */
function* loadIdentityClaim(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, contractsService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    contractsService: contractsModuleApi.symbols.contractsService,
  });
  try {
    const loggedInUser: IUser = yield select((state: TKycModuleState) =>
      authModuleAPI.selectors.selectUser(state),
    );

    const claims: string = yield contractsService.identityRegistry.getClaims(loggedInUser.userId);

    yield put(kycActions.kycSetClaims(deserializeClaims(claims)));
  } catch (e) {
    logger.error(e, "Error while loading kyc identity claims");

    // we are not able to provide meaningful user experience in case of missing identity data
    // rethrow the error to be catched by the root saga and show fallback UI
    throw e;
  }
}

/**
 * Individual Request
 */
function* loadIndividualData(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateIndividualData(true));
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.getIndividualData();
    yield put(kycActions.kycUpdateIndividualData(false, result.body));
  } catch (e) {
    if (e.status !== 404) {
      logger.error(e, "Failed to load KYC individual data");
    }

    yield put(kycActions.kycUpdateIndividualData(false));
  }
}

export function* submitPersonalDataSaga(
  _: TGlobalDependencies,
  data: IKycIndividualData,
): Generator<any, any, any> {
  const { apiKycService } = yield* neuGetBindings({
    apiKycService: symbols.kycApi,
  });
  const result: IHttpResponse<IKycIndividualData> = yield apiKycService.putPersonalData(data);

  // update kyc status after submitting personal data as it may affect supported instant id providers
  yield neuCall(loadKycStatus);

  yield put(
    kycActions.kycUpdateIndividualData(false, {
      ...result.body,
      isAccreditedUsCitizen: data.isAccreditedUsCitizen,
    }),
  );
}

function* submitPersonalDataNoRedirect(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitPersonalData>,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    const { data } = action.payload;
    yield neuCall(submitPersonalDataSaga, data);
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC individual data");
  }
}

function* submitPersonalData(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitPersonalData>,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    const { data } = action.payload;
    yield neuCall(submitPersonalDataSaga, data);

    yield put(routingModuleApi.actions.goToKYCIndividualAddress());
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC individual data");
  }
}

function* submitPersonalDataAndClose(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitPersonalDataAndClose>,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    const { data } = action.payload;
    yield neuCall(submitPersonalDataSaga, data);

    yield put(routingModuleApi.actions.goToDashboard());
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC individual data");
  }
}

function* submitPersonalAddressSaga(
  _: TGlobalDependencies,
  data: IKycIndividualData,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    const result: IHttpResponse<IKycIndividualData> = yield apiKycService.putPersonalData(data);

    yield put(kycActions.kycUpdateIndividualData(false, result.body));

    return true;
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC individual data");
  }
}

function* submitPersonalAddress(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitPersonalAddress>,
): Generator<any, any, any> {
  const { data } = action.payload;
  const success = yield neuCall(submitPersonalAddressSaga, data);

  if (success) {
    yield put(routingModuleApi.actions.goToKYCIndividualFinancialDisclosure());
  }
}

function* submitPersonalAddressAndClose(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitPersonalAddress>,
): Generator<any, any, any> {
  const { data } = action.payload;
  const success = yield neuCall(submitPersonalAddressSaga, data);

  if (success) {
    yield put(routingModuleApi.actions.goToDashboard());
  }
}

function* uploadIndividualFile(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycUploadIndividualDocument>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });

  const { file } = action.payload;
  try {
    yield put(kycActions.kycUpdateIndividualDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadIndividualDocument(file);
    yield put(kycActions.kycUpdateIndividualDocument(false, result.body));
    yield put(
      notificationUIModuleApi.actions.showInfo(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL)),
    );
  } catch (e) {
    yield put(kycActions.kycUpdateIndividualDocument(false));

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED)),
    );

    logger.error(e, "Failed to upload KYC individual file");
  }
}

function* loadIndividualFiles(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateIndividualDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getIndividualDocuments();
    yield put(kycActions.kycUpdateIndividualDocuments(false, result.body));
  } catch (e) {
    yield put(kycActions.kycUpdateIndividualDocuments(false));

    if (e.status !== 404) {
      logger.error(e, "Failed to load KYC individual files");
    }
  }
}

function* submitIndividualRequestEffect(_: TGlobalDependencies): Generator<any, any, any> {
  const { apiKycService } = yield* neuGetBindings({
    apiKycService: symbols.kycApi,
  });

  const kycStatus: TKycStatus = yield apiKycService.submitIndividualRequest();

  yield put(kycActions.setStatus(kycStatus));
  yield put(routingModuleApi.actions.goToKYCSuccess());
}

function* submitIndividualRequest(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitIndividualRequestEffect),
      [EJwtPermissions.SUBMIT_KYC_PERMISSION],
      createMessage(KycFlowMessage.KYC_SUBMIT_TITLE),
      createMessage(KycFlowMessage.KYC_SUBMIT_DESCRIPTION),
    );
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED)),
    );

    logger.error(e, "Failed to submit KYC individual request");
  }
}

/**
 * Company Request
 */

// legal representative

// business data
function* setBusinessType(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSetBusinessType>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateBusinessData(true));
    let institutionData: IKycBusinessData = {};
    // TODO: Pretty bad use of `catch` we need to log an error if it's not 404
    try {
      const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();
      institutionData = result.body;
    } catch (_e) {}
    institutionData = { ...institutionData, legalFormType: action.payload.type };
    yield apiKycService.putBusinessData(institutionData);
    yield put(kycActions.kycUpdateBusinessData(false, institutionData));
    yield put(routingModuleApi.actions.goToKYCBusinessData());
  } catch (e) {
    yield put(kycActions.kycUpdateBusinessData(false));

    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to set KYC business");
  }
}

// legal representative
function* loadBusinessData(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateBusinessData(true));
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.getBusinessData();

    yield put(kycActions.kycUpdateBusinessData(false, result.body));
  } catch (e) {
    if (e.status !== 404) {
      logger.error(e, "Failed to load KYC business data");
    }

    yield put(kycActions.kycUpdateBusinessData(false));
  }
}

function* submitBusinessData(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitBusinessData>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    const { data, file, close } = action.payload;

    yield put(kycActions.kycUpdateBusinessData(true));
    // TODO legalFormType is hardocded for now
    const result: IHttpResponse<IKycBusinessData> = yield apiKycService.putBusinessData({
      ...data,
      legalFormType: EKycBusinessType.SMALL,
    });
    yield put(kycActions.kycUpdateBusinessData(false, result.body));

    if (file) {
      yield neuCall(uploadBusinessFile, {
        type: kycActions.kycUploadBusinessDocument.getType(),
        payload: { file },
      });
    } else {
      if (close) {
        yield put(routingModuleApi.actions.goToDashboard());
      } else {
        yield put(routingModuleApi.actions.goToKYCManagingDirectors());
      }
    }
  } catch (e) {
    yield put(kycActions.kycUpdateBusinessData(false));

    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC business data");
  }
}

function* uploadBusinessFile(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycUploadBusinessDocument>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  const { file } = action.payload;
  try {
    yield put(kycActions.kycUpdateBusinessDocument(true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBusinessDocument(file);
    yield put(kycActions.kycUpdateBusinessDocument(false, result.body));
    yield put(
      notificationUIModuleApi.actions.showInfo(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL)),
    );
  } catch (e) {
    yield put(kycActions.kycUpdateBusinessDocument(false));

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED)),
    );

    logger.error(e, "Failed to upload KYC business file");
  }
}

function* loadBusinessFiles(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateBusinessDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBusinessDocuments();
    yield put(kycActions.kycUpdateBusinessDocuments(false, result.body));
  } catch (e) {
    yield put(kycActions.kycUpdateBusinessDocuments(false));

    if (e.status !== 404) {
      logger.error(e, "Failed to load KYC business files");
    }
  }
}

// managing director
function* loadManagingDirectorsData(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateManagingDirector(true));
    const result: IHttpResponse<IKycManagingDirector> = yield apiKycService.getManagingDirectors();
    yield put(kycActions.kycUpdateManagingDirector(false, result.body));
  } catch (e) {
    yield put(kycActions.kycUpdateManagingDirector(false));
    logger.error(e, "Failed to load KYC managing director");
  }
}

function* loadManagingDirectorFiles(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateManagingDirectorDocuments(true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getManagingDirectorDocuments();
    yield put(kycActions.kycUpdateManagingDirectorDocuments(false, result.body));
  } catch (e) {
    yield put(kycActions.kycUpdateManagingDirectorDocuments(false));

    if (e.status !== 404) {
      logger.error(e, "Failed to load KYC managing director files");
    }
  }
}

function* submitAndUploadManagingDirector(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof kycActions,
    typeof kycActions.kycSubmitAndUploadManagingDirector
  >,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  const { data, file } = action.payload;

  yield put(kycActions.kycUpdateManagingDirector(true));
  yield put(kycActions.kycUpdateManagingDirectorDocument(true));

  try {
    const putResult: IHttpResponse<IKycBusinessData> = yield apiKycService.putManagingDirector(
      data,
    );
    yield put(kycActions.kycUpdateManagingDirector(false, putResult.body));
  } catch (e) {
    yield put(kycActions.kycUpdateManagingDirector(false));
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );
  }

  try {
    const uploadResult: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadManagingDirectorDocument(
      file,
    );
    yield put(kycActions.kycUpdateManagingDirectorDocument(false, uploadResult.body));
  } catch (e) {
    yield put(kycActions.kycUpdateManagingDirectorDocument(false));
    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED)),
    );
    logger.error(e, "Failed to upload KYC managing director file");
  }
}

// request
function* submitBusinessRequestEffect(_: TGlobalDependencies): Generator<any, any, any> {
  const { apiKycService } = yield* neuGetBindings({
    apiKycService: symbols.kycApi,
  });
  const kycStatus: TKycStatus = yield apiKycService.submitBusinessRequest();

  yield put(kycActions.setStatus(kycStatus));
}

function* kycSubmitManagingDirector(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitManagingDirector>,
): Generator<any, any, any> {
  const { apiKycService } = yield* neuGetBindings({
    apiKycService: symbols.kycApi,
  });
  const { data } = action.payload;
  yield put(kycActions.kycUpdateManagingDirector(true));

  try {
    const putResult: IHttpResponse<IKycBusinessData> = yield apiKycService.putManagingDirector(
      data,
    );
    yield put(kycActions.kycUpdateManagingDirector(false, putResult.body));
    yield put(kycActions.kycToggleManagingDirectorModal(false));
  } catch (e) {
    yield put(kycActions.kycUpdateManagingDirector(false));
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );
  }
}

function* submitBusinessRequest(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    // check whether combined value of beneficial owners percentages is less or equal 100%
    const ownerShip = yield select((s: TKycModuleState) =>
      selectCombinedBeneficialOwnerOwnership(s.kyc),
    );
    if (ownerShip > 100) {
      yield call(
        displayErrorModalSaga,
        createMessage(KycFlowMessage.KYC_ERROR),
        createMessage(KycFlowMessage.KYC_BENEFICIAL_OWNERS),
      );
      return;
    }

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(submitBusinessRequestEffect),
      [EJwtPermissions.SUBMIT_KYC_PERMISSION],
      createMessage(KycFlowMessage.KYC_SUBMIT_TITLE),
      createMessage(KycFlowMessage.KYC_SUBMIT_DESCRIPTION),
    );
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED)),
    );

    logger.error(e, "Failed to submit KYC business request");
  }
}

export function* loadBankAccountDetails(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    // bank details depend on claims `hasBankAccount` flag
    // so to have consistent ui we need to reload claims
    yield neuCall(loadIdentityClaim);

    const isVerified: boolean = yield select(selectIsUserVerified);

    // bank account api can only be called when account is verified
    if (isVerified) {
      const result: TKycBankAccount = yield apiKycService.getBankAccount();

      yield put(kycActions.setQuintessenceBankAccountDetails(result.ourAccount));

      if (result.verifiedUserAccount !== undefined) {
        yield put(
          kycActions.setBankAccountDetails({
            hasBankAccount: true,
            details: result.verifiedUserAccount,
          }),
        );
      } else {
        yield put(
          kycActions.setBankAccountDetails({
            hasBankAccount: false,
          }),
        );
      }
    } else {
      yield put(
        kycActions.setBankAccountDetails({
          hasBankAccount: false,
        }),
      );
    }
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_LOADING_BANK_DETAILS),
      ),
    );

    logger.error(e, "Error while loading kyc bank details");

    yield put(
      kycActions.setBankAccountDetails({
        hasBankAccount: false,
      }),
    );
  }
}

export function* loadKycRequestData(): Generator<any, any, any> {
  // Wait for contracts to init
  yield waitUntilSmartContractsAreInitialized();

  yield all([neuCall(loadClientData), neuCall(loadIdentityClaim)]);
}

type TEnsurePermissionsArePresentAndRunEffect = (
  _: any,
  effect: Generator<any, any, any>,
  permissions: Array<EJwtPermissions>,
  title: TMessage,
  message?: TMessage,
  inputLabel?: TMessage,
) => Generator<any, any, any>;

type TDisplayErrorModalSaga = (title: TMessage, description?: TMessage) => Generator<any, any, any>;

type TSetupSagasConfig = {
  ensurePermissionsArePresentAndRunEffect: TEnsurePermissionsArePresentAndRunEffect;
  displayErrorModalSaga: TDisplayErrorModalSaga;
  waitUntilSmartContractsAreInitialized: () => Generator<any, any, any>;
};

// todo: both of these sagas should be abstracted across the platforms somehow
let ensurePermissionsArePresentAndRunEffect: TEnsurePermissionsArePresentAndRunEffect;
let displayErrorModalSaga: TDisplayErrorModalSaga;
let waitUntilSmartContractsAreInitialized: () => Generator<any, any, any>;

export function setupKycSagas(config: TSetupSagasConfig): () => SagaGenerator<void> {
  ensurePermissionsArePresentAndRunEffect = config.ensurePermissionsArePresentAndRunEffect;
  displayErrorModalSaga = config.displayErrorModalSaga;
  waitUntilSmartContractsAreInitialized = config.waitUntilSmartContractsAreInitialized;
  return function* kycSagas(): Generator<any, any, any> {
    yield fork(neuTakeEvery, kycActions.kycLoadStatusAndData, loadClientData);

    yield fork(neuTakeEvery, kycActions.kycLoadIndividualData, loadIndividualData);
    yield fork(neuTakeEvery, kycActions.kycSubmitPersonalData, submitPersonalData);
    yield fork(neuTakeEvery, kycActions.kycSubmitPersonalDataAndClose, submitPersonalDataAndClose);
    yield fork(
      neuTakeEvery,
      kycActions.kycSubmitPersonalDataNoRedirect,
      submitPersonalDataNoRedirect,
    );
    yield fork(neuTakeEvery, kycActions.kycSubmitPersonalAddress, submitPersonalAddress);
    yield fork(
      neuTakeEvery,
      kycActions.kycSubmitPersonalAddressAndClose,
      submitPersonalAddressAndClose,
    );
    yield fork(neuTakeEvery, kycActions.kycUploadIndividualDocument, uploadIndividualFile);
    yield fork(neuTakeEvery, kycActions.kycLoadIndividualDocumentList, loadIndividualFiles);
    yield fork(neuTakeEvery, kycActions.kycSubmitFinancialDisclosure, submitFinancialDisclosure);

    // Outsourced
    yield fork(neuTakeEvery, kycActions.kycSubmitIndividualRequest, submitIndividualRequest);

    yield fork(neuTakeEvery, kycActions.kycLoadLegalRepresentative, loadLegalRepresentative);
    yield fork(neuTakeEvery, kycActions.kycSubmitLegalRepresentative, submitLegalRepresentative);
    yield fork(
      neuTakeEvery,
      kycActions.kycUploadLegalRepresentativeDocument,
      uploadLegalRepresentativeFile,
    );
    yield fork(
      neuTakeEvery,
      kycActions.kycLoadLegalRepresentativeDocumentList,
      loadLegalRepresentativeFiles,
    );

    yield fork(neuTakeEvery, kycActions.kycSetBusinessType, setBusinessType);
    yield fork(neuTakeEvery, kycActions.kycLoadBusinessData, loadBusinessData);
    yield fork(neuTakeEvery, kycActions.kycSubmitBusinessData, submitBusinessData);
    yield fork(neuTakeEvery, kycActions.kycUploadBusinessDocument, uploadBusinessFile);
    yield fork(neuTakeEvery, kycActions.kycLoadBusinessDocumentList, loadBusinessFiles);

    yield fork(neuTakeEvery, kycActions.kycLoadManagingDirector, loadManagingDirectorsData);
    yield fork(neuTakeEvery, kycActions.kycSubmitManagingDirector, kycSubmitManagingDirector);
    yield fork(
      neuTakeEvery,
      kycActions.kycLoadManagingDirectorDocumentList,
      loadManagingDirectorFiles,
    );
    yield fork(
      neuTakeEvery,
      kycActions.kycSubmitAndUploadManagingDirector,
      submitAndUploadManagingDirector,
    );

    yield fork(neuTakeEvery, kycActions.kycLoadBeneficialOwners, loadBeneficialOwners);
    yield fork(neuTakeEvery, kycActions.kycSubmitBeneficialOwner, updateBeneficialOwner);
    yield fork(neuTakeEvery, kycActions.kycDeleteBeneficialOwner, deleteBeneficialOwner);
    yield fork(throttledKycUploadBeneficialOwnerDocument);
    yield fork(neuTakeEvery, kycActions.kycToggleBeneficialOwnerModal, toggleBeneficialOwnerModal);
    yield fork(
      neuTakeEvery,
      kycActions.kycLoadBeneficialOwnerDocumentList,
      loadBeneficialOwnerFiles,
    );

    yield fork(neuTakeEvery, kycActions.kycSubmitBusinessRequest, submitBusinessRequest);

    yield fork(neuTakeEvery, kycActions.loadBankAccountDetails, loadBankAccountDetails);

    yield fork(
      neuTakeUntil,
      kycActions.kycStartWatching,
      kycActions.kycStopWatching,
      kycStatusRefreshSaga,
    );
  };
}
