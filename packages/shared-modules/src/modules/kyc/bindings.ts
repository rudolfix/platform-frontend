import { ContainerModule } from "inversify";

import { TLibSymbolType } from "../../types";
import { KycApi } from "./lib/http/kyc-api/KycApi";
import { symbols } from "./symbols";

export const setupContainerModule = () =>
  new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.kycApi>>(symbols.kycApi)
      .to(KycApi)
      .inSingletonScope();
  });
