import { coreModuleApi, TLibSymbolType } from "@neufund/shared-modules";
import { Container } from "inversify";

/**
 * We use plain object for injecting deps into sagas
 */
export const createGlobalDependencies = (container: Container) => ({
  // passes through shared modules
  logger: container.get<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(
    coreModuleApi.symbols.logger,
  ),
});

export type TGlobalDependencies = ReturnType<typeof createGlobalDependencies>;
