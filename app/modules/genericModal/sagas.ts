import { put, take } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";

export function* displayConfirmationModalSaga(
  _: TGlobalDependencies,
  title: string,
  description?: string,
): any {
  yield put(actions.genericModal.showGenericConfirmationModal(title, description));

  // wait until its dismissed
  yield take("GENERIC_MODAL_HIDE");
}

export function* displayErrorModalSaga(
  _: TGlobalDependencies,
  title: string,
  description?: string,
): any {
  yield put(actions.genericModal.showGenericErrorModal(title, description));

  // wait until its dismissed
  yield take("GENERIC_MODAL_HIDE");
}
