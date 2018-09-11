import BigNumber from "bignumber.js";
import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
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
import { IPublicEtoState } from "./reducer";
import {
  convertToCalculatedContribution,
  selectCurrentCalculatedContribution,
  selectCurrentEto,
} from "./selectors";

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
    const companyData: IHttpResponse<
      TPartialCompanyEtoData
    > = yield apiEtoService.getCompanyDataById(companyId);
    yield put(
      actions.publicEtos.setPreviewEto({
        eto: etoData.body,
        company: companyData.body,
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

    const etos: { [id: string]: TPublicEtoData } = {};
    const order: string[] = [];
    etoData.body.forEach(eto => {
      if (eto.etoId) {
        etos[eto.etoId] = eto;
        order.push(eto.etoId);
      }
    });

    yield put(actions.publicEtos.setPublicEtos(etos));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e, e.message);
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

function* loadCurrentCalculatedContribution(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_CURRENT_CALCULATED_CONTRIBUTION") return;
  const state: IPublicEtoState = yield select((s: IAppState) => s.publicEtos);
  const current = selectCurrentEto(state);
  if (!current) return;
  const contribution = selectCurrentCalculatedContribution(state);
  if (!contribution || action.payload.investmentEurUlps) {
    yield neuCall(loadComputedContributionFromContract, current, action.payload.investmentEurUlps);
  }
}

function* changeCurrentEto(_: TGlobalDependencies, action: TAction): any {
  if (action.type !== "PUBLIC_ETOS_LOAD_CURRENT_PUBLIC_ETO") return;
  const { etoId } = action.payload;
  yield put(actions.publicEtos.setCurrentEto(etoId));
  yield put(actions.publicEtos.loadCurrentCalculatedContribution());
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETO_PREVIEW", loadEtoPreview);
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_ETOS", loadEtos);
  yield fork(
    neuTakeEvery,
    "PUBLIC_ETOS_LOAD_CURRENT_CALCULATED_CONTRIBUTION",
    loadCurrentCalculatedContribution,
  );
  yield fork(neuTakeEvery, "PUBLIC_ETOS_LOAD_CURRENT_PUBLIC_ETO", changeCurrentEto);
}
