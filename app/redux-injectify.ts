import { Middleware, MiddlewareAPI } from "redux";
import { Container } from "inversify";
import * as getParams from "get-params";

export function createInjectMiddleware(
  container: Container,
  customizer?: (container: Container, middlewareApi: MiddlewareAPI<any>) => void,
): Middleware {
  return middlewareApi => {
    // allow caller to customize container with dispatcher
    if (customizer) {
      customizer(container, middlewareApi);
    }
    return next => (action: any) => {
      if (typeof action === "function") {
        const deps = getDependencies(action);

        const injections = deps.map(dep => {
          return container.get(dep);
        });

        return action(...injections);
      }

      return next(action);
    };
  };
}

const dependencyInfoSymbol = Symbol.for("REDUX-INJECTIFY-DEP");

export function getDependencies(func: Function): string[] {
  // try to get deps from explicitly annotated function
  const anyFunc: any = func;
  if (anyFunc[dependencyInfoSymbol]) {
    return anyFunc[dependencyInfoSymbol];
  }
  // or create dependency list based on parameter names
  const params: string[] = getParams(func);
  return params.map(mapParamToDependencyName);
}

// make first letter capital
// ex. dispatcher => Dispatcher,
export function mapParamToDependencyName(param: string): string {
  return param.charAt(0).toUpperCase() + param.slice(1);
}

export function injectableFn(func: Function, dependencies: string[]): Function {
  (func as any)[dependencyInfoSymbol] = dependencies;

  return func;
}

// patch redux dispatch signature to support dispatching functions
declare module "redux" {
  // tslint:disable-next-line
  export interface Dispatch<S> {
    (asyncAction: Function): void;
  }
}
