import { Effect, fork } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { TAction } from "../actions";
import { neuTakeEvery } from "../sagasUtils";

function* openInNewWindowSaga(_: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "@@router/OPEN_IN_NEW_WINDOW") return;
  const { path, target } = action.payload;

  return window.open(path, target);
}

export function* routingSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, "@@router/OPEN_IN_NEW_WINDOW", openInNewWindowSaga);
}
