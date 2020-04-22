import { ContainerModule } from "inversify";
import { TLibSymbolType } from "@neufund/shared-modules";
import { symbols } from "./symbols";
import { Permissions } from "./Permissions";

export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.permissions>>(symbols.permissions)
      .to(Permissions)
      .inSingletonScope();
  });
}
