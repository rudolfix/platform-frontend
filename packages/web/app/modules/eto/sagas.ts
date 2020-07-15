import { all, fork, put, race, SagaGenerator, select, take } from "@neufund/sagas";
import {
  authModuleAPI,
  coreModuleApi,
  EAgreementType,
  EEtoAgreementStatus,
  EEtoDocumentType,
  EETOStateOnChain,
  etoModuleApi,
  IEtoDocument,
  immutableDocumentName,
  kycApi,
  neuGetBindings,
  TEtoSpecsData,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { Dictionary, ECountries, invariant } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { camelCase, isString } from "lodash";

import { IWindowWithData } from "../../../test/helperTypes";
import { getInvestorDocumentTitles, hashFromIpfsLink } from "../../components/documents/utils";
import { DocumentConfidentialityAgreementModal } from "../../components/modals/document-confidentiality-agreement-modal/DocumentConfidentialityAgreementModal";
import { JurisdictionDisclaimerModal } from "../../components/modals/jurisdiction-disclaimer-modal/JurisdictionDisclaimerModal";
import { TGlobalDependencies } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { ETxType } from "../../lib/web3/types";
import { TAppGlobalState } from "../../store";
import { TTranslatedString } from "../../types";
import { actions, TActionFromCreator } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectTxAdditionalData, selectTxType } from "../tx/sender/selectors";
import { getAgreementContractAndHash } from "../tx/transactions/nominee/sign-agreement/sagas";
import { IAgreementContractAndHash } from "../tx/transactions/nominee/sign-agreement/types";
import { TAdditionalDataByType } from "../tx/types";

function* downloadDocument(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoModuleApi.actions.downloadEtoDocument>,
): Generator<any, any, any> {
  const { logger, documentsConfidentialityAgreementsStorage } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    documentsConfidentialityAgreementsStorage: symbols.documentsConfidentialityAgreementsStorage,
  });

  const { document, eto } = action.payload;

  const isUserFullyVerified: ReturnType<typeof kycApi.selectors.selectIsUserVerified> = yield select(
    kycApi.selectors.selectIsUserVerified,
  );

  invariant(
    etoModuleApi.utils.canShowDocument(document, isUserFullyVerified),
    "Non visible documents can't be downloaded",
  );

  const userId: ReturnType<typeof authModuleAPI.selectors.selectUserId> = yield select(
    authModuleAPI.selectors.selectUserId,
  );

  const etoConfidentialAgreements = getDocumentsRequiredConfidentialityAgreements(eto.previewCode);

  // for guest users we always require agreement acceptance
  const isAgreementAlreadyAccepted = userId
    ? yield documentsConfidentialityAgreementsStorage.isAgreementAccepted(
        userId,
        eto.previewCode,
        document.documentType,
      )
    : false;

  if (
    // document requires confidential agreement
    etoConfidentialAgreements.includes(document.documentType) &&
    // user not associated with the eto (aka issuer or nominee)
    userId !== undefined &&
    !etoModuleApi.utils.isUserAssociatedWithEto(eto, userId) &&
    // agreement not yet accepted
    !isAgreementAlreadyAccepted
  ) {
    const documentTitles: { [key: string]: TTranslatedString } = getInvestorDocumentTitles(
      eto.product.offeringDocumentType,
    );

    yield put(
      actions.genericModal.showModal(DocumentConfidentialityAgreementModal, {
        documentTitle: documentTitles[document.documentType],
        companyName: eto.company.name,
      }),
    );

    const { confirmed, denied } = yield race({
      confirmed: take(etoModuleApi.actions.confirmConfidentialityAgreement),
      denied: take(actions.genericModal.hideGenericModal),
    });

    if (denied) {
      logger.info(
        `Confidentiality agreement acceptance denied of '${document.documentType}' document for eto '${eto.previewCode}'`,
      );
    }

    if (confirmed) {
      yield put(actions.genericModal.hideGenericModal());

      yield documentsConfidentialityAgreementsStorage.markAgreementAsAccepted(
        userId,
        eto.previewCode,
        document.documentType,
      );

      yield download(document);
    }
  } else {
    yield download(document);
  }
}

function* download(document: IEtoDocument): Generator<any, any, any> {
  yield put(
    actions.immutableStorage.downloadImmutableFile(
      {
        ipfsHash: document.ipfsHash,
        mimeType: document.mimeType,
        asPdf: true,
      },
      immutableDocumentName[document.documentType],
    ),
  );
}

function* downloadTemplateByType(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof etoModuleApi.actions.downloadEtoTemplateByType>,
): any {
  const state: TAppGlobalState = yield select();
  const eto = etoModuleApi.selectors.selectEtoById(state, action.payload.etoId);
  if (eto) {
    yield download(eto.templates[camelCase(action.payload.documentType)]);
  }
}

function getDocumentsRequiredConfidentialityAgreements(previewCode: string): EEtoDocumentType[] {
  let ishaRequirements = process.env.NF_ISHA_CONFIDENTIALITY_REQUIREMENTS;

  // TODO: Remove after to add an ability to overwrite feature flags at runtime
  // https://github.com/Neufund/platform-frontend/pull/3243
  if (process.env.NF_CYPRESS_RUN === "1") {
    const { nfISHAConfidentialityAgreementsRequirements } = window as IWindowWithData;
    ishaRequirements = nfISHAConfidentialityAgreementsRequirements || ishaRequirements;
  }

  if (ishaRequirements && isString(ishaRequirements)) {
    if (ishaRequirements.split(",").includes(previewCode)) {
      return [EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT_PREVIEW];
    }
  }

  return [];
}

export function* issuerFlowLoadAgreementsStatus(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof etoModuleApi.actions.loadEtoAgreementsStatus>,
): Generator<any, any, any> {
  const statuses: Dictionary<EEtoAgreementStatus, EAgreementType> = yield neuCall(
    loadAgreementsStatus,
    payload.eto,
  );

  yield put(etoModuleApi.actions.setAgreementsStatus(payload.eto.previewCode, statuses));
}

// TODO: Move to generic eto module (the one that's not specific to investor/issuer/nominee eto)
function* loadAgreementStatus(
  _: TGlobalDependencies,
  agreementType: EAgreementType,
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    if (!etoModuleApi.utils.isOnChain(eto)) {
      return EEtoAgreementStatus.NOT_DONE;
    }

    const { contract, currentAgreementHash }: IAgreementContractAndHash = yield neuCall(
      getAgreementContractAndHash,
      agreementType,
      eto,
    );

    const amendmentsCount: BigNumber | undefined = yield contract.amendmentsCount;

    // if amendments counts equals 0 or undefined we can skip hash check
    if (amendmentsCount === undefined || amendmentsCount.isZero()) {
      return EEtoAgreementStatus.NOT_DONE;
    }

    // agreement indexing starts from 0 so we have to subtract 1 from amendments count
    const currentAgreementIndex = amendmentsCount.sub("1");

    const pastAgreement = yield contract.pastAgreement(currentAgreementIndex);
    const pastAgreementHash = hashFromIpfsLink(pastAgreement[2]);

    if (pastAgreementHash === currentAgreementHash) {
      return EEtoAgreementStatus.DONE;
    }

    return EEtoAgreementStatus.NOT_DONE;
  } catch (e) {
    logger.error(e, `Could not fetch ${agreementType} document status`);
    return EEtoAgreementStatus.ERROR;
  }
}

export function* loadAgreementsStatus(
  _: TGlobalDependencies,
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, any, any> {
  return yield all({
    [EAgreementType.THA]: neuCall(loadAgreementStatus, EAgreementType.THA, eto),
    [EAgreementType.RAAA]: neuCall(loadAgreementStatus, EAgreementType.RAAA, eto),
    [EAgreementType.ISHA]: neuCall(loadISHAStatus, eto),
  });
}

function* loadISHAStatus(
  _: TGlobalDependencies,
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, any, any> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    if (!etoModuleApi.utils.isOnChain(eto)) {
      return EEtoAgreementStatus.NOT_DONE;
    }

    // if eto state is after `Signing` then ISHA agreement was already signed
    if (eto.contract.timedState > EETOStateOnChain.Signing) {
      return EEtoAgreementStatus.DONE;
    }

    return EEtoAgreementStatus.NOT_DONE;
  } catch (e) {
    logger.error(e, `Could not fetch ISHA document status`);
    return EEtoAgreementStatus.ERROR;
  }
}

export function* verifyEtoAccess(
  _: TGlobalDependencies,
  eto: TEtoWithCompanyAndContractReadonly,
  userIsFullyVerified: boolean,
): Generator<any, any, any> {
  // Checks if ETO is an Offer based on
  // @See https://github.com/Neufund/platform-frontend/issues/2789#issuecomment-489084892
  if (etoModuleApi.utils.isRestrictedEto(eto)) {
    if (userIsFullyVerified) {
      const jurisdiction: ReturnType<typeof kycApi.selectors.selectClientJurisdiction> = yield select(
        kycApi.selectors.selectClientJurisdiction,
      );

      if (jurisdiction === undefined) {
        throw new Error("User jurisdiction is not defined");
      }

      if (jurisdiction === ECountries.LIECHTENSTEIN) {
        yield put(actions.routing.goToDashboard());
        return;
      }
    } else {
      yield put(
        actions.genericModal.showModal(JurisdictionDisclaimerModal, {
          restrictedJurisdiction: ECountries.LIECHTENSTEIN,
        }),
      );

      const { confirmed, denied } = yield race({
        confirmed: take(etoModuleApi.actions.confirmJurisdictionDisclaimer),
        denied: take(actions.genericModal.hideGenericModal),
      });

      if (denied) {
        yield put(actions.routing.goHome());
      }

      if (confirmed) {
        yield put(actions.genericModal.hideGenericModal());
      }
    }
  }
}

function* updateEtoAndTokenData(_: TGlobalDependencies): Generator<any, any, any> {
  const txType = yield select(selectTxType);

  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  // Return if transaction type is not Claim or Refund
  if (txType !== ETxType.USER_CLAIM && txType !== ETxType.INVESTOR_REFUND) {
    return;
  }

  const additionalData: TAdditionalDataByType<ETxType.USER_CLAIM> = yield select(
    selectTxAdditionalData,
  );

  try {
    yield neuCall(fetchEto, additionalData.etoId);
  } catch (e) {
    logger.error(e, "Could not load eto by id");
  }
}

function* fetchEto(_: TGlobalDependencies, etoId: string): any {
  const { apiEtoService } = yield* neuGetBindings({
    apiEtoService: etoModuleApi.symbols.etoApi,
  });

  const eto: TEtoSpecsData = yield apiEtoService.getEto(etoId);
  yield neuCall(etoModuleApi.sagas.loadAdditionalEtoData, eto);
}

export function setupEtoSagas(): () => SagaGenerator<void> {
  return function* etoSagas(): Generator<any, any, any> {
    yield fork(
      neuTakeEvery,
      etoModuleApi.actions.loadEtoAgreementsStatus,
      issuerFlowLoadAgreementsStatus,
    );

    yield fork(neuTakeEvery, etoModuleApi.actions.downloadEtoDocument, downloadDocument);
    yield fork(
      neuTakeEvery,
      etoModuleApi.actions.downloadEtoTemplateByType,
      downloadTemplateByType,
    );

    // Update  eto and token data on successfully mined transaction
    yield fork(neuTakeEvery, actions.txSender.txSenderTxMined, updateEtoAndTokenData);
  };
}
