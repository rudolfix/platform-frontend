import { call, put, SagaGenerator, takeEvery } from "@neufund/sagas";

import { neuGetBindings } from "../../../utils";
import { coreModuleApi } from "../../core/module";
import { symbols } from "../lib/symbols";
import { UserNotExisting } from "../lib/users/UsersApi";
import { EWalletSubType, EWalletType, IUser, IUserInput } from "../module";
import { userActions } from "./actions";
import { TMetadata } from "./types";

function* setLoggerUser(
  action: ReturnType<typeof userActions.setUser> | ReturnType<typeof userActions.reset>,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    apiUserService: symbols.apiUserService,
    logger: coreModuleApi.symbols.logger,
  });

  if (action.type === userActions.setUser.getType()) {
    const user = action.payload.user;

    logger.info("Setting logged in user for logger");

    logger.setUser({ id: user.userId, type: user.type, walletType: user.walletType });
  } else {
    logger.info("Removing logged in user for logger");

    logger.setUser(null);
  }
}

export function* resetUser(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  yield put(userActions.reset());

  logger.info("User has been cleared out");
}

export function* loadUser(): SagaGenerator<void> {
  const { apiUserService } = yield* neuGetBindings({
    apiUserService: symbols.apiUserService,
  });

  const user = yield* call(() => apiUserService.me());

  yield put(userActions.setUser(user));
}

export function* updateUser(updatedUser: IUserInput): SagaGenerator<void> {
  const { apiUserService } = yield* neuGetBindings({
    apiUserService: symbols.apiUserService,
  });

  const user = yield* call(() => apiUserService.updateUser(updatedUser));

  yield put(userActions.setUser(user));
}

export function* loadOrCreateUser(metadata: TMetadata): SagaGenerator<void> {
  const user: IUser = yield* call(loadOrCreateUserInternal, metadata);

  yield put(userActions.setUser(user));
}

function* loadOrCreateUserInternal(metadata: TMetadata): SagaGenerator<IUser> {
  const { apiUserService } = yield* neuGetBindings({
    apiUserService: symbols.apiUserService,
  });

  try {
    const user = yield* call(() => apiUserService.me());

    if (user.walletType === metadata.walletType && user.walletSubtype === metadata.walletSubType) {
      return user;
    }
    // if wallet type changed send correct wallet type to the backend
    return yield* call(() =>
      apiUserService.updateUser({
        ...user,
        walletType: metadata.walletType,
        walletSubtype: metadata.walletSubType,
      }),
    );
  } catch (e) {
    if (!(e instanceof UserNotExisting)) {
      throw e;
    }
  }
  // for light wallet we need to send slightly different request
  if (metadata.walletType === EWalletType.LIGHT) {
    return yield* call(() =>
      apiUserService.createAccount({
        newEmail: metadata.email,
        salt: metadata.salt,
        backupCodesVerified: false,
        type: metadata.userType,
        walletType: metadata.walletType,
        walletSubtype: EWalletSubType.UNKNOWN,
      }),
    );
  } else {
    return yield* call(() =>
      apiUserService.createAccount({
        backupCodesVerified: true,
        type: metadata.userType,
        walletType: metadata.walletType,
        walletSubtype:
          metadata.walletType === EWalletType.BROWSER
            ? metadata.walletSubType
            : EWalletSubType.UNKNOWN,
      }),
    );
  }
}

export function* authUserSagas(): SagaGenerator<void> {
  yield takeEvery([userActions.setUser, userActions.reset], setLoggerUser);
}
