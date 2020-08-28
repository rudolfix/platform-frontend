import { TLibSymbolType } from "@neufund/shared-modules";
import { ContainerModule } from "inversify";

import { Biometrics } from "./Biometrics";
import { privateSymbols } from "./symbols";

export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof privateSymbols.biometrics>>(privateSymbols.biometrics)
      .to(Biometrics)
      .inSingletonScope();
  });
}
