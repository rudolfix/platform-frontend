import { ISagaModule } from "@neufund/sagas";
import {
  Opaque,
  OpaqueType,
  ReturnTypeFlatten,
  ReturnTypeStrict,
  Tuple,
  UnionToIntersection,
  Values,
} from "@neufund/shared";
import { ContainerModule } from "inversify";
import { ActionCreatorsMapObject } from "redux";

type TNeuModuleAPI = {
  actions?: ActionCreatorsMapObject;
  symbols?: Record<string, TLibSymbol<unknown>>;
};

interface INeuModule<S> extends ISagaModule<S> {
  libs?: ContainerModule[];
  api?: TNeuModuleAPI;
}

type TModuleSetupSingle<O, S> = (config: O) => INeuModule<S>;
type TModuleSetupWithDeps<O, S> = (config: O) => Tuple<INeuModule<S>>;
type TModuleSetup<O, S> = TModuleSetupSingle<O, S> | TModuleSetupWithDeps<O, S>;

type TModule<M extends TModuleSetup<any, any>> = ReturnTypeFlatten<M> extends INeuModule<unknown>
  ? ReturnTypeFlatten<M>
  : never;

type TModuleApi<M extends TModuleSetup<any, any>> = TModule<M>["api"] extends TNeuModuleAPI
  ? TModule<M>["api"]
  : never;

type TModuleApiActions<M extends TModuleSetup<any, any>> = TModuleApi<M>["actions"];

type TModuleActions<M extends TModuleSetup<any, any>> = ReturnTypeStrict<
  Values<TModuleApiActions<M>>
>;

type TModuleState<M extends TModuleSetup<any, any>> = UnionToIntersection<
  M extends TModuleSetup<any, infer S> ? (S extends object ? S : {}) : never
>;

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
  TNeuModuleAPI,
};
