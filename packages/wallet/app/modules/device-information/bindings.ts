import { ContainerModule } from "inversify";
import { TLibSymbolType } from "@neufund/shared-modules";
import { symbols } from "./symbols";
import { DeviceInformation } from "./DeviceInformation";

export function setupBindings(): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.deviceInformation>>(symbols.deviceInformation)
      .to(DeviceInformation)
      .inSingletonScope();
  });
}
