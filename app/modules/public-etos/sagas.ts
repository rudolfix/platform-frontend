import BigNumber from "bignumber.js";
import { all, fork, put, select } from "redux-saga/effects";

import { keyBy } from "lodash";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EtoState,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { IAppState } from "../../store";
import { convertToBigInt } from "../../utils/Money.utils";
import { actions, TAction } from "../actions";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { InvalidETOStateError } from "./errors";
import { IPublicEtoState } from "./reducer";
import {
  selectCalculatedContributionByEtoId,
  selectEtoById,
} from "./selectors";
import { convertToCalculatedContribution, convertToEtoTotalInvestment } from "./utils";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO_PREVIEW") return;
  const previewCode = action.payload.previewCode;
  const s: IPublicEtoState = yield select((s: IAppState) => s.publicEtos);
  // clear old data, if requesting different eto, otherwise optimistically fetch changes
  if (s.previewEtoData && s.previewEtoData.previewCode !== previewCode) {
    actions.publicEtos.setPreviewEto();
  }

  try {
    const etoData: IHttpResponse<TPartialEtoSpecData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const companyId = etoData.body.companyId as string;
    const companyData: IHttpResponse<TPartialCompanyEtoData> = yield apiEtoService.getCompanyById(
      companyId,
    );
    yield put(
      actions.publicEtos.setPreviewEto({
        eto: etoData.body,
        company: companyData.body,
      }),
    );
  } catch (e) {
    notificationCenter.error("Could not load ETO preview. Is the preview link correct?");
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEto(
  { apiEtoService, notificationCenter }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_ETO") return;

  try {
    const etoId = action.payload.etoId;

    const etoResponse: IHttpResponse<TPublicEtoData> = yield apiEtoService.getEto(etoId);
    const eto = etoResponse.body;

    const companyResponse: IHttpResponse<
      TPartialCompanyEtoData
    > = yield apiEtoService.getCompanyById(eto.companyId);
    const company = companyResponse.body;

    yield put(actions.publicEtos.setPublicEto({ ...eto, company }));

    if (eto.state === EtoState.ON_CHAIN) {
      yield neuCall(loadEtoContact, eto);
    }
  } catch (e) {
    notificationCenter.error("Could not load ETO. Is the link correct?");

    yield put(actions.routing.goToDashboard());
  }
}

function* loadEtoContact({ contractsService, logger }: TGlobalDependencies, eto: TPublicEtoData): any {
  if (eto.state !== EtoState.ON_CHAIN) {
    throw new InvalidETOStateError( eto.state, EtoState.ON_CHAIN);
  }

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  const timedStateRaw = yield etoContract.timedState;
  const totalInvestmentRaw = yield etoContract.totalInvestment();

  yield put(actions.publicEtos.setEtoDataFromContract(eto.etoId, {
    timedState: timedStateRaw.toNumber(),
    totalInvestment: convertToEtoTotalInvestment(totalInvestmentRaw),
  }));
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etosResponse: IHttpResponse<TPublicEtoData[]> = yield apiEtoService.getEtos();

    const etos = keyBy(etosResponse.body, eto => eto.etoId);
    const order = etosResponse.body.map(eto => eto.etoId);

    yield all(
      order
        .map(id => etos[id])
        .filter(eto => eto.state === EtoState.ON_CHAIN)
        .map(eto => neuCall(loadEtoContact, eto))
    );

    yield put(actions.publicEtos.setPublicEtos(etos));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e);
  }
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: TPublicEtoData,
  amountEuroUlps?: string,
  isICBM = false,
): any {
  if (eto.state !== "on_chain") return;

  const state: IAppState = yield select();
  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  if (etoContract) {
    amountEuroUlps =
      amountEuroUlps || convertToBigInt((eto.minTicketEur && eto.minTicketEur.toString()) || "0");

    const from = selectEthereumAddressWithChecksum(state.web3);
    const calculation = yield etoContract.calculateContribution(
      from,
      isICBM,
      new BigNumber(amountEuroUlps),
    );
    yield put(
      actions.publicEtos.setCalculatedContribution(
        eto.etoId,
        convertToCalculatedContribution(calculation),
      ),
    );
  }
}

function* loadCalculatedContribution(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_CALCULATED_CONTRIBUTION") return;
  const state: IPublicEtoState = yield select((s: IAppState) => s.publicEtos);
  const eto = selectEtoById(state, action.payload.etoId);
  if (!eto) return;
  const contribution = selectCalculatedContributionByEtoId(state, eto.etoId);
  if (!contribution || action.payload.investmentEurUlps) {
    yield neuCall(loadComputedContributionFromContract, eto, action.payload.investmentEurUlps);
  }
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO_PREVIEW", loadEtoPreview);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO", loadEto);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETOS", loadEtos);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_CALCULATED_CONTRIBUTION", loadCalculatedContribution);
}
