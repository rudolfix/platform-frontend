import { camelCase } from "lodash";
import { compose, keyBy, map, omit } from "lodash/fp";
import { LOCATION_CHANGE } from "react-router-redux";
import { delay } from "redux-saga";
import { all, fork, put, race, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EEtoState,
  TCompanyEtoData,
  TEtoSpecsData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { EtherToken } from "../../lib/contracts/EtherToken";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { EuroToken } from "../../lib/contracts/EuroToken";
import { IAppState } from "../../store";
import { Dictionary } from "../../types";
import { actions, TAction } from "../actions";
import { selectUserType } from "../auth/selectors";
import { neuCall, neuFork, neuTakeEvery, neuTakeUntil } from "../sagasUtils";
import { etoInProgressPoolingDelay, etoNormalPoolingDelay } from "./constants";
import { InvalidETOStateError } from "./errors";
import {
  selectEtoOnChainNextStateStartDate,
  selectEtoWithCompanyAndContract,
  selectPublicEtoById,
} from "./selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "./types";
import { convertToEtoTotalInvestment, convertToStateStartDate } from "./utils";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO_PREVIEW") return;
  const previewCode = action.payload.previewCode;

  try {
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const eto = etoResponse.body;
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EEtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);

    notificationCenter.error("Could not load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEto(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO") return;

  try {
    const etoId = action.payload.etoId;

    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEto(etoId);
    const eto = etoResponse.body;

    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EEtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by id", e);

    notificationCenter.error("Could not load ETO. Is the link correct?");

    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEtoContact(
  { contractsService, logger }: TGlobalDependencies,
  eto: TPublicEtoData,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) {
    logger.error("Invalid eto state", new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN), {
      etoId: eto.etoId,
    });
    return;
  }

  try {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    const etherTokenContract: EtherToken = contractsService.etherToken;
    const euroTokenContract: EuroToken = contractsService.euroToken;

    // fetch eto contracts state with 'all' to improve performance
    const [
      etherTokenBalance,
      euroTokenBalance,
      timedStateRaw,
      totalInvestmentRaw,
      startOfStatesRaw,
      equityTokenAddress,
      etoTermsAddress,
      etoCommitmentAddress,
    ] = yield all([
      etherTokenContract.balanceOf(etoContract.address),
      euroTokenContract.balanceOf(etoContract.address),
      etoContract.timedState,
      etoContract.totalInvestment(),
      etoContract.startOfStates,
      etoContract.equityToken,
      etoContract.etoTerms,
      etoContract.address,
    ]);

    yield put(
      actions.publicEtos.setEtoDataFromContract(eto.previewCode, {
        equityTokenAddress,
        etoTermsAddress,
        etoCommitmentAddress,
        timedState: timedStateRaw.toNumber(),
        totalInvestment: convertToEtoTotalInvestment(
          totalInvestmentRaw,
          euroTokenBalance,
          etherTokenBalance,
        ),
        startOfStates: convertToStateStartDate(startOfStatesRaw),
      }),
    );
  } catch (e) {
    logger.error("ETO contract data could not be loaded", e, { etoId: eto.etoId });
  }
}

function* watchEtoSetAction(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_SET_PUBLIC_ETO") return;

  const previewCode = action.payload.eto.previewCode;

  yield neuFork(watchEto, previewCode);
}

function* watchEtosSetAction(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_SET_PUBLIC_ETOS") return;

  yield all(map(eto => neuFork(watchEto, eto.previewCode), action.payload.etos));
}

const etoNextStateCount: Dictionary<number | undefined> = {};
function* calculateNextStateDelay({ logger }: TGlobalDependencies, previewCode: string): any {
  const nextStartDate: Date | undefined = yield select((state: IAppState) =>
    selectEtoOnChainNextStateStartDate(state, previewCode),
  );

  if (nextStartDate) {
    const timeToNextState = nextStartDate.getTime() - Date.now();

    if (timeToNextState > 0) {
      etoNextStateCount[previewCode] = undefined;
      // add small delay to start date to avoid fetching eto in same state
      return timeToNextState + 2000;
    }

    // if timeToNextState is negative then user and ethereum clock are not in sync
    // in that case pool eto in two time intervals of 2 and 5 seconds
    // if after than state time is still negative log warning message
    const nextStateWatchCount = etoNextStateCount[previewCode];
    if (nextStateWatchCount === undefined) {
      etoNextStateCount[previewCode] = 1;
      return 2000;
    }

    if (nextStateWatchCount === 1) {
      etoNextStateCount[previewCode] = 2;
      return 5000;
    }

    logger.warn(
      "ETO next state pooling failed.",
      new Error("User and ethereum clocks are not in sync"),
      { etoPreviewCode: previewCode },
    );
  }

  return undefined;
}

function* watchEto(_: TGlobalDependencies, previewCode: string): any {
  const eto: TEtoWithCompanyAndContract = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContract(state, previewCode),
  );

  let strategies: Dictionary<Promise<true>> = {
    default: delay(etoNormalPoolingDelay),
  };

  if (eto.state === EEtoState.ON_CHAIN) {
    if ([EETOStateOnChain.Whitelist, EETOStateOnChain.Public].includes(eto.contract!.timedState)) {
      strategies.inProgress = delay(etoInProgressPoolingDelay);
    }

    const nextStateDelay: number = yield neuCall(calculateNextStateDelay, previewCode);
    if (nextStateDelay) {
      strategies.nextState = delay(nextStateDelay);
    }
  }

  yield race(strategies);

  yield put(actions.publicEtos.loadEtoPreview(previewCode));
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etosResponse: IHttpResponse<TPublicEtoData[]> = yield apiEtoService.getEtos();
    const etos = etosResponse.body;

    const companies = compose(
      keyBy((eto: TCompanyEtoData) => eto.companyId),
      map((eto: TPublicEtoData) => eto.company),
    )(etos);

    const etosByPreviewCode = compose(
      keyBy((eto: TEtoSpecsData) => eto.previewCode),
      // remove company prop from eto
      // it's saved separately for consistency with other endpoints
      map(omit("company")),
    )(etos);

    const order = etosResponse.body.map(eto => eto.previewCode);

    yield all(
      order
        .map(id => etosByPreviewCode[id])
        .filter(eto => eto.state === EEtoState.ON_CHAIN)
        .map(eto => neuCall(loadEtoContact, eto)),
    );

    // load investor tickets
    const userType: EUserType | undefined = yield select((state: IAppState) =>
      selectUserType(state),
    );
    if (userType === EUserType.INVESTOR) {
      yield put(actions.investorEtoTicket.loadInvestorTickets(etosByPreviewCode));
    }

    yield put(actions.publicEtos.setPublicEtos({ etos: etosByPreviewCode, companies }));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e);
  }
}

function* download(document: IEtoDocument): any {
  if (document) {
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
}

function* downloadDocument(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_DOWNLOAD_DOCUMENT") return;

  yield download(action.payload.document);
}

function* downloadTemplateByType(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE") return;
  const state: IAppState = yield select();
  const eto = selectPublicEtoById(state, action.payload.etoId);
  if (eto) {
    yield download(eto.templates[camelCase(action.payload.documentType)]);
  }
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO_PREVIEW", loadEtoPreview);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO", loadEto);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETOS", loadEtos);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_DOWNLOAD_DOCUMENT", downloadDocument);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE", downloadTemplateByType);
  yield fork(neuTakeUntil, "PUBLIC_ETOS_SET_PUBLIC_ETO", LOCATION_CHANGE, watchEtoSetAction);
  yield fork(neuTakeUntil, "PUBLIC_ETOS_SET_PUBLIC_ETOS", LOCATION_CHANGE, watchEtosSetAction);
}
