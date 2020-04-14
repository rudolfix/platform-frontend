import { call, SagaGenerator } from "@neufund/sagas";
import { neuGetBindings } from "@neufund/shared-modules";

import { symbols } from "./lib/symbols";

export function* initializeContracts(): SagaGenerator<void> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
  });

  yield* call(() => contractsService.init());
}
