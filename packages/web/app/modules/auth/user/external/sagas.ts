import { call, put } from "@neufund/sagas";
import { authModuleAPI, IUserInput } from "@neufund/shared-modules";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { actions } from "../../../actions";
import { loadKycRequestData } from "../../../kyc/sagas";
import { neuCall } from "../../../sagasUtils";
import { loadPreviousWallet } from "../../../web3/sagas";

export function* loadUser(): Generator<any, any, any> {
  yield neuCall(loadPreviousWallet);

  yield neuCall(authModuleAPI.sagas.loadUser);

  yield neuCall(loadKycRequestData);
}

export function* updateUser(
  _: TGlobalDependencies,
  updatedUser: IUserInput,
): Generator<unknown, void> {
  yield* call(authModuleAPI.sagas.updateUser, updatedUser);
}

export function* logoutUser({
  web3Manager,
  logger,
  userStorage,
}: TGlobalDependencies): Generator<any, any, any> {
  yield* call(() => userStorage.clear());

  yield* call(authModuleAPI.sagas.resetUser);

  yield web3Manager.unplugPersonalWallet();
  yield put(actions.web3.personalWalletDisconnected());

  logger.info("user has been logged out");
}
