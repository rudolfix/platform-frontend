import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { GasModelShape } from "../../lib/api/GasApi";
import { IAppState } from "../../store";
import { actions } from "../actions";
import { neuTakeEvery } from "../sagas";
import { selectGasPrice, selectIsAlreadyLoaded } from "./selectors";

function* ensureGasApiDataSaga({ gasApi, logger }: TGlobalDependencies): any {
  const isAlreadyLoaded: boolean = yield select(
    (state: IAppState): boolean => selectIsAlreadyLoaded(state.gas),
  );

  if (isAlreadyLoaded) {
    const gasPrice: GasModelShape = yield select((state: IAppState) => selectGasPrice(state.gas));
    yield put(actions.gas.gasApiLoaded({ data: gasPrice }));
    return;
  }

  try {
    const gasValue: IHttpResponse<GasModelShape> = yield gasApi.getGas();

    yield put(actions.gas.gasApiLoaded({ data: gasValue.body }));
  } catch (e) {
    logger.error("Error while loading GAS api data.", e);

    yield put(actions.gas.gasApiLoaded({ error: e }));
  }
}

export function* gasApiSagas(): any {
  yield fork(neuTakeEvery, "GAS_API_ENSURE_LOADING", ensureGasApiDataSaga);
}
