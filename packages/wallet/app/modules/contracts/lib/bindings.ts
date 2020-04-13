import { TLibSymbolType } from "@neufund/shared-modules";
import { ContainerModule } from "inversify";

import { ContractsService } from "./ContractsService";
import { privateSymbols, symbols } from "./symbols";

export function setupBindings(universeContractAddress: string): ContainerModule {
  return new ContainerModule(bind => {
    bind<string>(privateSymbols.universeContractAddress).toConstantValue(universeContractAddress);

    bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService)
      .to(ContractsService)
      .inSingletonScope();
  });
}
