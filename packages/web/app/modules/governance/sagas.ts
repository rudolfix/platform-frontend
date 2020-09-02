import {
  all,
  call,
  channel,
  Channel,
  delay,
  flush,
  fork,
  neuCall,
  put,
  race,
  SagaGenerator,
  select,
  spawn,
  take,
} from "@neufund/sagas";
import {
  coreModuleApi,
  EJwtPermissions,
  EResolutionDocumentType,
  etoModuleApi,
  neuGetBindings,
  TEtoSpecsData,
} from "@neufund/shared-modules";
import {
  DataUnavailableError,
  GovernanceIncompatibleError,
  GovernanceNotSetUpError,
  secondsToMs,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import cryptoRandomString from "crypto-random-string";
import { addHexPrefix } from "ethereumjs-util";
import { isEqual } from "lodash/fp";

import { EMimeType } from "../../components/shared/forms";
import {
  EGovernanceErrorMessage,
  EtoDocumentsMessage,
  ValidationMessage,
} from "../../components/translatedMessages/messages";
import {
  createMessage,
  createNotificationMessage,
} from "../../components/translatedMessages/utils";
import { RESOLUTION_WATCHER_DELAY } from "../../config/constants";
import { symbols } from "../../di/symbols";
import { IControllerGovernance } from "../../lib/contracts/IControllerGovernance";
import { IEquityToken } from "../../lib/contracts/IEquityToken";
import { EProcessState } from "../../utils/enums/processStates";
import { actions, TActionFromCreator } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { etoFlowActions } from "../eto-flow/actions";
import { loadIssuerEto } from "../eto-flow/sagas";
import { selectIssuerCompany, selectIssuerEto } from "../eto-flow/selectors";
import { webNotificationUIModuleApi } from "../notification-ui/module";
import { neuTakeLatest } from "../sagasUtils";
import { GOVERNANCE_CONTRACT_ID } from "./constants";
import {
  maxStringLengthValidation,
  minStringLengthValidation,
  setFormValue,
  validateForm,
} from "./formUtils";
import { selectGovernanceData, selectGovernanceVisible } from "./selectors";
import {
  documentUploadStateIsSuccess,
  documentUploadStatusIsSuccess,
  EGovernanceControllerState,
  EModalState,
  EResolutionState,
  hasCloseGovernanceUpdateModal,
  hasDownloadDocument,
  hasOnFormBlur,
  hasOnFormChange,
  hasOpenGovernanceUpdateModal,
  hasPublishUpdate,
  hasRemoveFile,
  hasUpdatePublishSuccess,
  hasUpdateResolution,
  hasUploadFile,
  modalStateIsOpen,
  TDocumentUploadResponse,
  TGovernanceViewState,
  TGovernanceViewSuccessState,
  TResolution,
  TResolutionDocumentUploadResult,
  TUpdate,
} from "./types";
import { convertGovernanceActionNumberToEnum } from "./utils";

type TGlobalDependencies = unknown;

export function* selectGovernanceController(
  equityTokenContractAddress: string,
): Generator<any, IControllerGovernance, any> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
  });

  const tokenControllerHook: IEquityToken = yield contractsService.getEquityToken(
    equityTokenContractAddress,
  );
  const tokenController = yield tokenControllerHook.tokenController;
  const governanceController: IControllerGovernance = yield contractsService.getControllerGovernance(
    tokenController,
  );

  return governanceController;
}

function* checkGovernanceVisibility(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoFlowActions.setEto>,
): Generator<any, void, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  const eto: TEtoSpecsData = action.payload.eto;

  if (eto.equityTokenContractAddress) {
    const governanceController: IControllerGovernance = yield* call(
      selectGovernanceController,
      eto.equityTokenContractAddress,
    );
    const controllerState: BigNumber = yield governanceController.state;

    const visibility =
      controllerState && controllerState.toString() !== EGovernanceControllerState.SETUP.toString();
    logger.info("Governance visibility:" + visibility);
    yield put(actions.governance.setGovernanceVisibility(visibility));
  } else {
    logger.info("Governance not visible for ETO" + eto.etoId);
    yield put(actions.governance.setGovernanceVisibility(false));
  }
}

function* checkGovernanceCompatibility(eto: TEtoSpecsData): Generator<any, boolean, any> {
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );
  const contractId = yield governanceController.contractId();
  return contractId[0] === GOVERNANCE_CONTRACT_ID;
}

function* loadFullResolutionForId(
  company: {
    documents: {
      [key: string]: {
        title: string;
        name: string;
        ipfsHash: string;
        size: number;
        resolutionId: string;
      };
    };
  },
  resolution: TResolution,
): Generator<any, TResolution, any> {
  const foundData = Object.entries(company.documents).find(
    ([, document]) => document.resolutionId === resolution.id,
  );
  const resolutionData = foundData && foundData[1];
  if (resolutionData) {
    return {
      resolutionState: EResolutionState.FULL as const,
      action: resolution.action,
      id: resolution.id,
      draft: false,
      startedAt: resolution.startedAt,
      title: resolutionData.title,
      documentName: resolutionData.name,
      documentHash: resolutionData.ipfsHash,
      documentSize: resolutionData.size.toString(),
    };
  } else {
    return resolution;
  }
}

function* loadResolutionForId(
  governanceController: IControllerGovernance,
  id: string,
): Generator<any, TResolution, any> {
  const [action, , startedAt] = yield governanceController.resolution(id);
  // TODO fix typings for etoIssuer!!!!
  const company = yield select(selectIssuerCompany);

  if (company === undefined) {
    throw new DataUnavailableError("company data cannot be missing at this point!");
  }
  const basicResolution = {
    resolutionState: EResolutionState.BASIC as const,
    action: convertGovernanceActionNumberToEnum(action),
    id,
    draft: false,
    startedAt: new Date(secondsToMs(startedAt.toNumber())),
  };

  return yield call(loadFullResolutionForId, company, basicResolution);
}

function* loadResolutionData(
  governanceController: IControllerGovernance,
): Generator<any, TResolution[], any> {
  const resolutionsList = yield governanceController.resolutionsList;
  return yield all(
    resolutionsList.map((resolutionId: string) =>
      call(loadResolutionForId, governanceController, resolutionId),
    ),
  );
}

//TODO the following should go to a separate saga in etoApi
function* getEto(): Generator<any, TEtoSpecsData, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  let eto = yield* select(selectIssuerEto);
  if (!eto) {
    yield neuCall(loadIssuerEto);
    // wait for eto to load
    yield take(actions.governance.setGovernanceVisibility);

    eto = yield select(selectIssuerEto);
    if (!eto) {
      logger.info("loadIssuerEto encountered an exception, couldn't load Governance");
      throw new DataUnavailableError("loadIssuerEto: issuerEto cannot be missing at this point");
    }
  }
  return eto;
}

//todo move to utils
const resolutionsNeedUpdate = (resolutions: TResolution[]): TResolution[] =>
  resolutions.reduce((acc: TResolution[], resolution) => {
    if (resolution.resolutionState === EResolutionState.BASIC) {
      acc.push(resolution);
    }
    return acc;
  }, []);

const dedupeResolutions = <T>(arr: T[]): T[] => [...new Set(arr)];

function* resolutionsUpdateChannelSaga(
  resolutionsUpdateChannel: Channel<TResolution>,
): Generator<any, void, any> {
  let resolutionsToBeUpdated: TResolution[] = [];
  while (true) {
    const updateRequests = yield flush(resolutionsUpdateChannel);
    resolutionsToBeUpdated = resolutionsToBeUpdated.concat(updateRequests);

    const resolutionsDeduped = dedupeResolutions(resolutionsToBeUpdated);
    yield neuCall(loadIssuerEto);
    const company = yield select(selectIssuerCompany);

    const newResolutions = yield* all(
      resolutionsDeduped.map(resolution => call(loadFullResolutionForId, company, resolution)),
    );
    const updatedResolutions = newResolutions.filter(
      r => r.resolutionState === EResolutionState.FULL,
    );

    yield put(actions.governance.resolutionUpdateReceived(updatedResolutions));
    yield delay(RESOLUTION_WATCHER_DELAY);
  }
}

function* resolutionsUpdateWatcherSaga(): Generator<any, void, any> {
  const resolutionsUpdateChannel = channel<TResolution>();
  yield fork(resolutionsUpdateChannelSaga, resolutionsUpdateChannel);

  while (true) {
    const { payload: resolution } = yield take(actions.governance.resolutionUpdateRequested);
    yield put(resolutionsUpdateChannel, resolution);
  }
}

export function* loadInitialGeneralInformationView(): Generator<any, void, any> {
  const eto = yield* call(getEto);
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );

  const resolutions = yield* call(loadResolutionData, governanceController);
  yield all(
    resolutionsNeedUpdate(resolutions).map(resolution =>
      put(actions.governance.resolutionUpdateRequested(resolution)),
    ),
  );

  const company = yield* select(selectIssuerCompany);
  if (!company) {
    throw new DataUnavailableError(
      "loadInitialGeneralInformationView: issuer company cannot be missing at this stage",
    );
  }

  const oldState = yield* select(selectGovernanceData);

  const newState = {
    processState: EProcessState.SUCCESS,
    tabVisible: oldState.tabVisible,
    resolutions,
    companyBrandName: company.brandName,
    governanceUpdateModalState: { modalState: EModalState.CLOSED },
  } as const;

  yield put(actions.governance.setGovernanceUpdateData(newState));
}

export enum EGovernanceUpdateModalFormElements {
  GOVERNANCE_UPDATE_TITLE_FORM = "governanceUpdateTitleForm",
  GOVERNANCE_UPDATE_TITLE_FORM_UPDATE_TITLE = "governanceUpdateTitleForm.updateTitle",
}

export const initialGovernanceUpdateModalState = {
  modalState: EModalState.OPEN as const,
  documentUploadState: { documentUploadStatus: EProcessState.NOT_STARTED as const },
  governanceUpdateTitleForm: {
    id: EGovernanceUpdateModalFormElements.GOVERNANCE_UPDATE_TITLE_FORM,
    validations: [],
    errors: [],
    isValid: false,
    showErrors: false,
    disabled: false,
    fields: {
      updateTitle: {
        validations: [
          minStringLengthValidation(1, createMessage(ValidationMessage.VALIDATION_FIELD_REQIRED)),
          maxStringLengthValidation(
            60,
            createMessage(ValidationMessage.VALIDATION_STRING_TOO_LONG, 60),
          ),
        ],
        id: EGovernanceUpdateModalFormElements.GOVERNANCE_UPDATE_TITLE_FORM_UPDATE_TITLE,
        value: "",
        errors: [],
        isValid: false,
        showErrors: false,
        disabled: false,
      },
    },
  },
  publishButtonDisabled: true,
};

function generateResolutionId(): string {
  return addHexPrefix(cryptoRandomString({ length: 64 }));
}

function* uploadGovernanceDocumentEffect(
  file: File,
  documentType: EResolutionDocumentType,
  resolutionId: string,
  updateTitle: string,
): Generator<any, TDocumentUploadResponse, any> {
  const { apiEtoService } = yield* neuGetBindings({
    apiEtoService: etoModuleApi.symbols.etoApi,
  });
  return yield apiEtoService.uploadGovernanceDocument(
    file,
    documentType,
    updateTitle,
    resolutionId,
  );
}

function* uploadGovernanceDocument(
  file: File,
  documentType: EResolutionDocumentType,
  resolutionId: string,
  updateTitle: string,
): Generator<any, TResolutionDocumentUploadResult, any> {
  return yield neuCall(
    ensurePermissionsArePresentAndRunEffect,
    call(uploadGovernanceDocumentEffect, file, documentType, resolutionId, updateTitle),
    [EJwtPermissions.UPLOAD_IMMUTABLE_DOCUMENT],
    createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE),
    createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION),
  );
}

// --- UPDATES ---
function* uploadFileUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  { uploadFile }: { uploadFile: ReturnType<typeof actions.governance.uploadFile> },
): Generator<any, TGovernanceViewState, any> {
  if (modalStateIsOpen(oldState.governanceUpdateModalState)) {
    const { file } = uploadFile.payload;
    const newDocumentUploadState = {
      documentUploadStatus: EProcessState.SUCCESS,
      document: file,
    } as const;
    const publishButtonDisabled = !(
      oldState.governanceUpdateModalState.governanceUpdateTitleForm.isValid &&
      newDocumentUploadState.documentUploadStatus === EProcessState.SUCCESS
    );

    return {
      ...oldState,
      governanceUpdateModalState: {
        ...oldState.governanceUpdateModalState,
        documentUploadState: newDocumentUploadState,
        publishButtonDisabled,
      },
    } as const;
  } else {
    return oldState;
  }
}

function* removeFileUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  _updateData: { removeFile: ReturnType<typeof actions.governance.removeFile> },
): Generator<any, TGovernanceViewState, any> {
  if (modalStateIsOpen(oldState.governanceUpdateModalState)) {
    const newDocumentUploadState = {
      documentUploadStatus: EProcessState.NOT_STARTED as const,
    };
    const publishButtonDisabled = true;

    return {
      ...oldState,
      governanceUpdateModalState: {
        ...oldState.governanceUpdateModalState,
        documentUploadState: newDocumentUploadState,
        publishButtonDisabled,
      },
    } as const;
  } else {
    return oldState;
  }
}

function* onFormChangeUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  { onFormChange }: { onFormChange: ReturnType<typeof actions.governance.onFormChange> },
): Generator<any, TGovernanceViewState, any> {
  const { fieldPath, newValue } = onFormChange.payload;
  return yield call(onFormUpdate, oldState, fieldPath, newValue);
}

function* onFormBlurUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  { onFormBlur }: { onFormBlur: ReturnType<typeof actions.governance.onFormBlur> },
): Generator<any, TGovernanceViewState, any> {
  const { fieldPath, newValue } = onFormBlur.payload;
  return yield call(onFormUpdate, oldState, fieldPath, newValue);
}

function onFormUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  fieldPath: string,
  newValue: string,
): TGovernanceViewState {
  if (modalStateIsOpen(oldState.governanceUpdateModalState)) {
    const newForm = setFormValue(
      oldState.governanceUpdateModalState.governanceUpdateTitleForm,
      fieldPath,
      newValue,
    );
    const formValidated = validateForm(newForm, newForm);
    const publishButtonDisabled = !(
      formValidated.isValid &&
      oldState.governanceUpdateModalState.documentUploadState.documentUploadStatus ===
        EProcessState.SUCCESS
    );

    return {
      ...oldState,
      governanceUpdateModalState: {
        ...oldState.governanceUpdateModalState,
        governanceUpdateTitleForm: newForm,
        publishButtonDisabled,
      },
    };
  } else {
    return oldState;
  }
}

function* closeGovernanceUpdateModalUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  _updateData: {
    closeGovernanceUpdateModal: ReturnType<typeof actions.governance.closeGovernanceUpdateModal>;
  },
): Generator<any, TGovernanceViewState, any> {
  return {
    ...oldState,
    governanceUpdateModalState: { modalState: EModalState.CLOSED } as const,
  };
}

function* openGovernanceUpdateModalUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  _updateData: {
    openGovernanceUpdateModal: ReturnType<typeof actions.governance.openGovernanceUpdateModal>;
  },
): Generator<any, TGovernanceViewState, any> {
  return {
    ...oldState,
    governanceUpdateModalState: initialGovernanceUpdateModalState,
  };
}

function* publishUpdate(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  _updateData: { publishUpdate: ReturnType<typeof actions.governance.publishUpdate> },
): Generator<any, TGovernanceViewState, any> {
  if (
    modalStateIsOpen(oldState.governanceUpdateModalState) &&
    documentUploadStatusIsSuccess(oldState.governanceUpdateModalState.documentUploadState)
  ) {
    const updateTitle =
      oldState.governanceUpdateModalState.governanceUpdateTitleForm.fields.updateTitle.value;
    const resolutionId = yield* call(generateResolutionId);

    const resolutionDocumentUploadResult = yield* call(
      uploadGovernanceDocument,
      oldState.governanceUpdateModalState.documentUploadState.document,
      EResolutionDocumentType.RESOLUTION_DOCUMENT,
      resolutionId,
      updateTitle,
    );

    yield put(
      actions.txTransactions.startPublishResolutionUpdate(
        updateTitle,
        resolutionId,
        resolutionDocumentUploadResult.ipfsHash,
      ),
    );
    return {
      ...oldState,
      governanceUpdateModalState: { modalState: EModalState.CLOSED } as const,
    };
  } else {
    return oldState;
  }
}

function* updatePublishSuccessUpdate(
  _oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  _updateData: { updatePublishSuccess: ReturnType<typeof actions.governance.updatePublishSuccess> },
): Generator<any, TGovernanceViewState, any> {
  yield spawn(loadInitialGeneralInformationView);
  return {
    tabVisible: true,
    processState: EProcessState.IN_PROGRESS as const,
  };
}

function* downloadIpfsDocumentSaga(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  {
    downloadIpfsDocument,
  }: { downloadIpfsDocument: ReturnType<typeof actions.governance.downloadIpfsDocument> },
): Generator<any, TGovernanceViewState, any> {
  const { documentHash, documentTitle } = downloadIpfsDocument.payload;
  const fileData = {
    ipfsHash: documentHash,
    mimeType: EMimeType.PDF,
    asPdf: true,
  };
  yield put(actions.immutableStorage.downloadImmutableFile(fileData, documentTitle));
  return oldState;
}

function* updateResolutions(
  oldState: { processState: EProcessState.SUCCESS } & TGovernanceViewSuccessState & {
      tabVisible: boolean;
    },
  {
    resolutionUpdateReceived,
  }: { resolutionUpdateReceived: ReturnType<typeof actions.governance.resolutionUpdateReceived> },
): Generator<any, TGovernanceViewState, any> {
  const { resolutions: updatedResolutions } = resolutionUpdateReceived.payload;

  const resolutions = [...oldState.resolutions];

  updatedResolutions.forEach(updatedResolution => {
    const i = resolutions.findIndex(resolution => resolution.id === updatedResolution.id);
    resolutions[i] = updatedResolution;
  });
  yield all(
    resolutionsNeedUpdate(resolutions).map(resolutionId =>
      put(actions.governance.resolutionUpdateRequested(resolutionId)),
    ),
  );

  return {
    ...oldState,
    resolutions,
  };
}

export function* governanceGeneralInformationViewController(): Generator<any, void, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiEtoService: etoModuleApi.symbols.etoApi,
  });

  try {
    const eto = yield* call(getEto);

    if (!(yield select(selectGovernanceVisible))) {
      throw new GovernanceNotSetUpError();
    } else if (!(yield call(checkGovernanceCompatibility, eto))) {
      throw new GovernanceIncompatibleError(eto.etoId);
    }

    yield fork(resolutionsUpdateWatcherSaga);
    yield* call(loadInitialGeneralInformationView);

    while (true) {
      const oldState = yield* select(selectGovernanceData);
      let newState;
      if (processStateIsSuccess<TGovernanceViewSuccessState & { tabVisible: boolean }>(oldState)) {
        const update: TUpdate = yield* race({
          closeGovernanceUpdateModal: take(actions.governance.closeGovernanceUpdateModal),
          openGovernanceUpdateModal: take(actions.governance.openGovernanceUpdateModal),
          onFormChange: take(actions.governance.onFormChange),
          onFormBlur: take(actions.governance.onFormBlur),
          uploadFile: take(actions.governance.uploadFile),
          removeFile: take(actions.governance.removeFile),
          onFileRemove: take(actions.governance.removeFile),
          publishUpdate: take(actions.governance.publishUpdate),
          updatePublishSuccess: take(actions.governance.updatePublishSuccess),
          downloadIpfsDocument: take(actions.governance.downloadIpfsDocument),
          resolutionUpdateReceived: take(actions.governance.resolutionUpdateReceived),
        });

        if (hasUploadFile(update) && modalStateIsOpen(oldState.governanceUpdateModalState)) {
          newState = yield* call(uploadFileUpdate, oldState, update);
        } else if (hasRemoveFile(update) && modalStateIsOpen(oldState.governanceUpdateModalState)) {
          newState = yield* call(removeFileUpdate, oldState, update);
        } else if (
          hasOnFormChange(update) &&
          modalStateIsOpen(oldState.governanceUpdateModalState)
        ) {
          newState = yield* call(onFormChangeUpdate, oldState, update);
        } else if (hasOnFormBlur(update) && modalStateIsOpen(oldState.governanceUpdateModalState)) {
          newState = yield* call(onFormBlurUpdate, oldState, update);
        } else if (hasCloseGovernanceUpdateModal(update)) {
          newState = yield* call(closeGovernanceUpdateModalUpdate, oldState, update);
        } else if (hasOpenGovernanceUpdateModal(update)) {
          newState = yield* call(openGovernanceUpdateModalUpdate, oldState, update);
        } else if (
          hasPublishUpdate(update) &&
          modalStateIsOpen(oldState.governanceUpdateModalState) &&
          documentUploadStateIsSuccess(oldState.governanceUpdateModalState.documentUploadState)
        ) {
          newState = yield* call(publishUpdate, oldState, update);
        } else if (hasUpdatePublishSuccess(update)) {
          newState = yield* call(updatePublishSuccessUpdate, oldState, update);
        } else if (hasDownloadDocument(update)) {
          newState = yield* call(downloadIpfsDocumentSaga, oldState, update);
        } else if (hasUpdateResolution(update)) {
          newState = yield* call(updateResolutions, oldState, update);
        } else {
          newState = oldState;
        }

        if (!isEqual(newState, oldState)) {
          yield put(actions.governance.setGovernanceUpdateData(newState));
        }
      }
    }
  } catch (e) {
    if (e instanceof GovernanceNotSetUpError) {
      logger.info("Governance not setup");
      yield put(actions.routing.goToDashboard());
    } else if (e instanceof GovernanceIncompatibleError) {
      logger.info("Governance incompatible for ETO: " + e.etoId);

      yield put(actions.routing.goToDashboard());
      yield put(
        webNotificationUIModuleApi.actions.showError(
          createNotificationMessage(EGovernanceErrorMessage.CONTRACT_VERSION_NOT_SUPPORTED),
          {
            ["data-test-id"]: "modules.governance.contract-version-not-supported",
          },
        ),
      );
      return;
    } else {
      //for now rethrow the error to get to the general error screen
      // TODO create a sensible list of errors to be caught here
      throw e;
    }
  }
}

const processStateIsSuccess = <T>(obj: {
  processState: EProcessState;
}): obj is { processState: EProcessState.SUCCESS } & T =>
  obj.processState === EProcessState.SUCCESS;

export function* governanceModuleSagas(): SagaGenerator<void> {
  yield fork(
    neuTakeLatest,
    actions.governance.loadGeneralInformationView,
    governanceGeneralInformationViewController,
  );
  yield fork(neuTakeLatest, etoFlowActions.setEto, checkGovernanceVisibility); //TODO this should be done differently. On routing level.
}
