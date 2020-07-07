import { actionChannel, neuCall, put, select, TActionFromCreator, take } from "@neufund/sagas";

import { createMessage } from "../../../messages";
import { neuGetBindings } from "../../../utils";
import { coreModuleApi, IHttpResponse } from "../../core/module";
import { notificationUIModuleApi } from "../../notification-ui/module";
import { kycActions } from "../actions";
import {
  IKycBeneficialOwner,
  IKYCBeneficialOwnerBusiness,
  IKYCBeneficialOwnerPerson,
  IKycFileInfo,
} from "../lib/http/kyc-api/KycApi.interfaces";
import { KycFlowMessage } from "../messages";
import { TKycModuleState } from "../module";
import { selectEditingBeneficiaryId } from "../selectors";
import { symbols } from "../symbols";
import { getBeneficialOwnerId } from "../utils";

type TGlobalDependencies = unknown;

// TODO: Remove when not needed. This adds additional fields required by backend
const ownerRequestObjectTransform = (owner: IKycBeneficialOwner): IKycBeneficialOwner => ({
  ...owner,
  ownership: 1,
});

export function* loadBeneficialOwners(_: TGlobalDependencies): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  try {
    yield put(kycActions.kycUpdateBeneficialOwners(true));
    const result: IHttpResponse<IKycBeneficialOwner[]> = yield apiKycService.getBeneficialOwners();
    yield put(kycActions.kycUpdateBeneficialOwners(false, result.body));
  } catch (e) {
    yield put(kycActions.kycUpdateBeneficialOwners(false));

    logger.error(e, "Failed to load KYC beneficial owners");
  }
}

export function* updateBeneficialOwner(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitBeneficialOwner>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });

  const { owner, id } = action.payload;

  try {
    if (owner.person) {
      (owner.person as IKYCBeneficialOwnerPerson).id = id;
    } else {
      (owner.business as IKYCBeneficialOwnerBusiness).id = id;
    }

    yield put(kycActions.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.putBeneficialOwner(
      ownerRequestObjectTransform(owner),
    );
    yield put(
      kycActions.kycUpdateBeneficialOwner(false, getBeneficialOwnerId(result.body), result.body),
    );
    yield put(kycActions.kycToggleBeneficialOwnerModal(false));
  } catch (e) {
    yield put(kycActions.kycUpdateBeneficialOwner(false));

    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SAVING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC beneficial owner");
  }
}

export function* deleteBeneficialOwner(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycDeleteBeneficialOwner>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  const beneficialOwnerId = action.payload.id;
  try {
    yield put(kycActions.kycUpdateBeneficialOwner(true));
    yield apiKycService.deleteBeneficialOwner(beneficialOwnerId);
    yield put(kycActions.kycToggleBeneficialOwnerModal(false));
    yield put(kycActions.kycUpdateBeneficialOwner(false, beneficialOwnerId, undefined));
  } catch (e) {
    yield put(kycActions.kycUpdateBeneficialOwner(false));

    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to delete KYC beneficial owner");
  }
}

export function* uploadBeneficialOwnerFile(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycUploadBeneficialOwnerDocument>,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  const state: TKycModuleState = yield* select();
  const { file, values } = action.payload;
  let boId = selectEditingBeneficiaryId(state);

  if (!boId) {
    // TODO move to separate func
    yield put(kycActions.kycUpdateBeneficialOwner(true));
    const result: IHttpResponse<IKycBeneficialOwner> = yield apiKycService.postBeneficialOwner(
      ownerRequestObjectTransform(values),
    );
    boId = getBeneficialOwnerId(result.body);
    yield put(kycActions.kycUpdateBeneficialOwner(false, boId, result.body));
    yield put(kycActions.kycToggleBeneficialOwnerModal(true, boId));
  }

  try {
    yield put(kycActions.kycUpdateBeneficialOwnerDocument(boId, true));
    const result: IHttpResponse<IKycFileInfo> = yield apiKycService.uploadBeneficialOwnerDocument(
      boId,
      file,
    );
    yield put(kycActions.kycUpdateBeneficialOwnerDocument(boId, false, result.body));
    yield put(
      notificationUIModuleApi.actions.showInfo(createMessage(KycFlowMessage.KYC_UPLOAD_SUCCESSFUL)),
    );
  } catch (e) {
    yield put(kycActions.kycUpdateBeneficialOwnerDocument(boId, false));

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_UPLOAD_FAILED)),
    );

    logger.error(e, "Failed to upload KYC beneficial owner file");
  }
}

export function* throttledKycUploadBeneficialOwnerDocument(): Generator<any, any, any> {
  const channel = yield actionChannel(kycActions.kycUploadBeneficialOwnerDocument);
  while (true) {
    const action = yield take(channel);
    yield neuCall(uploadBeneficialOwnerFile, action);
  }
}

export function* loadBeneficialOwnerFiles(
  _: TGlobalDependencies,
  action: TActionFromCreator<
    typeof kycActions,
    typeof kycActions.kycLoadBeneficialOwnerDocumentList
  >,
): Generator<any, any, any> {
  const { logger, apiKycService } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    apiKycService: symbols.kycApi,
  });
  const { boid } = action.payload;
  try {
    yield put(kycActions.kycUpdateBeneficialOwnerDocuments(boid, true));
    const result: IHttpResponse<IKycFileInfo[]> = yield apiKycService.getBeneficialOwnerDocuments(
      boid,
    );
    yield put(kycActions.kycUpdateBeneficialOwnerDocuments(boid, false, result.body));
  } catch (e) {
    yield put(kycActions.kycUpdateBeneficialOwnerDocuments(boid, false));

    logger.error(e, "Failed to load KYC beneficial owner file");
  }
}

export function* toggleBeneficialOwnerModal(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycToggleBeneficialOwnerModal>,
): Generator<any, any, any> {
  const { boId } = action.payload;
  if (boId) {
    yield put(kycActions.kycLoadBeneficialOwnerDocumentList(boId));
  }
}
