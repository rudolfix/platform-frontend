import { call, put, select } from "@neufund/sagas";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IUser, IUserInput } from "../../../../lib/api/users/interfaces";
import { actions } from "../../../actions";
import { loadKycRequestData } from "../../../kyc/sagas";
import { neuCall } from "../../../sagasUtils";
import { walletConnectStop } from "../../../wallet-selector/wallet-connect/sagas";
import { loadPreviousWallet } from "../../../web3/sagas";
import { selectWalletType } from "../../../web3/selectors";
import { EWalletType } from "../../../web3/types";

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
  const userWallet = yield* select(selectWalletType);
  if (userWallet === EWalletType.WALLETCONNECT){
    yield neuCall(walletConnectStop);
  }

  yield* call(() => walletConnectStorage.clear());
  yield* call(() => userStorage.clear());
  yield* call(() => jwtStorage.clear());
  yield web3Manager.unplugPersonalWallet();

  yield put(actions.web3.personalWalletDisconnected());

  // reset app state and restart sagas here
  yield put(actions.auth.logoutDone());

  logger.info("user has been logged out");
  logger.setUser(null);
}
