import { coreModuleApi, TLibSymbolType } from "@neufund/shared-modules";
import { Container } from "inversify";
import { symbols } from "./symbols";

/**
 * We use plain object for injecting deps into sagas
 */

export const createGlobalDependencies = (container: Container) => ({
  // passes through shared modules
  logger: container.get<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(
    coreModuleApi.symbols.logger,
  ),
  appStorage: container.get<TLibSymbolType<typeof symbols.appStorage>>(symbols.appStorage),
  singleKeyAppStorage: container.get<TLibSymbolType<typeof symbols.singleKeyAppStorage>>(
    symbols.singleKeyAppStorage,
  ),
});

export type TGlobalDependencies = ReturnType<typeof createGlobalDependencies>;
