import { TLibSymbolType } from "@neufund/shared-modules";
import { ContainerModule } from "inversify";

import { OnfidoSDK } from "./lib/onfido/OnfidoSDK";
import { symbols } from "./symbols";

export const setupContainerModule = () =>
  new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.onfidoSDK>>(symbols.onfidoSDK)
      .to(OnfidoSDK)
      .inSingletonScope();
  });
