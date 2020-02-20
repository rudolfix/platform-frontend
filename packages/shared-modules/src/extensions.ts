import { IExtension } from "@neufund/sagas";
import { Container } from "inversify";

import { INeuModule } from "./types";

/**
 * Load context modules from module libs into global container
 *
 * @param container - Inversify container where all modules gonna bee loaded
 *
 * @returns A configuration object you can later pass to store `extensions`
 */
const getLoadContextExtension = (container: Container): IExtension => ({
  onModuleAdded: (module: INeuModule<unknown>) => {
    if (module.libs) {
      container.load(...module.libs);
    }
  },
  onModuleRemoved: (module: INeuModule<unknown>) => {
    if (module.libs) {
      container.unload(...module.libs);
    }
  },
});

/**
 * Load dependencies into sagas context deps.
 * Should be required after `getLoadContextExtension` so global context is populated with modules
 *
 * @param rootModule - The root application module
 * @param createGlobalDeps - Creates an object with global dependencies
 * @param context - redux-saga context object
 */
const getContextToDepsExtension = <T extends {}>(
  rootModule: INeuModule<unknown>,
  createGlobalDeps: (container: Container) => T,
  context: {
    container: Container;
    deps?: T;
  },
): IExtension => ({
  onModuleAdded: (module: INeuModule<unknown>) => {
    if (module.id === rootModule.id) {
      context.deps = createGlobalDeps(context.container);
    }
  },
  onModuleRemoved: (module: INeuModule<unknown>) => {
    if (module.id === rootModule.id) {
      throw new Error(
        `Root module "${rootModule.id}" loaded into the sagas "deps" context should never be removed`,
      );
    }
  },
});

export { getContextToDepsExtension, getLoadContextExtension };
