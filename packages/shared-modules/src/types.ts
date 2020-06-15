import { ISagaModule } from "@neufund/sagas";
import {
  Get,
  Opaque,
  OpaqueType,
  ReturnTypeFlatten,
  ReturnTypeStrict,
  Tuple,
  UnionToIntersection,
  ValuesOfUnion,
} from "@neufund/shared-utils";
import { ContainerModule } from "inversify";
import { ActionCreatorsMapObject } from "redux";

type TNeuModuleAPI = {
  actions?: ActionCreatorsMapObject;
  symbols?: Record<string, TLibSymbol<unknown>>;
};

interface INeuModule<S, A extends TNeuModuleAPI> extends ISagaModule<S> {
  libs?: ContainerModule[];
  api?: A;
}

type TModuleSetupSingle<O, S, A> = (config: O) => INeuModule<S, A>;
type TModuleSetupWithDeps<O, S, A> = (config: O) => Tuple<INeuModule<S, A>>;
type TModuleSetup<O, S, A> = TModuleSetupSingle<O, S, A> | TModuleSetupWithDeps<O, S, A>;

type TModule<M extends TModuleSetup<any, any, any>> = ReturnTypeFlatten<M> extends INeuModule<
  any,
  any
>
  ? ReturnTypeFlatten<M>
  : never;

type TModuleApi<M extends TModuleSetup<any, any, any>> = Get<TModule<M>, "api", {}>;

type TModuleApiActions<M extends TModuleSetup<any, any, any>> = Get<TModuleApi<M>, "actions", {}>;

type TModuleActions<M extends TModuleSetup<any, any, any>> = ReturnTypeStrict<
  ValuesOfUnion<TModuleApiActions<M>>
>;

type TModuleState<M extends TModuleSetup<any, any, any>> = UnionToIntersection<
  M extends TModuleSetup<any, infer S, any> ? (S extends object ? S : {}) : never
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
