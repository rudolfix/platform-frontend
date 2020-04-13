import { ContainerModule } from "inversify";

import { TLibSymbol, TLibSymbolType } from "../../../types";
import { ContractsModuleError } from "../errors";
import { IContractsService } from "./ContractService";
import { symbols } from "./symbols";

type TSetupContainerConfig = {
  contractsServiceSymbol: TLibSymbol<IContractsService>;
};

class ContractsServiceNotProvidedError extends ContractsModuleError {
  constructor() {
    super(
      `No contracts service storage found.
       Make sure symbol is bound or it extends a proper base class`,
    );
  }
}

export function setupContainerModule(config: TSetupContainerConfig): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService).toDynamicValue(
      ctx => {
        const symbol = config.contractsServiceSymbol;

        if (!ctx.container.isBound(symbol)) {
          throw new ContractsServiceNotProvidedError();
        }

        return ctx.container.get(symbol);
      },
    );
  });
}
