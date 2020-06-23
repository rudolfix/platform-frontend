import { fork, SagaGenerator } from "@neufund/sagas";

import { idNowSagas } from "./id-now/sagas";
import { onfidoSagas } from "./onfido/sagas";

export function setupInstantIdSagas(): () => SagaGenerator<void> {
  return function* kycSagas(): Generator<any, any, any> {
    yield fork(onfidoSagas);
    yield fork(idNowSagas);
  };
}
