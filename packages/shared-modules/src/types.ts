import { ISagaModule } from "@neufund/sagas";
import { Opaque, OpaqueType, ReturnTypeStrict, Values } from "@neufund/shared";
import { ContainerModule } from "inversify";
import { ActionCreatorsMapObject } from "redux";

interface INeuModule<S> extends ISagaModule<S> {
  libs?: ContainerModule[];
  api?: TModuleAPI;
}

type TModuleAPI = {
  actions?: ActionCreatorsMapObject;
  symbols?: Record<string, TLibSymbol<any>>;
};

type TModuleSetup<O, S> = (config: O) => INeuModule<S>;

type TModuleApi<M extends TModuleSetup<any, any>> = ReturnTypeStrict<M>["api"] extends TModuleAPI
  ? ReturnTypeStrict<M>["api"]
  : never;

type TModuleApiActions<M extends TModuleSetup<any, any>> = TModuleApi<
  M
>["actions"] extends ActionCreatorsMapObject
  ? TModuleApi<M>["actions"]
  : never;

type TModuleActions<M extends TModuleSetup<any, any>> = ReturnTypeStrict<
  Values<TModuleApiActions<M>>
>;

type TModuleState<M extends TModuleSetup<any, any>> = M extends TModuleSetup<any, infer S>
  ? S
  : never;

type TLibSymbol<K> = Opaque<K, symbol>;

type TLibSymbolType<T extends TLibSymbol<any>> = OpaqueType<T>;

type TSymbols<S extends Record<string, TLibSymbol<any>>> = { [P in keyof S]: TLibSymbolType<S[P]> };

type TModuleSymbols<
  Module extends { symbols?: Record<string, TLibSymbol<any>> }
> = Module["symbols"] extends Record<string, TLibSymbol<any>> ? TSymbols<Module["symbols"]> : {};

export {
  TLibSymbol,
  TModuleSymbols,
  TSymbols,
  TLibSymbolType,
  INeuModule,
  TModuleSetup,
  TModuleActions,
  TModuleState,
  TModuleAPI,
};
