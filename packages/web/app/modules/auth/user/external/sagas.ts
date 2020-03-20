import { put } from "@neufund/sagas";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IUser, IUserInput } from "../../../../lib/api/users/interfaces";
import { actions } from "../../../actions";
import { loadKycRequestData } from "../../../kyc/sagas";
import { neuCall } from "../../../sagasUtils";
import { loadPreviousWallet } from "../../../web3/sagas";

export function* loadUser({ apiUserService }: TGlobalDependencies): Generator<any, IUser, any> {
  const user: IUser = yield apiUserService.me();
  yield neuCall(loadPreviousWallet);
  yield put(actions.auth.setUser(user));
  yield neuCall(loadKycRequestData);
  return user
}

export function* updateUser(
  { apiUserService }: TGlobalDependencies,
  updatedUser: IUserInput,
): Generator<any, any, any> {
  const user: IUser = yield apiUserService.updateUser(updatedUser);

  yield put(actions.auth.setUser(user));
}

export function* logoutUser({
  web3Manager,
  jwtStorage,
  walletConnectStorage,
  logger,
  userStorage,
}: TGlobalDependencies): Generator<any, any, any> {
  console.log("---logoutUser")
  walletConnectStorage.clear();
  userStorage.clear();
  jwtStorage.clear();
  console.log("logoutUser done")
  yield web3Manager.unplugPersonalWallet();

  yield put(actions.web3.personalWalletDisconnected());
  yield put(actions.auth.reset());
  console.log("user has been logged out");
  logger.info("user has been logged out");
}
