import { createStore, getSagaExtension, SagaMiddleware } from "@neufund/sagas";
import {
  coalesceProviders,
  expectSaga as expectSagaNative,
  matchers,
  providers,
  SagaType,
} from "@neufund/sagas/tests";
import { Container } from "inversify";

import { getLoadContextExtension } from "../extensions";
import { INeuModule } from "../types";

/**
 * Bootstrap modules and provides an access to utility methods
 *
 * @todo Do not return whole container but rather `bind` and `get` methods
 *       that will make sure we only use symbols defined in `modules` api's.
 *
 * @returns Returns a helper utility methods for tests
 * @returns .getState - Returns the current redux state
 * @returns .dispatch - Dispatches an action to the store
 * @returns .expectSaga - Allows to tests individual sagas without triggering store side effects
 * @returns .runSaga - Runs the given saga and all related side effects (for .e.g store modifications based on module reducers)
 */
const bootstrapModule = <T extends INeuModule<any, any>[]>(modules: T) => {
  const container = new Container();

  const sagaExtension = getSagaExtension({ container });
  const sagaMiddleware = sagaExtension.middleware![0] as SagaMiddleware;

  const store = createStore(
    {
      extensions: [getLoadContextExtension(container), sagaExtension],
    },
    ...modules,
  );

  const expectSaga = <S extends SagaType>(generator: S, ...sagaArgs: Parameters<S>) => {
    const saga = expectSagaNative(generator, ...sagaArgs);

    const buildInProviders = coalesceProviders([[matchers.getContext("container"), container]]);

    const originalProvider = saga.provide;

    // Given that providers always overwrite existing providers to keep `container` always available though context
    // we need to patch original provider
    saga.provide = (
      newProviders:
        | providers.EffectProviders
        | (providers.EffectProviders | providers.StaticProvider)[],
    ) => {
      const coalescedNewProviders = Array.isArray(newProviders)
        ? coalesceProviders(newProviders)
        : newProviders;

      const pr = {
        ...coalescedNewProviders,
        getContext: providers.composeProviders(
          buildInProviders.getContext,
          coalescedNewProviders.getContext,
        ),
      };

      return originalProvider(pr);
    };

    return saga.withState(store.getState()).provide(buildInProviders);
  };

  return {
    getState: store.getState,
    dispatch: store.dispatch,
    runSaga: sagaMiddleware.run,
    container,
    expectSaga,
  };
};

export { bootstrapModule };
