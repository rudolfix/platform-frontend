import { coreModuleApi, TLibSymbolType } from "@neufund/shared-modules";
import { Container, ContainerModule } from "inversify";
import { walletEthModuleApi } from "../modules/eth/module";
import { storageModuleApi } from "../modules/storage";
import { notificationModuleApi } from "../modules/notifications/module";
import { symbols } from "./symbols";
import { TConfig } from "./types";
import { Permissions } from "../modules/permissions/Permissions";

export function setupBindings(config: TConfig): ContainerModule {
  return new ContainerModule(bind => {
    bind<TLibSymbolType<typeof symbols.config>>(symbols.config).toConstantValue(config);
    bind<TLibSymbolType<typeof symbols.permissions>>(symbols.permissions).to(Permissions).inSingletonScope();
  });
}

/**
 * We use plain object for injecting deps into sagas
 */

export const createGlobalDependencies = (container: Container) => ({
  // passes through shared modules
  logger: container.get<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(
    coreModuleApi.symbols.logger,
  ),

  appStorage: container.get<TLibSymbolType<typeof storageModuleApi.symbols.appStorage>>(
    storageModuleApi.symbols.appStorage,
  ),

  ethManager: container.get<TLibSymbolType<typeof walletEthModuleApi.symbols.ethManager>>(
    walletEthModuleApi.symbols.ethManager,
  ),

  permissions: container.get<TLibSymbolType<typeof symbols.permissions>>(symbols.permissions),

  notifications: container.get<TLibSymbolType<typeof notificationModuleApi.symbols.notifications>>(notificationModuleApi.symbols.notifications),
});

export type TGlobalDependencies = ReturnType<typeof createGlobalDependencies>;
