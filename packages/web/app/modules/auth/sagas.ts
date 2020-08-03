import { fork } from "@neufund/sagas";

import { authEmailSagas } from "./email/sagas";
import { authUserSagas } from "./user/sagas";
import { authWatcherSagas } from "./watcher/sagas";

export function* authSagas(): Generator<any, any, any> {
  // sub-sagas
  yield fork(authEmailSagas);
  yield fork(authWatcherSagas);
  yield fork(authUserSagas);
}
