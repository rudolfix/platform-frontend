import { fork, takeEvery } from "redux-saga/effects";

import { TAction } from "../actions";

function* openInNewWindowSaga(action: TAction): any {
  if (action.type !== "@@router/OPEN_IN_NEW_WINDOW") return;
  const { path, target } = action.payload;

  return window.open(path, target);
}

export function* routingSagas(): any {
  yield fork(takeEvery, "@@router/OPEN_IN_NEW_WINDOW", openInNewWindowSaga);
}
