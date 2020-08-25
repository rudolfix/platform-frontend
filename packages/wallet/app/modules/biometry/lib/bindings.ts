import { TLibSymbolType } from "@neufund/shared-modules";
import { ContainerModule } from "inversify";

import { Biometry } from "./Biometry";
import { privateSymbols } from "./symbols";

export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof privateSymbols.biometry>>(privateSymbols.biometry)
      .to(Biometry)
      .inSingletonScope();
  });
}
